import { createTheme } from '@mui/material/styles';
import '@fontsource/poppins'; // Import Poppins font

const theme = createTheme({
    palette: {
        primary: { main: '#1D3557' },
        secondary: { main: '#457B9D' },
        text: {
            primary: '#1D3557', // Global primary text color
            secondary: '#7F8C8D', // Global secondary text color
        },
    },
    typography: {
        fontFamily: 'Poppins, Arial, sans-serif', // Set Poppins as default font
        allVariants: {
            color: '#1D3557', // Default font color for all text
        },
    },
    shape: {
        borderRadius: 12,
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // Removes the default uppercase text transformation
                },
                outlined: {
                    borderColor: '#1D3557',
                    color: '#1D3557',
                    '&:hover': {
                        backgroundColor: '#1D3557',
                        color: '#FFFFFF',
                    },
                },
                contained: {
                    backgroundColor: '#1D3557',
                    color: '#FFFFFF',
                    '&:hover': {
                        backgroundColor: '#457B9D',
                    },
                },
            },
        },
        MuiDialogActions: {
            styleOverrides: {
                root: {
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    marginBottom: '1rem',
                    transition: 'transform 0.2s',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 12, // Optional, if you want to make the chip rounded
                },
            },
        }, MuiBox: {
            styleOverrides: {
                root: {
                    marginBottom: 5, // equivalent to theme.spacing(4)
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                h4: {
                    marginBottom: 1, // equivalent to theme.spacing(2)
                    color: '#1D3557',
                    fontWeight: 'bold', // Bold text
                },
                subtitle1: {
                    color: '#1D3557', // text.secondary color
                },
            },
        },
    },
});
export const componentStyles = {
    box: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 2,
    },
    outlinedButton: {
        borderColor: '#1D3557', // Custom border color
        color: '#1D3557', // Text color for outlined button
        '&:hover': {
            backgroundColor: '#457B9D', // Hover background color
            color: '#FFFFFF', // Hover text color
        },
    },
    containedButton: {
        backgroundColor: '#1D3557', // Background color for contained button
        color: '#FFFFFF', // Text color for contained button
        '&:hover': {
            backgroundColor: '#457B9D', // Hover background color
            color: '#FFFFFF', // Hover text color
        },
    },
    cancelButton: {
        borderColor: '#1D3557', // Custom border color
        color: '#1D3557', // Text color for Cancel button
        '&:hover': {
            backgroundColor: '#1D3557', // Hover background color
            color: '#FFFFFF', // Hover text color
        },
    },
    submitButton: {
        backgroundColor: '#1D3557', // Background color for Submit button
        color: '#FFFFFF', // Text color for Submit button
        '&:hover': {
            backgroundColor: '#457B9D', // Hover background color
            color: '#FFFFFF', // Hover text color
        },
    },
};

export default theme;
