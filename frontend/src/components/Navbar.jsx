import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import logo from "../assets/logo.png";
// usin mui styled API for inline styling instead of a separate CSS file 
// to prevent styles from being overridden by mui's default 
const StyledAppBar = styled(AppBar)({
  backgroundColor: "#3d9970",
  boxShadow: "none",
  padding: "8px 0",
  zIndex: 1200,
});

const StyledToolbar = styled(Toolbar)({
  minHeight: "80px",
});

const NavButton = styled(Button)(({ theme, active }) => ({
  fontWeight: active ? "bold" : "medium",
  fontSize: 20,
  backgroundColor: active ? "rgba(255,255,255,0.15)" : "transparent",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.1)",
    transform: "translateY(-2px)",
  },
  transition: "all 0.3s ease",
  borderRadius: "4px", 
}));

export default function Navbar() {
  const location = useLocation();

  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        {/* logo */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            flexGrow: 1,
            "&:hover": {
              transform: "scale(1.02)",
              transition: "transform 0.3s ease",
            },
          }}
        >
          <img
            src={logo}
            alt="PetDetector Logo"
            style={{
              height: "50px",
              marginRight: "15px",
              objectFit: "contain",
            }}
          />
        </Box>

        {/* nav links */}
        <Box sx={{ display: "flex", gap: "16px" }}>
          <NavButton
            color="inherit"
            component={Link}
            to="/analyze"
            active={location.pathname === "/analyze"}
          >
            Analyze
          </NavButton>
          <NavButton
            color="inherit"
            component={Link}
            to="/features"
            active={location.pathname === "/features"}
          >
            Features
          </NavButton>
          <NavButton
            color="inherit"
            component={Link}
            to="/about"
            active={location.pathname === "/about"}
          >
            About
          </NavButton>
          <NavButton
            color="inherit"
            component={Link}
            to="/auth"
            active={location.pathname === "/auth"}
          >
            Login
          </NavButton>
        </Box>
      </StyledToolbar>
    </StyledAppBar>
  );
}
