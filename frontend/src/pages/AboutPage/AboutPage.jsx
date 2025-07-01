import { Container, Typography, Box, Paper,Grid } from "@mui/material";
import logo from "../../assets/logo2.png";
import catImage from "../../assets/cat2.png";
const AboutPage = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        position: "relative",
      }}
    >
      {/* main content container */}
      <Container maxWidth="xl" sx={{ py: 8, position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          {/* header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 3,
              }}
            >
              <img
                src={logo}
                alt="PetDetector Logo"
                style={{
                  height: "80px",
                  marginRight: "15px",
                  objectFit: "contain",
                }}
              />
            </Box>
            <Typography variant="h4" sx={{ color: "text.secondary" }}>
              AI-Powered Pet Recognition Technology
            </Typography>
          </Box>

          <Grid
            container
            spacing={4}
            sx={{ maxWidth: 1400, alignItems: "stretch" }}
          >
            {/* cat image on left side */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Paper
                  elevation={12}
                  sx={{
                    borderRadius: 6,
                    overflow: "hidden",
                    width: "100%",
                    maxWidth: 500,
                    transition: "all 0.4s ease",
                    border: "3px solid",
                    borderColor: "primary.main",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 20px 60px rgba(61, 153, 112, 0.2)",
                    },
                  }}
                >
                  <img
                    src={catImage}
                    alt="Cute cat for pet detection"
                    style={{
                      width: "100%",
                      height: "460px",
                      display: "block",
                    }}
                  />
                </Paper>
              </Box>
            </Grid>

            {/* description on right side */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Paper
                  elevation={8}
                  sx={{
                    p: 5,
                    borderRadius: 6,
                    width: "100%",
                    maxWidth: 500,
                    height: "fit-content",
                    border: "3px solid",
                    borderColor: "primary.main",
                    transition: "all 0.4s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 20px 60px rgba(61, 153, 112, 0.15)",
                    },
                  }}
                >
                  <Typography variant="h2" sx={{ mb: 4, textAlign: "center" }}>
                    About PetDetect
                  </Typography>

                  <Box sx={{ space: 3 }}>
                    <Typography
                      variant="body1"
                      sx={{ textAlign: "justify", mb: 3 }}
                    >
                      PetDetect is an AI-powered web application designed to
                      identify pets like cats and dogs in user uploaded images.
                      If pets are detected, the system displays object detection
                      (bounding boxes) and segmentation (highlighted areas)
                      visualizations.
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{ textAlign: "justify", mb: 3 }}
                    >
                      Access to the AI features is limited to registered users.
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{ textAlign: "justify", fontWeight: 500 }}
                    >
                      PetDetect offers a simple and secure way to explore pet
                      detection using modern AI technology.
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Grid>
                  </Grid>
                  
        </Box>
      </Container>
    </Box>
  );
};

export default AboutPage;
