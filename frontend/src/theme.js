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
            default: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: 16,
        h1: {
            fontSize: '2.25rem',
            fontWeight: 700,
            lineHeight: 1.2,
            color: '#3d9970',
        },
        h2: {
            fontSize: '1.75rem',
            fontWeight: 600,
            lineHeight: 1.3,
            color: '#3d9970',
        },
        h3: {
            fontSize: '1.5rem',
            fontWeight: 600,
            lineHeight: 1.3,
            color: '#3d9970',
        },
        h4: {
            fontSize: '1.375rem',
            fontWeight: 500,
            lineHeight: 1.4,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
            lineHeight: 1.4,
        },
        h6: {
            fontSize: '1.125rem',
            fontWeight: 500,
            lineHeight: 1.5,
        },
        subtitle1: {
            fontSize: '1rem',
            fontWeight: 400,
            lineHeight: 1.5,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.6,
        },
        button: {
            fontSize: '1rem',
            fontWeight: 500,
            textTransform: 'none',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    fontSize: '1rem',
                    padding: '10px 20px',
                    fontWeight: 500,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputBase-root': {
                        fontSize: '1rem',
                    },
                    '& .MuiInputLabel-root': {
                        fontSize: '1rem',
                    },
                    '& .MuiInputLabel-outlined': {
                        transform: 'translate(14px, 18px) scale(1)',
                    },
                    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                        transform: 'translate(14px, -6px) scale(0.75)',
                    },
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                input: {
                    fontSize: '1rem',
                },
            },
        },
    },
});

export default theme;
