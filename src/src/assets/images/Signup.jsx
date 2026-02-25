import React, { useState } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import googleLogo from './google.svg';
import facebookLogo from './facebook.svg';
import showPass from './show.svg';
import hidePass from './hide.svg';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    const [fname, setFname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [isRepeatPasswordVisible, setIsRepeatPasswordVisible] = useState(false);


    // Function to toggle password visibility
    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save user data to Firestore
            await setDoc(doc(db, "test", user.uid), {
                email: user.email,
                name: fname,
            });

            // Show success toast
            toast.success('Account created successfully! Please login to continue.', {
                position: 'top-center',
                autoClose: 3000, // Toast will auto-close after 5 seconds
            });

            // Clear the form fields
            setFname('');
            setEmail('');
            setPassword('');
            setRepeatPassword('');

            // Redirect to login page after a delay
            setTimeout(() => {
                window.location.href = "/login";
            }, 3000); // Wait for 5 seconds before redirecting
        } catch (error) {
            // Show error toast
            toast.error(error.message, {
                position: 'top-center',
                autoClose: 5000,
            });
        }
    };


    // PasswordToggle Component
    const PasswordToggle = ({ isPasswordVisible, togglePasswordVisibility }) => {
        return (
            <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
                style={{ cursor: 'pointer', background: 'none', border: 'none' }}
            >
                <img
                    src={isPasswordVisible ? hidePass : showPass}
                    alt="Toggle Password Visibility"
                />
            </button>
        );
    };

    return (
        <>
            <div className="wrapper">
                <h1>Signup</h1>
                <form id="form" className="form" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="fname">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                                <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z" />
                            </svg>
                        </label>
                        <input
                            type="text"
                            name="fname"
                            id="fname-input"
                            placeholder="Enter Name"
                            onChange={(e) => setFname(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                                <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280 320-200v-80L480-520 160-720v80l320 200Z" />
                            </svg>
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email-input"
                            placeholder="Enter Email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password-input">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                            >
                                <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z" />
                            </svg>
                        </label>
                        <input
                            type={isPasswordVisible ? 'text' : 'password'}
                            name="password"
                            id="password-input"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {/* Password visibility toggle button */}
                        <PasswordToggle
                            isPasswordVisible={isPasswordVisible}
                            togglePasswordVisibility={togglePasswordVisibility}
                        />
                    </div>
                    {/* Repeat Password */}
                    <div>
                        <label htmlFor="repeat-password-input">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                            >
                                <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z" />
                            </svg>
                        </label>
                        <input
                            type={isRepeatPasswordVisible ? 'text' : 'password'}
                            name="repeat-password"
                            id="repeat-password-input"
                            placeholder="Re-enter Password"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                        />
                        {/* Repeat Password visibility toggle button */}
                        <PasswordToggle
                            isPasswordVisible={isRepeatPasswordVisible}
                            togglePasswordVisibility={() => setIsRepeatPasswordVisible(!isRepeatPasswordVisible)}
                        />
                    </div>
                    <button type="submit" className="submit-btn">
                        Signup
                    </button>
                    <p>Or signup using:</p>
                    <div className="social-signup">
                        <button className="google-signup">
                            <img src={googleLogo} alt="Google logo" />
                        </button>
                        <button className="facebook-signup">
                            <img src={facebookLogo} alt="Facebook logo" />
                        </button>
                    </div>
                </form>
                <p>
                    Already have an account? <Link to="/login">Login</Link> here.
                </p>
            </div>
        </>
    );
};

export default App;
