import React, { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import '@fontsource/poppins';
import { createTheme } from '@mui/material/styles';
import Report from './ReportForm';
import CautionIcon from '../assets/images/Caution_noshadow.png';
import CautionHoverIcon from '../assets/images/Caution_symbol.png';
import CleaningIcon from '../assets/images/Cleaning_shadow.png';
import CleaningHoverIcon from '../assets/images/Cleaning_symbol.png';
import ElectricalIcon from '../assets/images/Electrical Hazard_shadow.png';
import ElectricalHoverIcon from '../assets/images/Electrical Hazard_symbol.png';
import ITIcon from '../assets/images/IT Maintenance_shadow.png';
import ITHoverIcon from '../assets/images/IT Maintenance_symbol.png';
import RepairIcon from '../assets/images/Repair_shadow.png';
import RepairHoverIcon from '../assets/images/Repair_symbol.png';
import RequestIcon from '../assets/images/Request_shadow.png';
import RequestHoverIcon from '../assets/images/Request_symbol.png';
import supabase from "../helper/supabaseClient";



const theme = createTheme({
    typography: {
        fontFamily: 'Poppins, Arial, sans-serif',
    },
});

const PinSidebar = ({ isOpen, setIsOpen }) => {
    const [hoveredPin, setHoveredPin] = useState(null);
    const [clonedPins, setClonedPins] = useState([]);
    const [selectedPin, setSelectedPin] = useState(null);
    const [showReportForm, setShowReportForm] = useState(false);
    const [userID, setUserID] = useState(null);
    const [savedPins, setSavedPins] = useState([]);
    const isDragging = useRef(false);
    const draggingPinId = useRef(null);
    const startPosition = useRef({ x: 0, y: 0 });
    const currentPinRef = useRef(null); // For the currently dragged pin

    const toggleDrawer = (open) => {
        setIsOpen(open);
    };

    const pinData = [
        { id: 'Hazard', icon: CautionHoverIcon, hoverIcon: CautionIcon, label: 'Hazard', type: 'Hazard' },
        { id: 'Cleaning', icon: CleaningHoverIcon, hoverIcon: CleaningIcon, label: 'Cleaning Pin', type: 'Cleaning' },
        { id: 'Electrical Hazard', icon: ElectricalHoverIcon, hoverIcon: ElectricalIcon, label: 'Electrical Pin', type: 'Electrical Hazard' },
        { id: 'IT Maintenance', icon: ITHoverIcon, hoverIcon: ITIcon, label: 'IT Maintenance Pin', type: 'IT Maintenance' },
        { id: 'Repair', icon: RepairHoverIcon, hoverIcon: RepairIcon, label: 'Repair Pin', type: 'Repair' },
        { id: 'Request', icon: RequestHoverIcon, hoverIcon: RequestIcon, label: 'Request Pin', type: 'Request' },
    ];




    // Function to delete pin from clonedPins state
    const deletePin = (pinId) => {
        setClonedPins((prevPins) => prevPins.filter((pin) => pin.id !== pinId));
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error) {
                console.error('Error fetching user:', error);
                return;
            }

            if (user) {
                const { data: userDetails, error: userError } = await supabase
                    .from('users')
                    .select('id')
                    .eq('id', user.id)
                    .single();

                if (userError) {
                    console.error('Error fetching user details:', userError);
                } else {
                    setUserID(userDetails?.id || 'UserID');
                }
            }
        };
        fetchUserInfo();
    }, []);

    // Save pins to local storage whenever clonedPins updates
    useEffect(() => {
        localStorage.setItem('pins', JSON.stringify(clonedPins));
    }, [clonedPins]);

    // Load pins from local storage on component mount
    useEffect(() => {
        const savedPins = JSON.parse(localStorage.getItem('pins')) || [];
        setClonedPins(savedPins);
    }, []);

    const handlePinClick = (id, isFromSidebar, e) => {
        console.log("Pin clicked. ID:", id, "From Sidebar:", isFromSidebar);

        // Find the clicked pin from pinData or clonedPins
        const clickedPin = pinData.find((pin) => pin.id === id) || clonedPins.find((pin) => pin.id === id);

        if (!clickedPin) {
            console.error("Clicked pin not found.");
            return;
        }

        let mouseX, mouseY;

        // Determine mouse position (clientX, clientY for desktop or touches for mobile)
        if (e.clientX && e.clientY) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        } else if (e.touches && e.touches[0]) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
        }

        if (isFromSidebar) {
            const userConfirmed = window.confirm(`${clickedPin.label} selected`);
            if (userConfirmed) {
                const newPinId = `pin-${Date.now()}`; // Generate unique ID
                console.log("Generated Pin ID (from Sidebar):", newPinId);

                const newPin = {
                    ...clickedPin,
                    id: newPinId,
                    x: mouseX || 0, // Use mouseX for new pin
                    y: mouseY || 0, // Use mouseY for new pin
                    floor: 1,
                    user_uid: userID || 'UserID',
                    active: true,
                };

                console.log("New Pin details:", newPin);

                // Add the new pin to the state
                setClonedPins((prevPins) => [...prevPins, newPin]);
                setIsOpen(false);
            }
        } else {
            console.log("Clicked on a pin from cloned pins...");
            const activePin = clonedPins.find((pin) => pin.id === id);

            if (activePin) {
                const userConfirmed = window.confirm('Do you want to confirm the pin position?');
                if (userConfirmed) {
                    console.log("User confirmed the pin position.");

                    // Update the state to mark the pin as active
                    setClonedPins((prevPins) =>
                        prevPins.map((pin) =>
                            pin.id === activePin.id ? { ...pin, active: true } : pin
                        )
                    );

                    // Set the selected pin details with exact x and y coordinates
                    setSelectedPin({
                        id: activePin.id,
                        type: clickedPin.type,
                        coordinates: JSON.stringify({
                            x: activePin.x,
                            y: activePin.y,

                        }),
                    });

                    console.log("Confirmed Pin Coordinates:", {
                        x: activePin.x,
                        y: activePin.y,
                    });

                    setShowReportForm(true);
                    currentPinRef.current = activePin;
                }
            } else {
                console.log("No active pin found to confirm.");
            }
        }
    };


    const cancelPin = () => {
        const activePin = currentPinRef.current;

        if (activePin) {
            // Remove the pin from localStorage
            const savedPins = JSON.parse(localStorage.getItem('pins')) || {};
            delete savedPins[activePin.id];
            localStorage.setItem('pins', JSON.stringify(savedPins));

            // Remove the pin from the clonedPins state
            setClonedPins((prevPins) =>
                prevPins.filter((pin) => pin.id !== activePin.id)
            );

            // Optionally, reset the active state or perform other cleanup
            setSelectedPin(null);
            currentPinRef.current = null; // Clear the reference
        }
    };


    // Mouse move handler for the new pin (follows the cursor)
    const handleMouseMoveForNewPin = (e) => {
        if (currentPinRef.current) {
            const x = e.clientX;
            const y = e.clientY;
            updatePinPosition(currentPinRef.current.id, x, y);
        }
    };

    const handleNewPinPlacement = () => {
        if (currentPinRef.current) {
            updatePinPosition(currentPinRef.current.id, currentPinRef.current.x, currentPinRef.current.y);
            currentPinRef.current = null;
        }
    };

    const handleMouseDown = (e, id) => {
        isDragging.current = true;
        draggingPinId.current = id;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        startPosition.current = {
            x: clientX - getPinPosition(id).x,
            y: clientY - getPinPosition(id).y,
        };

        document.body.style.userSelect = 'none';

        if (e.touches) {
            document.addEventListener('touchmove', handleMouseMove);
            document.addEventListener('touchend', handleMouseUp);
        } else {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging.current) {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            const newX = clientX - startPosition.current.x;
            const newY = clientY - startPosition.current.y;

            updatePinPosition(draggingPinId.current, newX, newY);
        }
    };




    const handleMouseUp = () => {
        isDragging.current = false;
        document.body.style.userSelect = 'auto';

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleMouseMove);
        document.removeEventListener('touchend', handleMouseUp);
    };

    const getPinPosition = (id) => {
        return clonedPins.find((pin) => pin.id === id) || { x: 0, y: 0 };
    };

    const updatePinPosition = (id, x, y) => {
        setClonedPins((prevPins) =>
            prevPins.map((pin) => (pin.id === id ? { ...pin, x, y } : pin))
        );
    };

    return (
        <Box>
            <Drawer
                anchor="right"
                open={isOpen}
                onClose={() => toggleDrawer(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 300,
                        backgroundColor: '#A8DADC',
                        color: '#fae6cfff',
                    },
                }}
                aria-hidden={isOpen ? 'false' : 'true'} // Use dynamic aria-hidden
            >

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', backgroundColor: '#1D3557', color: '#fae6cfff' }}>
                    <Typography variant="h6" component="div" sx={{ fontSize: '30px', fontWeight: 'bold', color: '#fae6cfff' }}>
                        PINS
                    </Typography>
                    <IconButton onClick={() => toggleDrawer(false)} sx={{ color: '#fae6cfff' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ backgroundColor: '#444' }} />

                <List sx={{ padding: '10px' }}>
                    {pinData.map(({ id, icon, hoverIcon, label }) => (
                        <ListItem
                            key={id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '15px 10px',
                                borderRadius: '10px',
                                marginBottom: '10px',
                                backgroundColor: '#1D3557',
                                opacity: 0.8,
                                '&:hover': {
                                    backgroundColor: '#457B9D',
                                },
                            }}
                            onMouseEnter={() => setHoveredPin(id)}
                            onMouseLeave={() => setHoveredPin(null)}
                            onClick={(e) => handlePinClick(id, true, e)}
                        >
                            <ListItemIcon sx={{ minWidth: 'unset', marginRight: '15px' }}>
                                <img
                                    src={hoveredPin === id ? hoverIcon : icon}
                                    alt={label}
                                    style={{ width: 50, height: 'auto', borderRadius: '5px' }}
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary={label}
                                primaryTypographyProps={{
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    fontFamily: 'Poppins, Arial, sans-serif',
                                    color: '#fae6cfff',
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            {/* Render Cloned Pins */}
            <Box sx={{ padding: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {clonedPins.map((pin) => (
                    <Box
                        key={pin.id}
                        sx={{
                            position: 'absolute',
                            top: pin.y,
                            left: pin.x,
                            width: 50,
                            height: 50,
                            cursor: 'grab',
                        }}
                        onMouseDown={(e) => handleMouseDown(e, pin.id)}
                        onTouchStart={(e) => handleMouseDown(e, pin.id)}
                        onClick={(e) => handlePinClick(pin.id, false, e)}
                    >
                        <img
                            src={pin.hoverIcon}
                            alt={pin.label}
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </Box>
                ))}
            </Box>

            {showReportForm && (
                <Report pin={selectedPin}
                    deletePin={deletePin}
                    setShowReportForm={setShowReportForm}
                />
            )}
        </Box >
    );
};

export default PinSidebar;


// import React, { useState, useRef, useEffect } from 'react';
// import Box from '@mui/material/Box';
// import Drawer from '@mui/material/Drawer';
// import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
// import Button from '@mui/material/Button';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemText from '@mui/material/ListItemText';
// import Divider from '@mui/material/Divider';
// import '@fontsource/poppins';

// const PinSidebar = ({ isOpen, setIsOpen }) => {
//     const [clonedPins, setClonedPins] = useState([]);
//     const [hoveredPin, setHoveredPin] = useState(null);

//     // Save pins to local storage whenever clonedPins updates
//     useEffect(() => {
//         localStorage.setItem('pins', JSON.stringify(clonedPins));
//     }, [clonedPins]);

//     // Load pins from local storage on component mount
//     useEffect(() => {
//         const savedPins = JSON.parse(localStorage.getItem('pins')) || [];
//         setClonedPins(savedPins);
//     }, []);

//     // Add a new pin
//     const addPin = (type) => {
//         const newPin = {
//             id: `pin-${Date.now()}`,
//             type,
//             x: Math.random() * 500, // Random coordinates for demo
//             y: Math.random() * 500,
//         };
//         setClonedPins((prevPins) => [...prevPins, newPin]);
//     };

//     // Clear all pins from local storage and state
//     const clearPins = () => {
//         localStorage.removeItem('pins');
//         setClonedPins([]);
//     };

//     return (
//         <Box>
//             <Drawer
//                 anchor="right"
//                 open={isOpen}
//                 onClose={() => setIsOpen(false)}
//                 sx={{
//                     '& .MuiDrawer-paper': {
//                         width: 300,
//                         backgroundColor: '#A8DADC',
//                         color: '#1D3557',
//                     },
//                 }}
//             >
//                 <Box
//                     sx={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'space-between',
//                         padding: '10px 20px',
//                         backgroundColor: '#457B9D',
//                         color: '#ffffff',
//                     }}
//                 >
//                     <Typography variant="h6">Saved Pins</Typography>
//                     <IconButton onClick={() => setIsOpen(false)} sx={{ color: '#ffffff' }}>
//                         <CloseIcon />
//                     </IconButton>
//                 </Box>
//                 <Divider />

//                 <Box sx={{ padding: '20px' }}>
//                     {/* Display Cloned Pins */}
//                     <Typography variant="h6" sx={{ marginBottom: '10px' }}>
//                         Cloned Pins
//                     </Typography>
//                     <List>
//                         {clonedPins.map((pin) => (
//                             <ListItem key={pin.id} sx={{ padding: '10px' }}>
//                                 <ListItemText
//                                     primary={`Type: ${pin.type}`}
//                                     secondary={`Coordinates: (${pin.x.toFixed(1)}, ${pin.y.toFixed(1)})`}
//                                 />
//                             </ListItem>
//                         ))}
//                     </List>
//                     {clonedPins.length === 0 && <Typography>No pins saved.</Typography>}

//                     {/* Add Pin Button */}
//                     <Button
//                         variant="contained"
//                         sx={{ marginTop: '10px', backgroundColor: '#1D3557' }}
//                         onClick={() => addPin('Demo Pin')}
//                     >
//                         Add Pin
//                     </Button>

//                     {/* Clear Pins Button */}
//                     <Button
//                         variant="outlined"
//                         sx={{ marginTop: '10px', marginLeft: '10px' }}
//                         onClick={clearPins}
//                     >
//                         Clear Pins
//                     </Button>
//                 </Box>
//             </Drawer>
//         </Box>
//     );
// };

// export default PinSidebar;
