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
        backgroundImage: `url(${dogImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        zIndex: 1,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 80,
          right: 0,
          bottom: 0,
          maxHeight: "calc(100vh - 80px)",
          left: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
        },
        pt: 10,
        pb: 12,
      }}
    >
      <Container maxWidth="md">
        {/* welcome title section */}
        <Box
          textAlign="center"
          mb={10}
          sx={{
            position: "relative",
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
              backgroundRepeat: "no-repeat",
              zIndex: -1,
            },
          }}
        >
          <Box sx={{ display: "inline-block", position: "relative", mb: 4 }}>
            {/* transparent text */}
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
              fontSize: "1.25rem",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            AI-powered pet detection
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              component={Link}
              to="/analyze"
              variant="contained"
              size="large"
              sx={{
                bgcolor: "#3d9970",
                fontSize: "1.1rem",
                fontWeight: 600,
                "&:hover": { bgcolor: "#2e7d5a" },
                px: 4,
                py: 1.5,
                boxShadow: 4,
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
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "#ffffff",
                borderColor: "#ffffff",
                px: 4,
                py: 1.5,
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

        {/* feature cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 3,
            mt: 8,
          }}
        >
          {[
            {
              title: "Detect Pets Automatically",
              description:
                "Our AI scans your images and identifies cats or dogs instantly.",
              icon: <PetsIcon sx={{ fontSize: 50, color: "#3d9970" }} />,
            },
            {
              title: "Visualize Detection",
              description:
                "See bounding boxes and segmentation masks highlighting each pet.",
              icon: (
                <CropOriginalIcon sx={{ fontSize: 50, color: "#3d9970" }} />
              ),
            },
            {
              title: "No Pets?",
              description: "If no pets are found, we’ll clearly inform.",
              icon: <InfoIcon sx={{ fontSize: 50, color: "#3d9970" }} />,
            },
          ].map((item, index) => (
            <Box
              key={index}
              sx={{
                textAlign: "center",
                p: 4,
                borderRadius: 4,
                background: "rgba(255, 255, 255, 0.25)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px) scale(1.02)",
                  boxShadow: "0 12px 36px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              <Box sx={{ mb: 2 }}>{item.icon}</Box>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "#3d9970", fontWeight: 700, fontSize: "1.4rem" }}
              >
                {item.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontSize: "1.2rem", color: "rgba(0, 0, 0, 0.7)" }}
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
