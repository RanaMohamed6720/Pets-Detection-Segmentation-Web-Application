import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#3d9970',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#c3cfe2',
        },
        background: {
            default: '#f5f7fa',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '3.5rem',
            fontWeight: 700,
            color: '#3d9970',
            '@media (max-width:900px)': {
                fontSize: '2.5rem',
            },
        },
        h2: {
            fontSize: '2.2rem',
            fontWeight: 600,
            color: '#3d9970',
            '@media (max-width:900px)': {
                fontSize: '1.8rem',
            },
        },
        h3: {
            fontSize: '1.8rem',
            fontWeight: 600,
            color: '#3d9970',
        },
        h4: {
            fontSize: '1.8rem',
            fontWeight: 300,
            '@media (max-width:900px)': {
                fontSize: '1.3rem',
            },
        },
        h5: {
            fontSize: '1.5rem',
            fontWeight: 600,
            '@media (max-width:900px)': {
                fontSize: '1.3rem',
            },
        },
        body1: {
            fontSize: '1.1rem',
            lineHeight: 1.8,
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#3d9970',
                    boxShadow: 'none',
                    padding: '8px 0',
                    zIndex: 1200,

                },
            },
        },
        MuiToolbar: {
            styleOverrides: {
                root: {
                    minHeight: '80px',
                },
            },
        },
    },
});

export default theme;