import { Container, Typography, Box, Paper, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import logo from "../../assets/logo2.png";
import catImage from "../../assets/cat2.png";
const AboutPage = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: theme.palette.background.default,
        position: "relative",
      }}
    >
      {/* main content container */}
      <Container maxWidth="xl" sx={{ py: 6, position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 5,
          }}
        >
          {/* header */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 2,
              }}
            >
              <img
                src={logo}
                alt="PetDetector Logo"
                style={{
                  height: "72px",
                  marginRight: theme.spacing(1.5),
                  objectFit: "contain",
                }}
              />
            </Box>
            <Typography variant="h5" color="text.secondary">
              AI-Powered Pet Recognition Technology
            </Typography>
          </Box>

          <Grid
            container
            spacing={3}
            sx={{
              maxWidth: 900,
              alignItems: "stretch",
              [theme.breakpoints.down("md")]: {
                flexDirection: "column",
                alignItems: "center",
              },
            }}
          >
            <Grid
              item
              xs={12}
              md={6}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <Paper
                elevation={12}
                sx={{
                  borderRadius: theme.shape.borderRadius * 3,
                  overflow: "hidden",
                  width: "100%",
                  maxWidth: 350,
                  flexGrow: 1,
                  border: "3px solid",
                  borderColor: "primary.main",
                  transition: theme.transitions.create(
                    ["transform", "box-shadow"],
                    {
                      duration: theme.transitions.duration.standard,
                    }
                  ),
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <img
                  src={catImage}
                  alt="Cute cat for pet detection"
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    objectFit: "cover",
                  }}
                />
              </Paper>
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <Paper
                elevation={8}
                sx={{
                  p: 3,
                  borderRadius: theme.shape.borderRadius * 3,
                  width: "100%",
                  maxWidth: 350,
                  flexGrow: 1,
                  border: "3px solid",
                  borderColor: "primary.main",
                  transition: theme.transitions.create(
                    ["transform", "box-shadow"],
                    {
                      duration: theme.transitions.duration.standard,
                    }
                  ),
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: theme.shadows[6],
                  },
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    mb: 3,
                    textAlign: "center",
                    color: "primary.main",
                    [theme.breakpoints.down("sm")]: {
                      fontSize: "1.6rem",
                    },
                  }}
                >
                  About PetDetect
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography variant="body2" align="justify">
                    PetDetect is an AI-powered web application designed to
                    identify pets like cats and dogs in user uploaded images. If
                    pets are detected, the system displays object detection
                    (bounding boxes) and segmentation (highlighted areas)
                    visualizations.
                  </Typography>

                  <Typography variant="body2" align="justify">
                    Access to the AI features is limited to registered users.
                  </Typography>

                  <Typography
                    variant="body2"
                    align="justify"
                    fontWeight="fontWeightMedium"
                  >
                    PetDetect offers a simple and secure way to explore pet
                    detection using modern AI technology.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutPage;
