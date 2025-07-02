import React, { useEffect,useState, useRef, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography,
  Alert,
  Divider,
  Chip,
  Stack,
  Tabs,
  Tab,
  IconButton,
  ThemeProvider,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import PetsIcon from "@mui/icons-material/Pets";
import ClearIcon from "@mui/icons-material/Clear";
import DownloadIcon from "@mui/icons-material/Download";
import { styled } from "@mui/material/styles";
import theme from "../../theme";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const PreviewImage = styled("img")({
  maxWidth: "100%",
  maxHeight: "300px",
  display: "block",
  margin: "auto",
  borderRadius: "8px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
});

const VisualizationContainer = styled("div")({
  position: "relative",
  maxWidth: "100%",
  maxHeight: "300px",
  margin: "10px auto",
  borderRadius: "8px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  border: "1px solid #ddd",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const VisualizationImage = styled("img")({
  maxWidth: "100%",
  maxHeight: "300px",
  display: "block",
  borderRadius: "8px",
  border: "3px solid #3d9970",
});

const DropZone = styled("div")(({ theme, isDragActive }) => ({
  border: `2px dashed ${
    isDragActive ? theme.palette.primary.main : theme.palette.divider
  }`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: "center",
  backgroundColor: isDragActive
    ? theme.palette.action.hover
    : theme.palette.background.paper,
  cursor: "pointer",
  transition: "all 0.2s ease",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function AnalyzePage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("original");
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    if (resultsRef.current && results) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [results]);
  const resetAnalysis = () => {
    setResults(null);
    setError(null);
    setActiveTab("original");
  };

  const handleDownload = useCallback((imageSrc, filename) => {
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download =
      filename || `pet-detection-${new Date().toISOString().slice(0, 10)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const processFile = (file) => {
    if (!file) return;

    resetAnalysis();

    if (!file.type.match("image.*")) {
      setError("Please upload an image file (JPEG, PNG, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    setImage(file);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleAnalyze = async () => {
    if (!image) {
      setError("Please upload an image first");
      return;
    }

    resetAnalysis();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch(
        "http://pets-detection-segmentation-web-application-production.up.railway.app/api/pets/analyze",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error (${response.status})`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Analysis failed");
      }

      setResults(data);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(
        err.message.includes("too large")
          ? "Image is too large (max 10MP)"
          : err.message.includes("Invalid")
          ? "Invalid image file"
          : "Analysis failed. Please try another image."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setPreview(null);
    resetAnalysis();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const renderResultsSection = () => {
    if (!results) return null;

    const hasDetectionVis = results.visualizations?.detection != null;
    const hasSegmentationVis = results.visualizations?.segmentation != null;
    const hasPets = results.detections?.length > 0;

    const NoPetsMessage = () => (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "100%",
          textAlign: "center",
          p: 4,
        }}
      >
        <PetsIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
        <Typography variant="h5" color="text.secondary">
          No pets detected
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Try uploading a different image with clearer pet features
        </Typography>
      </Box>
    );

    const renderVisualization = () => {
      if (!preview) return null;

      switch (activeTab) {
        case "original":
          return (
            <Box sx={{ position: "relative" }}>
              <VisualizationContainer>
                <VisualizationImage
                  src={preview}
                  alt="Original image"
                  onError={(e) => {
                    console.error("Error loading image:", e);
                    e.target.onerror = null;
                    e.target.src = preview;
                  }}
                />
              </VisualizationContainer>
              <IconButton
                onClick={() => handleDownload(preview, "original-image.png")}
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  backgroundColor: "background.paper",
                  padding: "8px",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
                aria-label="download original image"
              >
                <DownloadIcon fontSize="medium" color="primary" />
              </IconButton>
            </Box>
          );

        case "detection":
          if (!hasPets) {
            return (
              <VisualizationContainer>
                <NoPetsMessage />
              </VisualizationContainer>
            );
          }
          return (
            <Box sx={{ position: "relative" }}>
              <VisualizationContainer>
                {hasDetectionVis ? (
                  <VisualizationImage
                    src={`data:image/png;base64,${results.visualizations.detection}`}
                    alt="Detection visualization"
                  />
                ) : (
                  <NoPetsMessage />
                )}
              </VisualizationContainer>
              {hasDetectionVis && (
                <IconButton
                  onClick={() =>
                    handleDownload(
                      `data:image/png;base64,${results.visualizations.detection}`,
                      "pet-detection.png"
                    )
                  }
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    backgroundColor: "background.paper",
                    padding: "8px",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                  aria-label="download detection image"
                >
                  <DownloadIcon fontSize="large" color="primary" />
                </IconButton>
              )}
            </Box>
          );

        case "segmentation":
          if (!hasPets) {
            return (
              <VisualizationContainer>
                <NoPetsMessage />
              </VisualizationContainer>
            );
          }
          return (
            <Box sx={{ position: "relative" }}>
              <VisualizationContainer>
                {hasSegmentationVis ? (
                  <VisualizationImage
                    src={`data:image/png;base64,${results.visualizations.segmentation}`}
                    alt="Segmentation visualization"
                  />
                ) : (
                  <NoPetsMessage />
                )}
              </VisualizationContainer>
              {hasSegmentationVis && (
                <IconButton
                  onClick={() =>
                    handleDownload(
                      `data:image/png;base64,${results.visualizations.segmentation}`,
                      "pet-segmentation.png"
                    )
                  }
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    backgroundColor: "background.paper",
                    padding: "8px",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                  aria-label="download segmentation image"
                >
                  <DownloadIcon fontSize="large" color="primary" />
                </IconButton>
              )}
            </Box>
          );

        default:
          return null;
      }
    };

    const renderDetectionDetails = () => {
      if (!hasPets) {
        return (
          <Alert severity="info" sx={{ mt: 2 }}>
            No pets detected in the image. Try uploading a clearer image with
            visible pets.
          </Alert>
        );
      }

      return (
        <Stack spacing={2}>
          {results.detections?.map((detection, index) => (
            <Card key={index}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <PetsIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" component="div">
                    {detection.class?.charAt(0).toUpperCase() +
                      detection.class?.slice(1)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  <Chip
                    label={`Confidence: ${(
                      (detection.confidence || 0) * 100
                    ).toFixed(1)}%`}
                    color="primary"
                    size="small"
                  />
                  {detection.bbox && (
                    <>
                      <Chip
                        label={`X: ${detection.bbox[0]?.toFixed(0)}`}
                        color="secondary"
                        size="small"
                      />
                      <Chip
                        label={`Y: ${detection.bbox[1]?.toFixed(0)}`}
                        color="secondary"
                        size="small"
                      />
                      <Chip
                        label={`Width: ${(
                          detection.bbox[2] - detection.bbox[0]
                        )?.toFixed(0)}`}
                        color="secondary"
                        size="small"
                      />
                      <Chip
                        label={`Height: ${(
                          detection.bbox[3] - detection.bbox[1]
                        )?.toFixed(0)}`}
                        color="secondary"
                        size="small"
                      />
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      );
    };

    const renderAnalysisMetadata = () => {
      if (!results?.metadata) return null;

      const metadataFields = [
        { label: "Classification Model", key: "classification_model" },
        { label: "Detection Model", key: "detection_model" },
        { label: "Segmentation Model", key: "segmentation_model" },
        { label: "Device", key: "device" },
        { label: "Torch Version", key: "torch_version" },
      ];

      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {metadataFields.map((field) => (
            <Box
              key={field.key}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography variant="body2" color="text.secondary">
                {field.label}:
              </Typography>
              <Typography variant="body2">
                {results.metadata[field.key] || "N/A"}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    };

    return (
      <>
        
        <Divider sx={{ my: 4 }} />

        <Typography variant="h2" gutterBottom sx={{ mb: 2 }}>
          <PetsIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Analysis Results
        </Typography>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab label="Original" value="original" />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                Detection
                {!hasPets && (
                  <Chip
                    label="N/A"
                    size="small"
                    color="warning"
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
            }
            value="detection"
            disabled={!hasPets}
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                Segmentation
                {!hasPets && (
                  <Chip
                    label="N/A"
                    size="small"
                    color="warning"
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
            }
            value="segmentation"
            disabled={!hasPets}
          />
        </Tabs>

        {renderVisualization()}

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h3" sx={{ mb: 2 }}>
                Detection Details
              </Typography>
              {renderDetectionDetails()}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h3" sx={{ mb: 2 }}>
                Analysis Metadata
              </Typography>
              {renderAnalysisMetadata()}
            </Paper>
          </Grid>
        </Grid>
      </>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: theme.palette.background.default,
          py: 8,
          position: "relative",
        }}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h1" gutterBottom>
            Pet Detection Analysis
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" paragraph>
            Upload an image to detect cats and dogs
          </Typography>

          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <DropZone
                    isDragActive={isDragActive}
                    onClick={() => fileInputRef.current?.click()}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <CloudUploadIcon
                      fontSize="large"
                      color={isDragActive ? "primary" : "action"}
                    />
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      {isDragActive
                        ? "Drop your image here"
                        : "Drag & drop an image or click to browse"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Supports JPEG, PNG
                    </Typography>
                  </DropZone>

                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                  />

                  {image && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleReset}
                      fullWidth
                      startIcon={<ClearIcon />}
                      disabled={loading}
                    >
                      Clear Image
                    </Button>
                  )}
                </Box>

                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                {preview ? (
                  <Box sx={{ position: "relative" }}>
                    <PreviewImage src={preview} alt="Uploaded preview" />
                    <IconButton
                      onClick={() =>
                        handleDownload(preview, "original-image.png")
                      }
                      sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        backgroundColor: "background.paper",
                        padding: "8px",
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                      aria-label="download original image"
                    >
                      <DownloadIcon fontSize="large" color="primary" />
                    </IconButton>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      height: 200,
                      width: 200,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "action.hover",
                      borderRadius: 1,
                    }}
                  >
                    <ImageIcon
                      sx={{ fontSize: 60, color: "action.disabled" }}
                    />
                  </Box>
                )}
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleAnalyze}
                disabled={!image || loading}
                startIcon={loading ? <CircularProgress size={24} /> : null}
                sx={{ minWidth: 200 }}
              >
                {loading ? "Analyzing..." : "Analyze Image"}
              </Button>
            </Box>
          </Paper>

          <Box ref={resultsRef} sx={{ mt: 6 }}>
            {renderResultsSection()}
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
