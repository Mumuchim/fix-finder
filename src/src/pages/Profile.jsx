import React, { useState, useEffect } from "react";
import profile from '../assets/rabbit.png';
import Navbar from '../components/Navbar'; // Ensure you import Navbar
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Grid,
    Avatar,
    Paper,
    Snackbar,
    Alert
} from "@mui/material";
import { styled } from "@mui/system";
import { FaUser, FaEnvelope, FaIdCard, FaUserTag } from "react-icons/fa";
import { componentStyles } from '../css/Theme'; // Import the styles and theme
import supabase from "../helper/supabaseClient";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';


const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    backgroundColor: "#A8DADC",
    opacity: 0.8,
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: theme.spacing(12),
    height: theme.spacing(12),
    marginBottom: theme.spacing(2),
}));

const IconWrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    marginRight: theme.spacing(1),
    color: "#1D3557",
}));

const User = () => {
    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        email: "",
        role: "",
        customUid: "",
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error) throw error;

                const { data, error: fetchError } = await supabase
                    .from("users")
                    .select('fname, lname, email, role, id')
                    .eq("id", user.id)
                    .single();

                if (fetchError) throw fetchError;

                setFormData({
                    name: data.fname || "",
                    lastName: data.lname || "",
                    email: data.email || "",
                    role: data.role || "",
                    customUid: data.id || "",
                });
            } catch (error) {
                console.error("Error fetching user data:", error.message);
                setSnackbar({
                    open: true,
                    message: "Failed to fetch user data. Please try again.",
                    severity: "error",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = "First Name is required";
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last Name is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleNavigate = () => {
        navigate("/dashboard");
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            // Get the current session to fetch the user ID
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError || !session) {
                throw new Error("User is not authenticated");
            }

            const userId = session.user.id;
            if (!userId) throw new Error("User ID is undefined");

            // Update the user's first name and last name
            const { error } = await supabase
                .from("users")
                .update({
                    fname: formData.name,
                    lname: formData.lastName,
                })
                .eq("id", userId);

            if (error) throw error;

            setSnackbar({
                open: true,
                message: "Profile updated successfully!",
                severity: "success",
            });
        } catch (error) {
            console.error("Error updating user data:", error.message);
            setSnackbar({
                open: true,
                message: "Failed to update profile. Please try again.",
                severity: "error",
            });
        }
    };

    if (loading) {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column', // Arrange items in a column
                    alignItems: 'center', // Center items horizontally
                    justifyContent: 'center', // Center items vertically
                    height: '100vh', // Full height for centering
                }}
            >
                <Box sx={{ display: 'flex' }}>
                    <CircularProgress size="4rem" />
                </Box>
                <div
                    style={{
                        marginTop: '1rem', // Add spacing between the spinner and text
                        fontSize: '18px', // Adjust font size
                        fontWeight: 'bold', // Make text bold
                        color: 'rgba(0, 0, 0, 0.7)', // Add subtle text color
                    }}
                >
                    Loading profile...
                </div>
            </div>
        );
    }


    return (
        <Container maxWidth="md">
            <Navbar userDetails={formData} />
            <StyledPaper elevation={3}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <StyledAvatar src={profile} alt="Profile Picture" />
                    <Typography variant="h4" gutterBottom>
                        User Profile
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {/* Render Form Fields */}
                    <Grid item xs={12} sm={6}>
                        <Box sx={componentStyles.box}>
                            <IconWrapper>
                                <FaUser />
                            </IconWrapper>
                            <TextField
                                fullWidth
                                label="First Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                error={Boolean(errors.name)}
                                helperText={errors.name}
                                required
                                sx={componentStyles.textField}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box display="flex" alignItems="center">
                            <IconWrapper>
                                <FaUser />
                            </IconWrapper>
                            <TextField
                                fullWidth
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                error={Boolean(errors.lastName)}
                                helperText={errors.lastName}
                                required
                            />
                        </Box>
                    </Grid>
                    {/* Other Fields */}
                    <Grid item xs={12}>
                        <Box display="flex" alignItems="center">
                            <IconWrapper>
                                <FaEnvelope />
                            </IconWrapper>
                            <TextField
                                fullWidth
                                label="Email"
                                value={formData.email}
                                inputProps={{ readOnly: true }}
                                sx={{ "& .MuiInputBase-input.Mui-disabled": { opacity: 0.8 } }}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Box display="flex" alignItems="center">
                            <IconWrapper>
                                <FaUserTag />
                            </IconWrapper>
                            <TextField
                                fullWidth
                                label="Role"
                                value={formData.role}
                                inputProps={{ readOnly: true }}
                                sx={{ "& .MuiInputBase-input.Mui-disabled": { opacity: 0.8 } }}
                            />
                        </Box>
                    </Grid>

                    {formData.role !== "admin" && (
                        <Grid item xs={12} sm={6}>
                            <Box display="flex" alignItems="center">
                                <IconWrapper>
                                    <FaIdCard />
                                </IconWrapper>
                                <TextField
                                    fullWidth
                                    label="User ID"
                                    value={formData.customUid}
                                    inputProps={{ readOnly: true }}
                                    sx={{ "& .MuiInputBase-input.Mui-disabled": { opacity: 0.8 } }}
                                />
                            </Box>
                        </Grid>
                    )}

                    {/* Buttons */}
                    <Grid item xs={12}>
                        <Box sx={componentStyles.box}>
                            <Button variant="outlined" color="secondary" onClick={handleNavigate}>
                                Back To Map
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleSubmit}>
                                Save Changes
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </StyledPaper>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default User;
