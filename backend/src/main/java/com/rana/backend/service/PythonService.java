package com.rana.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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
        try {
            // 1. Create temp file with validation
            tempImage = createTempImageFile(image);
            logger.info("Temporary image created at: {}", tempImage);

            // 2. Get absolute script path with validation
            String scriptPath = getValidatedScriptPath();

            // 3. Build and execute process
            ProcessBuilder pb = buildProcess(scriptPath, tempImage);
            logger.info("Process command: {}", pb.command());

            // 4. Execute with full error capture
            Process process = pb.start();
            ProcessResult result = captureProcessOutput(process);

            if (result.exitCode != 0) {
                throw new RuntimeException(String.format(
                        "Python script failed with exit code %d. Output: %s",
                        result.exitCode, result.output));
            }

            return result.output;
        } catch (Exception e) {
            logger.error("Processing failed: {}", e.getMessage());
            throw new IOException("Image processing failed: " + e.getMessage(), e);
        } finally {
            cleanupTempFile(tempImage);
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

    private String getValidatedScriptPath() throws IOException {
        try {
            URL resource = getClass().getResource("/python/" + pythonScript);
            if (resource == null) {
                throw new FileNotFoundException(
                        "Python script not found in resources: " + pythonScript);
            }

            Path scriptPath = Paths.get(resource.toURI());
            if (!Files.exists(scriptPath)) {
                throw new FileNotFoundException(
                        "Python script not found at: " + scriptPath);
            }

            // Verify execute permission
            if (!Files.isReadable(scriptPath)) {
                throw new SecurityException(
                        "No read permission for script: " + scriptPath);
            }

            return scriptPath.toAbsolutePath().toString();
        } catch (URISyntaxException e) {
            throw new IOException("Invalid script path URI", e);
        }
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
            throw new RuntimeException(
                    "Process timed out after " + timeoutSeconds + " seconds");
        }

        return new ProcessResult(
                process.exitValue(),
                output.toString());
    }

    private void cleanupTempFile(Path tempFile) {
        if (tempFile != null) {
            try {
                Files.deleteIfExists(tempFile);
                logger.info("Cleaned up temp file: {}", tempFile);
            } catch (IOException e) {
                logger.warn("Failed to delete temp file: {}", tempFile, e);
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