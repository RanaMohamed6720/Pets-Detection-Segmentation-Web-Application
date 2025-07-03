package com.rana.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.*;
import java.util.concurrent.TimeUnit;

@Service
public class PythonService {
    private static final Logger logger = LoggerFactory.getLogger(PythonService.class);

    @Value("${python.path:python3}")
    private String pythonPath;

    @Value("${python.script:analyze.py}")
    private String pythonScript;

    @Value("${python.timeout:60}")
    private int timeoutSeconds;

    public String analyzeImage(MultipartFile image) throws IOException {
        Path tempImage = null;
        String tempScriptPath = null;

        try {
            // 1. Create temp file with validation
            tempImage = createTempImageFile(image);
            logger.info("Temporary image created at: {}", tempImage);

            // 2. Get absolute script path with validation
            tempScriptPath = extractScriptToTempFile();
            logger.info("Python script extracted to: {}", tempScriptPath);

            // 3. Build and execute process
            ProcessBuilder pb = buildProcess(tempScriptPath, tempImage);
            logger.info("Process command: {}", pb.command());

            Process process = pb.start();
            ProcessResult result = captureProcessOutput(process);

            if (result.exitCode != 0) {
                throw new RuntimeException(
                        "Python script failed (exit code " + result.exitCode + "):\n" + result.output);
            }

            return result.output;

        } catch (Exception e) {
            logger.error("Processing failed: {}", e.getMessage(), e);
            throw new IOException("Image processing failed: " + e.getMessage(), e);
        } finally {
            cleanupTempFile(tempImage);
            cleanupTempFile(tempScriptPath == null ? null : Paths.get(tempScriptPath));
        }
    }

    private Path createTempImageFile(MultipartFile image) throws IOException {
        Path tempFile = Files.createTempFile("pet-", ".jpg");
        try {
            image.transferTo(tempFile);
            // Verify the file was written correctly
            if (Files.size(tempFile) == 0) {
                throw new IOException("Failed to write image to temp file");
            }
            return tempFile;
        } catch (IOException e) {
            Files.deleteIfExists(tempFile);
            throw e;
        }
    }

    private String extractScriptToTempFile() throws IOException {
        String scriptName = pythonScript;
        Path tempScript = Files.createTempFile("analyze-", ".py");

        try (InputStream in = getClass().getResourceAsStream("/python/" + scriptName)) {
            if (in == null) {
                throw new FileNotFoundException("Python script not found in resources: " + scriptName);
            }
            Files.copy(in, tempScript, StandardCopyOption.REPLACE_EXISTING);
        }

        // Set executable (for Linux, safe on Windows too)
        tempScript.toFile().setExecutable(true);
        return tempScript.toAbsolutePath().toString();
    }

    private ProcessBuilder buildProcess(String scriptPath, Path imagePath) {
        ProcessBuilder pb = new ProcessBuilder(
                pythonPath,
                scriptPath,
                imagePath.toString());
        pb.redirectErrorStream(true);
        return pb;
    }

    private ProcessResult captureProcessOutput(Process process)
            throws InterruptedException, IOException {

        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
                logger.debug("PYTHON> {}", line);
            }
        }

        boolean completed = process.waitFor(timeoutSeconds, TimeUnit.SECONDS);
        if (!completed) {
            process.destroyForcibly();
            throw new RuntimeException("Python script timed out after " + timeoutSeconds + " seconds");
        }

        return new ProcessResult(process.exitValue(), output.toString());
    }

    private void cleanupTempFile(Path file) {
        if (file != null) {
            try {
                Files.deleteIfExists(file);
                logger.info("Cleaned up temp file: {}", file);
            } catch (IOException e) {
                logger.warn("Failed to delete temp file: {}", file, e);
            }
        }
    }

    private static class ProcessResult {
        final int exitCode;
        final String output;

        ProcessResult(int exitCode, String output) {
            this.exitCode = exitCode;
            this.output = output;
        }
    }
}
