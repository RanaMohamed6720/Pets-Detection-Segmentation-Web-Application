import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import logo from "../assets/logo.png";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const location = useLocation();

  return (
    <AppBar position="static" className={styles.navbar}>
      <Toolbar className={styles.toolbar}>
        {/* logo */}
        <Box component={Link} to="/" className={styles.logoContainer}>
          <img src={logo} alt="PetDetector Logo" className={styles.logo} />
        </Box>

        {/* nav links */}
        <Box className={styles.navLinks}>
          <Button
            color="inherit"
            component={Link}
            to="/analyze"
            className={`${styles.navButton} ${
              location.pathname === "/analyze" ? styles.activeButton : ""
            }`}
          >
            Analyze
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/features"
            className={`${styles.navButton} ${
              location.pathname === "/features" ? styles.activeButton : ""
            }`}
          >
            Features
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/about"
            className={`${styles.navButton} ${
              location.pathname === "/about" ? styles.activeButton : ""
            }`}
          >
            About
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/auth"
            className={`${styles.navButton} ${
              location.pathname === "/auth" ? styles.activeButton : ""
            }`}
          >
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
