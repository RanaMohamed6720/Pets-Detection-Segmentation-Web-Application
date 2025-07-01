import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import logo from "../assets/logo.png";

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
  fontSize: "1.25rem",
  backgroundColor: active ? "rgba(255,255,255,0.15)" : "transparent",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.1)",
    transform: "translateY(-2px)",
  },
  transition: "all 0.3s ease",
  borderRadius: "4px",
  margin: "0 8px",
  padding: "8px 16px",
}));

const LogoContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  flexGrow: 1,
});

export default function Navbar() {
  const location = useLocation();

  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        <LogoContainer component={Link} to="/">
          <img
            src={logo}
            alt="PetDetector Logo"
            style={{
              height: "50px",
              marginRight: "15px",
              objectFit: "contain",
            }}
          />
        </LogoContainer>

        <Box sx={{ display: "flex" }}>
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
