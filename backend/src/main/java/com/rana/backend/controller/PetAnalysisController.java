package com.rana.backend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rana.backend.service.PythonService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/pets")
public class PetAnalysisController {

    private static final Logger logger = LoggerFactory.getLogger(PetAnalysisController.class);

    @Autowired
    private PythonService pythonService;

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> analyzeImage(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam("image") MultipartFile image) {

        try {
            // 1. Basic validation
            if (image.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "No image provided"));
            }

            // 2. Verify image type
            String contentType = image.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Only image files are allowed"));
            }

            // 3. Process image
            String resultJson = pythonService.analyzeImage(image);
            JsonNode result = new ObjectMapper().readTree(resultJson);

            // 4. Handle Python script errors
            if (!result.path("success").asBoolean()) {
                logger.error("Python processing error: {}", result);
                return ResponseEntity.internalServerError()
                        .body(Map.of(
                                "error", result.path("error").asText("Processing failed"),
                                "traceback", result.path("traceback").asText("")));
            }

            // 5. Build complete response with all fields
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("classification", result.path("classification").asText("unknown"));

            // Handle detections - ensure it's always an array
            JsonNode detections = result.path("detections");
            response.put("detections", detections.isMissingNode() ? new Object[0] : detections);

            // Handle visualizations
            JsonNode visualizations = result.path("visualizations");
            Map<String, String> vizMap = new HashMap<>();
            vizMap.put("detection", visualizations.path("detection").asText(""));
            vizMap.put("segmentation", visualizations.path("segmentation").asText(""));
            response.put("visualizations", vizMap);

            // Handle metadata
            JsonNode metadata = result.path("metadata");
            Map<String, String> metaMap = new HashMap<>();
            metaMap.put("device", metadata.path("device").asText("unknown"));
            metaMap.put("torch_version", metadata.path("torch_version").asText("unknown"));
            metaMap.put("classification_model", metadata.path("classification_model").asText("unknown"));
            metaMap.put("detection_model", metadata.path("detection_model").asText("unknown"));
            metaMap.put("segmentation_model", metadata.path("segmentation_model").asText("unknown"));
            metaMap.put("image_width", metadata.path("image_width").asText("0"));
            metaMap.put("image_height", metadata.path("image_height").asText("0"));
            response.put("metadata", metaMap);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Image processing failed", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "error", "Image processing failed",
                            "details", e.getMessage(),
                            "exception", e.getClass().getSimpleName()));
        }
    }
}