import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Classification from "../../assets/classification.png";
import Detection from "../../assets/detection.png";
import Segmentation from "../../assets/segmentation.png";

const features = [
  {
    id: 1,
    title: "Classification",
    description: "determines if pets are present in the image.",
    image: Classification,
  },
  {
    id: 2,
    title: "Detection",
    description: "identifies and localizes pets using bounding boxes.",
    image:Detection,
  },
  {
    id: 3,
    title: "Segmentation",
    description: "generates pixel-level masks for the pets.",
    image:Segmentation,
  },
];

const FeaturesPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        py: 8,
        position: "relative",
        zIndex: 0,
      }}
    >
      <Container maxWidth="lg" sx={{ px: isMobile ? 2 : 4 }}>
        {/* header */}
        <Box
          sx={{
            textAlign: "center",
            mb: 8,
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "#3d9970",
              mb: 2,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
            }}
          >
            Powerful Features
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              color: "text.secondary",
              maxWidth: "600px",
              mx: "auto",
              lineHeight: 1.6,
              fontSize: { xs: "1.1rem", md: "1.25rem" },
            }}
          >
            Discover the Innovative Features of PetDetect: AI-Powered Pet
            Detection Made Simple and Secure
          </Typography>
        </Box>

        <Grid
          container
          spacing={4}
          sx={{
            alignItems: "stretch",
            justifyContent: "center", 
          }}
        >
          {features.map((feature) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4} 
              key={feature.id}
              sx={{
                display: "flex",
                justifyContent: "center",
                maxWidth: { xs: "100%", sm: "500px", md: "350px" }, 
              }}
            >
              <Card
                sx={{
                  width: "100%", 
                  maxWidth: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  overflow: "hidden",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 4px 20px rgba(61, 153, 112, 0.1)",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 40px rgba(61, 153, 112, 0.2)",
                  },
                }}
              >
                {/* card image section */}
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="240"
                    image={feature.image}
                    alt={feature.title}
                    sx={{
                      width: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  />

                </Box>

                {/* card content */}
                <CardContent
                  sx={{
                    flexGrow: 1,
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      color: "#3d9970",
                      mb: 2,
                      fontSize: "1.4rem",
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.7,
                      fontSize: "1rem",
                      flexGrow: 1,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesPage;
