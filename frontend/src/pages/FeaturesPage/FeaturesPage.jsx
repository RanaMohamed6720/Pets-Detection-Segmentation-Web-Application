import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Classification from "../../assets/classification.png";
import Detection from "../../assets/detection.png";
import Segmentation from "../../assets/segmentation.png";

const features = [
  {
    id: 1,
    title: "Classification",
    description: "Determines if pets are present in the image.",
    image: Classification,
  },
  {
    id: 2,
    title: "Detection",
    description: "Identifies and localizes pets using bounding boxes.",
    image:Detection,
  },
  {
    id: 3,
    title: "Segmentation",
    description: "Generates pixel-level masks for the pets.",
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
        background: theme.palette.background.default,
        py: 8,
        position: "relative",
      }}
    >
      <Container maxWidth="lg" sx={{ px: isMobile ? 2 : 4 }}>
        {/* header */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h1"
            sx={{
              mb: 2,
              color: "primary.main",
              [theme.breakpoints.down("sm")]: {
                fontSize: "2.5rem",
              },
            }}
          >
            Powerful Features
          </Typography>
          <Typography
            variant="h5"
            sx={{
              maxWidth: 600,
              mx: "auto",
              lineHeight: 1.6,
              color: "text.secondary",
              [theme.breakpoints.down("sm")]: {
                fontSize: "1.25rem",
              },
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
            [theme.breakpoints.down("sm")]: {
              spacing: 3,
            },
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
              }}
            >
              <Card
                sx={{
                  width: "100%",
                  maxWidth: 350,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: theme.shape.borderRadius * 2,
                  overflow: "hidden",
                  transition: theme.transitions.create(
                    ["transform", "box-shadow"],
                    {
                      duration: theme.transitions.duration.standard,
                    }
                  ),
                  boxShadow: theme.shadows[4],
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: theme.shadows[10],
                  },
                }}
              >
                {/* card image section */}
                <CardMedia
                  component="img"
                  height="240"
                  image={feature.image}
                  alt={feature.title}
                  sx={{
                    width: "100%",
                    objectFit: "cover",
                    transition: theme.transitions.create("transform", {
                      duration: theme.transitions.duration.standard,
                    }),
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
                <CardContent
                  sx={{
                    flexGrow: 1,
                    p: 3,
                    [theme.breakpoints.down("sm")]: {
                      p: 2,
                    },
                  }}
                >
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      mb: 2,
                      color: "primary.main",
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.7,
                      color: "text.secondary",
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
