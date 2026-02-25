import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    Snackbar,
    Alert,
    CircularProgress,
    MenuItem
} from "@mui/material";
import { styled } from "@mui/system";
import supabase from "../helper/supabaseClient";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from 'react-router-dom';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    marginTop: theme.spacing(4),
    backgroundColor: "#FFFFFF",
    opacity: 0.8,
}));

const IconWrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    marginRight: theme.spacing(1),
    color: "#1D3557",
}));

const AuthForm = () => {
    const [formData, setFormData] = useState({ 
        fname: "", 
        lname: "", 
        email: "", 
        password: "",
        role: "",
        username: "" 
    });
    const [isSignUp, setIsSignUp] = useState(false);
    const [isAdminLogin, setIsAdminLogin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (isSignUp) {
            if (!formData.fname.trim()) newErrors.fname = "First name is required";
            if (!formData.lname.trim()) newErrors.lname = "Last name is required";
            if (!formData.role) newErrors.role = "Role is required";
        }
        if (!isSignUp && isAdminLogin) {
            if (!formData.username.trim()) newErrors.username = "Username is required";
        } else if (!isSignUp && !isAdminLogin) {
            if (!formData.email.trim()) newErrors.email = "Email is required";
        }
        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        setLoading(true);

        try {
            if (isSignUp) {
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                });

                if (authError) throw authError;

                const { error: insertError } = await supabase
                    .from('users')
                    .insert([{
                        id: authData.user.id,
                        email: formData.email,
                        fname: formData.fname,
                        lname: formData.lname,
                        role: formData.role
                    }]);

                if (insertError) throw insertError;

                setSnackbar({
                    open: true,
                    message: 'Signup successful! Redirecting to dashboard...',
                    severity: 'success'
                });
                setTimeout(() => navigate('/dashboard'), 3000);
            } else {
                if (isAdminLogin) {
                    // Admin login flow
                    const { data: userData, error: userError } = await supabase
                        .from('users')
                        .select('email')
                        .eq('username', formData.username)
                        .eq('role', 'admin')
                        .single();

                    if (userError) throw userError;
                    if (!userData) throw new Error('Admin user not found');

                    const { error: authError } = await supabase.auth.signInWithPassword({
                        email: userData.email,
                        password: formData.password,
                    });

                    if (authError) throw authError;

                    setSnackbar({
                        open: true,
                        message: 'Admin login successful! Redirecting...',
                        severity: 'success'
                    });
                } else {
                    // Regular login flow
                    const { error } = await supabase.auth.signInWithPassword({
                        email: formData.email,
                        password: formData.password,
                    });

                    if (error) throw error;

                    setSnackbar({
                        open: true,
                        message: 'Login successful! Redirecting...',
                        severity: 'success'
                    });
                }
                setTimeout(() => navigate('/dashboard'), 3000);
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.message || 'An error occurred',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <StyledPaper elevation={3}>
                <Typography variant="h4" align="center" gutterBottom>
                    {isSignUp ? "Sign Up" : (isAdminLogin ? "Admin Login" : "Login")}
                </Typography>

                <Box mt={3} />

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {isSignUp && (
                            <>
                                <Grid item xs={12}>
                                    <Box display="flex" alignItems="center">
                                        <IconWrapper>
                                            <FaUser />
                                        </IconWrapper>
                                        <TextField 
                                            autoFocus
                                            margin="dense"
                                            type="text"
                                            fullWidth
                                            label="First Name"
                                            name="fname"
                                            value={formData.fname}
                                            onChange={handleInputChange}
                                            error={Boolean(errors.fname)}
                                            helperText={errors.fname}
                                            required
                                            sx={{
                                                "& label": {
                                                    backgroundColor: "transparent",
                                                    padding: "0px 5px",
                                                },
                                                "& label.Mui-focused": {
                                                    backgroundColor: "transparent",
                                                },
}}

                                        />         
                                    </Box>
                                    <Box mt={2} />

                                    <Box display="flex" alignItems="center">
                                        <IconWrapper>
                                            <FaUser />
                                        </IconWrapper>
                                        <TextField
                                            fullWidth
                                            label="Last Name"
                                            name="lname"
                                            value={formData.lname}
                                            onChange={handleInputChange}
                                            error={Boolean(errors.lname)}
                                            helperText={errors.lname}
                                            required
                                            sx={{
                                                "& label": {
                                                    backgroundColor: "transparent",
                                                    padding: "0px 5px",
                                                },
                                                "& label.Mui-focused": {
                                                    backgroundColor: "transparent",
                                                },
}}

                                        />         
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                <Box display="flex" alignItems="center">
                                    <IconWrapper>
                                        <FaEnvelope />
                                    </IconWrapper>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        error={Boolean(errors.email)}
                                        helperText={errors.email}
                                        required
                                            sx={{
                                                "& label": {
                                                    backgroundColor: "transparent",
                                                    padding: "0px 5px",
                                                },
                                                "& label.Mui-focused": {
                                                    backgroundColor: "transparent",
                                                },
}}

                                    />
                                </Box>
                            </Grid>
                                
                                <Grid item xs={12}>
                                    <Box display="flex" alignItems="center">
                                        <IconWrapper>
                                            <FaUser />
                                        </IconWrapper>
                                        <TextField
                                            select
                                            fullWidth
                                            label="Role"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            error={Boolean(errors.role)}
                                            helperText={errors.role}
                                            required
                                            sx={{
                                                "& label": {
                                                    backgroundColor: "transparent",
                                                    padding: "0px 5px",
                                                },
                                                "& label.Mui-focused": {
                                                    backgroundColor: "transparent",
                                                },
}}

                                        >
                                            <MenuItem value="Student">Student</MenuItem>
                                            <MenuItem value="Faculty">Faculty</MenuItem>
                                            <MenuItem value="Admin">Admin</MenuItem>
                                        </TextField>
                                    </Box>
                                </Grid>
                            </>
                        )}

                        {!isSignUp && isAdminLogin ? (
                            <Grid item xs={12}>
                                <Box display="flex" alignItems="center">
                                    <IconWrapper>
                                        <FaUser />
                                    </IconWrapper>
                                    <TextField
                                        fullWidth
                                        label="Username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        error={Boolean(errors.username)}
                                        helperText={errors.username}
                                        required
                                            sx={{
                                                "& label": {
                                                    backgroundColor: "transparent",
                                                    padding: "0px 5px",
                                                },
                                                "& label.Mui-focused": {
                                                    backgroundColor: "transparent",
                                                },
}}

                                    />
                                </Box>
                            </Grid>
                        ) : !isSignUp && (
                            <Grid item xs={12}>
                                <Box display="flex" alignItems="center">
                                    <IconWrapper>
                                        <FaEnvelope />
                                    </IconWrapper>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        error={Boolean(errors.email)}
                                        helperText={errors.email}
                                        required
                                            sx={{
                                                "& label": {
                                                    backgroundColor: "transparent",
                                                    padding: "0px 5px",
                                                },
                                                "& label.Mui-focused": {
                                                    backgroundColor: "transparent",
                                                },
}}

                                    />
                                </Box>
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <Box display="flex" alignItems="center" width="100%">
                                <IconWrapper>
                                    <FaLock />
                                </IconWrapper>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    error={Boolean(errors.password)}
                                    helperText={errors.password}
                                    required
                                            sx={{
                                                "& label": {
                                                    backgroundColor: "transparent",
                                                    padding: "0px 5px",
                                                },
                                                "& label.Mui-focused": {
                                                    backgroundColor: "transparent",
                                                },
}}

                                    InputProps={{
                                        endAdornment: (
                                            <Box sx={{ cursor: "pointer" }} onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </Box>
                                        ),
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>

                    <Box mt={2} display="flex" flexDirection="column" alignItems="center">
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={loading}
                            sx={{
                                padding: "12px 24px",
                                fontSize: "1.2rem",
                                minWidth: "180px",
                            }}
                        >
                            {loading ? <CircularProgress size={24} /> : 
                                isSignUp ? "Sign Up" : "Login"}
                        </Button>

                        <Box mt={2} display="flex" flexDirection="column" alignItems="center">
                            <Button 
                                color="secondary"
                                onClick={() => setIsSignUp(!isSignUp)}
                                sx={{ mb: 1 }}
                            >
                                {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
                            </Button>
                            
                            {!isSignUp && (
                                <Button 
                                    color="secondary"
                                    onClick={() => {
                                        setIsAdminLogin(!isAdminLogin);
                                        setFormData({...formData, email: "", username: ""});
                                    }}
                                >
                                    {isAdminLogin ? " Student/Faculty Login" : "Admin Login"}
                                </Button>
                            )}
                        </Box>
                    </Box>
                </form>
            </StyledPaper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    severity={snackbar.severity}
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AuthForm;