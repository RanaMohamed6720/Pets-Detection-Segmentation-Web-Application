import { Button, Container, Typography, Box, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import dogImage from "../../assets/dog.jpg";
import PetsIcon from "@mui/icons-material/Pets";
import CropOriginalIcon from "@mui/icons-material/CropOriginal";
import InfoIcon from "@mui/icons-material/Info";

const HomePage = () => {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        pt: 10,
        pb: 12,
        "&::before": {
          content: '""',
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${dogImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          zIndex: -2,
          filter: "brightness(0.4)",
        },
      }}
    >
      <Container maxWidth="md">
        {/* Welcome title section */}
        <Box textAlign="center" mb={10}>
          <Box sx={{ display: "inline-block", position: "relative", mb: 4 }}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                backgroundImage: `url(${dogImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                textShadow: "none",
                position: "relative",
                zIndex: 2,
                fontSize: { xs: "2.75rem", sm: "3.25rem", md: "4rem" },
              }}
            >
              Welcome to PetDetect
            </Typography>
          </Box>

          <Typography
            variant="h5"
            component="h2"
            color="white"
            mb={4}
            sx={{
              fontWeight: 400,
              fontSize: { xs: "1rem", sm: "1.25rem" },
              textShadow: "0 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            AI-powered pet detection
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              component={Link}
              to="/analyze"
              variant="contained"
              size="large"
              sx={{
                bgcolor: "#3d9970",
                fontSize: { xs: "1rem", sm: "1.1rem" },
                fontWeight: 600,
                "&:hover": { bgcolor: "#2e7d5a" },
                px: 4,
                py: 1.5,
                boxShadow: 4,
                minWidth: { xs: "200px", sm: "auto" },
              }}
            >
              Start Analyzing
            </Button>
            <Button
              component={Link}
              to="/features"
              variant="outlined"
              size="large"
              sx={{
                fontSize: { xs: "1rem", sm: "1.1rem" },
                fontWeight: 600,
                color: "white",
                borderColor: "white",
                px: 4,
                py: 1.5,
                minWidth: { xs: "200px", sm: "auto" },
                "&:hover": {
                  borderColor: "#ccc",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Learn More
            </Button>
          </Stack>
        </Box>

        {/* Feature cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 3,
            mt: 4,
          }}
        >
          {[
            {
              title: "Detect Pets Automatically",
              description:
                "Our AI scans your images and identifies cats or dogs instantly.",
              icon: <PetsIcon sx={{ fontSize: 40, color: "#3d9970" }} />,
            },
            {
              title: "Visualize Detection",
              description:
                "See bounding boxes and segmentation masks highlighting each pet.",
              icon: (
                <CropOriginalIcon sx={{ fontSize: 40, color: "#3d9970" }} />
              ),
            },
            {
              title: "No Pets?",
              description: "If no pets are found, we'll clearly inform you.",
              icon: <InfoIcon sx={{ fontSize: 40, color: "#3d9970" }} />,
            },
          ].map((item, index) => (
            <Box
              key={index}
              sx={{
                textAlign: "center",
                p: 3,
                borderRadius: 3,
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 28px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <Box sx={{ mb: 1.5 }}>{item.icon}</Box>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: "#3d9970",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                }}
              >
                {item.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.9rem",
                }}
              >
                {item.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
