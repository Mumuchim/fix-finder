import React, { useState, useEffect, useRef } from "react";
import { areas1, areas2 } from "../helper/areas";
import supabase from "../helper/supabaseClient";
import { playPinSfx } from "../helper/sfx";
// import CircularProgress from "@mui/material/CircularProgress";
import { 
    Alert,
    IconButton,
    Collapse,
    CircularProgress,
    Modal,
    Button,
  } from "@mui/material";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import MapIcon from '@mui/icons-material/Map';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import Report from './ReportForm'; // Import the ReportForm component

// Import icons
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

const pinTypes = [
    { id: 1, label: "Caution", icon: CautionIcon, hoverIcon: CautionHoverIcon },
    { id: 2, label: "Cleaning", icon: CleaningIcon, hoverIcon: CleaningHoverIcon },
    { id: 3, label: "Electrical", icon: ElectricalIcon, hoverIcon: ElectricalHoverIcon },
    { id: 4, label: "IT Maintenance", icon: ITIcon, hoverIcon: ITHoverIcon },
    { id: 5, label: "Repair", icon: RepairIcon, hoverIcon: RepairHoverIcon },
    { id: 6, label: "Request", icon: RequestIcon, hoverIcon: RequestHoverIcon },
];

const FloorContent = ({ areas, showImages, pins, onAreaClick, onPinClick, textStyle }) => (
    <svg
        width="100%"
        height="100%"
        viewBox="0 0 1080 1080"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
    >
        {areas.map((area) => (
            <g
                key={area.id}
                onClick={(e) => onAreaClick(e, area)}
                style={{ cursor: "pointer" }}
                data-label={area.label} // Add this attribute
            >
                <rect
                    x={area.x}
                    y={area.y}
                    width={area.width}
                    height={area.height}
                    fill={area.color}
                    stroke="black"
                />
                {showImages && area.image && (
                    <image
                        x={area.x}
                        y={area.y}
                        width={area.width}
                        height={area.height}
                        href={area.image}
                    />
                )}
                <text
                    x={area.x + area.width / 2}
                    y={area.y + area.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    {...textStyle}
                >
                    {area.label}
                </text>
            </g>
        ))}

{pins.map((pin) => {
            const pinType = pinTypes.find(pt => pt.label === pin.type);
            if (!pinType) return null;

            return (
                <g
                    key={pin.pinid ?? pin.id}
                    transform={`translate(${pin.coordinates.x}, ${pin.coordinates.y})`}
                    onClick={() => onPinClick(pin)}
                    style={{ cursor: "pointer" }}
                >
                    <image
                        href={pinType.icon}
                        width="90"
                        height="90"
                        x="-20"
                        y="-70"
                    />
                </g>
            );
        })}
    </svg>
);

const FloorMap = () => {
    const [pins, setPins] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingAction, setLoadingAction] = useState(false);
    const [selectedPin, setSelectedPin] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [currentFloor, setCurrentFloor] = useState(1);
    const [showImages, setShowImages] = useState(true);
    const [isFloorHovered, setIsFloorHovered] = useState(false);
    const [isImagesHovered, setIsImagesHovered] = useState(false);
    const [showPinModal, setShowPinModal] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [selectedPinType, setSelectedPinType] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [selectedAreaLabel, setSelectedAreaLabel] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [latestNotification, setLatestNotification] = useState(null);
    const userRoleRef = useRef(''); // Add ref for user role
    const userRef = useRef(null); // Add ref for user
    const floor1Count = pins.filter(pin => pin.floor === "1").length;
    const floor2Count = pins.filter(pin => pin.floor === "2").length;
    const navigate = useNavigate();

    const safeParseCoordinates = (value) => {
        try {
            if (value == null) return null;
            return typeof value === 'string' ? JSON.parse(value) : value;
        } catch {
            return null;
        }
    };

    useEffect(() => {
        userRoleRef.current = userRole;
    }, [userRole]);

    useEffect(() => {
        const updateUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            userRef.current = user;
        };
        updateUser();
    }, []);


    const toggleFloor = () => {
        setLoadingAction(true);
        setTimeout(() => {
            setCurrentFloor((prev) => (prev === 1 ? 2 : 1));
            setLoadingAction(false);
        }, 500);
    };

    const toggleImages = () => {
        setLoadingAction(true);
        setTimeout(() => {
            setShowImages((prev) => !prev);
            setLoadingAction(false);
        }, 500);
    };

    const handleAreaClick = (event, area) => {
        if (!['student', 'faculty'].includes(userRole)) {
            alert("Only Students and Faculty can create pins.");
            return;
        }

        if (pins.length >= 5) {
            alert("Maximum limit of 5 pins reached.");
            return;
        }

        const svg = event.currentTarget.ownerSVGElement;
        const point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        const { x, y } = point.matrixTransform(svg.getScreenCTM().inverse());

        setSelectedPosition({ x, y });
        setSelectedAreaLabel(area.label);
        setShowPinModal(true);
    };

    const handlePinClick = (pin) => {
        if (selectedPin && selectedPin.id === pin.id) {
            setShowConfirmation(true);
        } else {
            setSelectedPin(pin);
            setOpenModal(true);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedPin(null);
    };

    const handlePinSelect = (pinType) => {
        setSelectedPinType(pinType);
        setShowConfirmation(true);
    };


    // old ! gumagana to ah
    const confirmPinPlacement = () => {
        if (selectedPinType && selectedPosition) {
          const newPin = {
            id: Date.now(), // Unique ID for the pin
            type: selectedPinType.label,
            coordinates: selectedPosition,
            status: "Pending", // Default status
            floor: String(currentFloor), // Store the current floor
            place: selectedAreaLabel // Use the stored area label
          };
      
          console.log(newPin); // For debugging
      
        //   setPins((prevPins) => [...prevPins, newPin]);
          setSelectedPin(newPin); // Set the newly created pin as selected
          setShowConfirmation(false);
          setShowPinModal(false);
          setShowReportModal(true); // Open ReportForm modal
        }
      };


    const handleCloseReportModal = () => {
        setShowReportModal(false);
        setSelectedPin(null);
    };

    //old gumagana
    const handleCancelPin = () => {
        if (!selectedPin) return;
        
        // Remove the temporary pin from local state
        setPins(prev => prev.filter(pin => pin.id !== selectedPin.id));
        
        // Reset state
        setShowReportModal(false);
        setSelectedPin(null);
        setSelectedPosition(null);
        setSelectedPinType(null);
    };

    

    const handleDeletePin = async () => {
        if (!selectedPin) return;
    
        // Admin confirmation
        if (userRole === 'admin' && !window.confirm('Are you sure you want to delete this pin?')) {
            return;
        }
    
        try {
            const { error } = await supabase
                .from('pins')
                .delete()
                .eq('pinid', selectedPin.pinid);
    
            if (error) throw error;
    
            setPins(prev => prev.filter(pin => pin.pinid !== selectedPin.pinid));
            handleCloseModal();
            alert('Pin deleted successfully');
        } catch (err) {
            console.error('Error deleting pin:', err.message);
            alert(`Failed to delete pin: ${err.message}`);
        }
    };


    // NOTE: we keep a single realtime subscription (below). The old duplicate subscription
    // caused duplicated pins and weird UI states.

   
useEffect(() => {
    const fetchUserRole = async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) return;

        const { data: userDetails } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

        if (userDetails) {
            // Trim whitespace and normalize case
            const role = userDetails.role?.trim().toLowerCase();
            setUserRole(role || '');
        }
    };
    fetchUserRole();
}, []);


useEffect(() => {
    const fetchPins = async () => {
        try {
            setIsLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            
            // First, log all existing pin types
            const { data: allPins, error: allPinsError } = await supabase
                .from('pins')
                .select('type');
            
            console.log('[DEBUG] All existing pin types:', 
                allPins ? [...new Set(allPins.map(pin => pin.type))] : 'No pins found'
            );

            let query = supabase.from('pins').select('*');

            console.log('[DEBUG] Current user role:', userRole);
            console.log('[DEBUG] Authenticated user:', user);

            if (userRole === 'admin') {
                console.log('[DEBUG] Fetching all pins for admin');
            } else if (userRole === 'it admin') {
                console.log('[DEBUG] Filtering for IT Maintenance pins');
                query = query.eq('type', 'IT Maintenance');
            } else {
                console.log('[DEBUG] Filtering for user pins');
                query = query.eq('user_uid', user?.id);
            }

            const { data, error } = await query;
            console.log('[DEBUG] Query results:', { data, error });

            if (error) throw error;

            const parsedPins = data.map(pin => ({
                ...pin,
                coordinates: safeParseCoordinates(pin.coordinates)
            }));

            console.log('[DEBUG] Parsed pins:', parsedPins);
            setPins(parsedPins);

        } catch (err) {
            console.error('[ERROR] Fetch error:', err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Only fetch pins if a user role has been determined
    if (userRole) {
        fetchPins();
    }
}, [userRole]);

useEffect(() => {
    const channel = supabase
        .channel('public:pins')
        .on('postgres_changes', 
            {
                event: '*',
                schema: 'public',
                table: 'pins'
            },
            (payload) => {
                const currentRole = userRoleRef.current;
                const currentUser = userRef.current;

                const processPin = (pin) => ({
                    ...pin,
                    coordinates: safeParseCoordinates(pin.coordinates)
                });

                let shouldUpdate = false;
                const pin = payload.new || payload.old;

                // Handle different event types
                switch (payload.eventType) {
                    case 'INSERT':
                        if (currentRole === 'admin') {
                            shouldUpdate = true;
                        } else if (currentRole === 'it admin') {
                            shouldUpdate = pin.type === 'IT Maintenance';
                        } else {
                            shouldUpdate = pin.user_uid === currentUser?.id;
                        }
                        break;
                    
                    case 'UPDATE':
                    case 'DELETE':
                        // Always process updates/deletes for existing pins
                        shouldUpdate = true;
                        break;
                }

                if (!shouldUpdate) return;

                // Process the change
                switch (payload.eventType) {
                    case 'INSERT':
                        setPins(prev => [...prev, processPin(payload.new)]);
                        playPinSfx();
                        break;
                    case 'UPDATE':
                        setPins(prev => prev.map(p => 
                            p.pinid === payload.new.pinid ? processPin(payload.new) : p
                        ));
                        break;
                    case 'DELETE':
                        setPins(prev => prev.filter(p => p.pinid !== payload.old.pinid));
                        break;
                }
            }
        )
        .subscribe();

    return () => supabase.removeChannel(channel);
}, []);

    const areasToDisplay = currentFloor === 1 ? areas1 : areas2;

    const responsiveStyles = {
        container: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
        },
        controlButtons: {
            position: "absolute",
            bottom: "5%",
            right: "5%",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(8px, 1vw, 10px)",
            zIndex: 10,
            '@media (maxWidth: 600px)': {
                bottom: "2%",
                right: "2%",
            },
        },
        button: {
            padding: "clamp(8px, 1.5vw, 12px) clamp(12px, 2vw, 20px)",
            fontSize: "clamp(12px, 2vw, 16px)",
            backgroundColor: "#457B9D",
            color: "#fae6cfff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            width: "clamp(120px, 20vw, 200px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(5px, 1vw, 10px)",
            transition: "all 0.3s ease",
        },
        pinModal: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: 'clamp(1rem, 3vw, 2rem)',
            borderRadius: '8px',
            width: 'clamp(300px, 90vw, 600px)',
            textAlign: 'center',
        },
        pinGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: 'clamp(0.5rem, 2vw, 1rem)',
        },
        pinIcon: {
            width: 'clamp(50px, 15vw, 80px)',
            height: 'clamp(50px, 15vw, 80px)',
            marginBottom: '0.5rem',
        },
        confirmationModal: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: 'clamp(1rem, 3vw, 2rem)',
            borderRadius: '8px',
            textAlign: 'center',
            width: 'clamp(280px, 90vw, 400px)',
        },
        pinText: {
            fontSize: 'clamp(14px, 2vw, 18px)',
            fontFamily: 'Poppins',
            fill: "black",
            fontWeight: "bold",
            stroke: "#D3D3D3",
            strokeWidth: "5",
            paintOrder: "stroke fill",
        }
    };

    return (
        <div style={responsiveStyles.container}>
            {(isLoading || loadingAction) ? (
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    fontSize: "clamp(16px, 3vw, 20px)",
                    fontWeight: "bold",
                    color: "rgba(0, 0, 0, 0.7)",
                }}>
                    <CircularProgress size="clamp(3rem, 10vw, 4rem)" style={{ marginRight: "1rem" }} />
                    Loading Map...
                </div>
            ) : (
                <>
                    <div style={responsiveStyles.controlButtons}>
                       
 {/* Notification Banner */}
 <div style={{
        position: 'fixed',
        top: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1001,
        width: 'clamp(300px, 90vw, 600px)'
      }}>
        <Collapse in={showNotification}>
          <Alert
            severity="info"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setShowNotification(false)}
              >
                <FaTimes fontSize="inherit" />
              </IconButton>
            }
            sx={{
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              borderRadius: '8px',
              fontFamily: 'Poppins'
            }}
          >
            {latestNotification?.message}
          </Alert>
        </Collapse>
      </div>
{/* Add this div wherever you want to display the user info */}
<div 
  style={{
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '8px 16px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    zIndex: 1000,
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    fontSize: 'clamp(14px, 1.5vw, 16px)'
  }}
>
  <span 
    style={{
      backgroundColor: '#457B9D',
      color: 'white',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '0.8em'
    }}
  >
    {userRole}
  </span>
</div>

<button
    style={{
        ...responsiveStyles.button,
        backgroundColor: isFloorHovered ? "#1D3557" : "#457B9D",
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        // Add margin to prevent overlap if button is near corner
        marginRight: '120px' // Adjust based on your needs
    }}
    onMouseEnter={() => setIsFloorHovered(true)}
    onMouseLeave={() => setIsFloorHovered(false)}
    onClick={toggleFloor}
>
<MapIcon style={{ fontSize: "clamp(16px, 2vw, 24px)" }} />
    <span>Floor {currentFloor === 1 ? 2 : 1} </span>
    <span
        style={{
            backgroundColor: '#e63946',
            borderRadius: '999px',
            padding: '2px 8px',
            fontSize: '0.8em',
            fontWeight: 'bold',
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
    >
        {currentFloor === 1 ? floor2Count : floor1Count}
    </span>

</button>


                        <button
                            style={{
                                ...responsiveStyles.button,
                                backgroundColor: isImagesHovered ? "#1D3557" : "#457B9D",
                            }}
                            onMouseEnter={() => setIsImagesHovered(true)}
                            onMouseLeave={() => setIsImagesHovered(false)}
                            onClick={toggleImages}
                        >
                            <ChangeCircleIcon style={{ fontSize: "clamp(16px, 2vw, 24px)" }} />
                            {showImages ? "Labels" : "Images"}
                        </button>
                    </div>

                    <div style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "clamp(10px, 2vw, 20px)",
                    }}>
                        <FloorContent
                            areas={areasToDisplay}
                            showImages={showImages}
                            pins={pins.filter(pin => pin.floor === String(currentFloor))}
                            // pins={pins}
                            onAreaClick={handleAreaClick}
                            onPinClick={handlePinClick}
                            textStyle={responsiveStyles.pinText}
                        />
                    </div>

                    {/* Pin Selection Modal */}
                    <Modal open={showPinModal} onClose={() => setShowPinModal(false)}>
                        <div style={responsiveStyles.pinModal}>
                            <h2 style={{
                                color: '#1D3557',
                                marginBottom: 'clamp(10px, 2vw, 20px)',
                                fontSize: 'clamp(18px, 3vw, 24px)'
                            }}>
                                Select Pin Type ({5 - pins.length} remaining)
                            </h2>
                            <div style={responsiveStyles.pinGrid}>
                                {pinTypes.map((pin) => (
                                    <button
                                        key={pin.pinid ?? pin.id}
                                        style={{
                                            background: 'none',
                                            border: '2px solid #A8DADC',
                                            borderRadius: '8px',
                                            padding: 'clamp(0.5rem, 2vw, 1rem)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                        }}
                                        onClick={() => handlePinSelect(pin)}
                                        onMouseOver={(e) => (e.currentTarget.children[0].src = pin.icon)}
                                        onMouseOut={(e) => (e.currentTarget.children[0].src = pin.hoverIcon)}
                                    >
                                        <img
                                            src={pin.hoverIcon}
                                            alt={pin.label}
                                            style={responsiveStyles.pinIcon}
                                        />
                                        <span style={{
                                            display: 'block',
                                            color: '#1D3557',
                                            fontWeight: '500',
                                            fontSize: 'clamp(12px, 2vw, 14px)'
                                        }}>
                                            {pin.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Modal>

                    {/* Confirmation Modal */}
                    <Modal open={showConfirmation} onClose={() => setShowConfirmation(false)}>
                        <div style={responsiveStyles.confirmationModal}>
                            <h2 style={{
                                color: '#1D3557',
                                fontSize: 'clamp(18px, 3vw, 24px)'
                            }}>
                                Confirm Pin Placement
                            </h2>
                            <p style={{ fontSize: 'clamp(14px, 2vw, 16px)' , color: '#1D3557'}}>
                                Are you sure you want to place a {selectedPinType?.label} pin here?
                            </p>
                            <p style={{ fontSize: 'clamp(14px, 2vw, 16px)' , color: '#1D3557'}}>
            You have {5 - pins.length - 1} pins remaining after this placement.
        </p>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 'clamp(0.5rem, 2vw, 1rem)',
                                marginTop: 'clamp(1rem, 3vw, 1.5rem)',
                            }}>
                                <Button
                                    variant="contained"
                                    onClick={confirmPinPlacement}
                                    style={{
                                        backgroundColor: '#457B9D',
                                        color: 'white',
                                        fontSize: 'clamp(12px, 2vw, 14px)'
                                    }}
                                >
                                    Confirm
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => setShowConfirmation(false)}
                                    style={{
                                        borderColor: '#457B9D',
                                        color: '#1D3557',
                                        fontSize: 'clamp(12px, 2vw, 14px)'
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </Modal>

                    {/* Existing Pin Details Modal */}

                    <Modal open={openModal} onClose={handleCloseModal}>
                <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: '#A8DADC',
                padding: 'clamp(20px, 4vw, 25px)', // Slightly increased padding
                borderRadius: '8px',
                width: 'clamp(300px, 95vw, 400px)', // Increased width
                color: '#1D3557',
                textAlign: 'center', // Center content
            }}>
                <h2 style={{ fontSize: 'clamp(18px, 3vw, 22px)' }}>
            {selectedPin?.type ? `${selectedPin.type} Pin` : 'Pin Details'}
        </h2>
        {selectedPin && (
            <>
               <p style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: '#457B9D' }}>
  <strong>Pin ID:</strong> {selectedPin?.pinid}

</p>
                <p style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: '#457B9D' }}>
                    <strong>Reporter Name:</strong> {selectedPin.name}
                </p>
            </>
        )}


        {/* Button Container for Alignment */}
        <div style={{
            display: 'flex',
            justifyContent: 'space-between', // Ensures even spacing
            gap: '12px', // Slightly increased gap
            marginTop: '1.5rem',
        }}>
            <Button
                style={{
                    fontSize: 'clamp(12px, 2vw, 14px)',
                    backgroundColor: '#E63946',
                    color: '#fae6cfff',
                    flex: 1, // Equal button width
                    padding: '8px', // More padding for better fit
                }}
                onClick={handleDeletePin}
            >
                Delete Pin
            </Button>
            <Button
                style={{
                    fontSize: 'clamp(12px, 2vw, 14px)',
                    backgroundColor: '#1D3557',
                    color: '#fae6cfff',
                    flex: 1,
                    padding: '8px',
                }}
                // onClick={() => navigate('/status')}
                onClick={() => navigate(`/status/${selectedPin.pinid}`)}
                disabled={!selectedPin?.pinid} // Disable if pinid is missing
            >
                Status
            </Button>
            <Button
                variant="outlined"
                onClick={handleCloseModal}
                style={{
                    fontSize: 'clamp(12px, 2vw, 14px)',
                    flex: 1,
                    padding: '8px',
                }}
            >
                Close
            </Button>
        </div>
    </div>
</Modal>

                    {/* Report Modal */}
<Modal
    open={showReportModal}
    onClose={() => {
        // if (selectedPin) handleDeletePin(selectedPin); // Delete on modal close
        // if (selectedPin) handleCancelPin(selectedPin);
        handleCloseReportModal();
    }}
    BackdropProps={{ invisible: true }}
>
    <div>
        <Report
            pin={selectedPin}  // Pass the pin object
            onCancel={() => {
                if (selectedPin) handleCancelPin(selectedPin); // Delete on "Cancel"
                handleCloseReportModal();
            }}
            onClose={() => {
                // Close after successful submission
                handleCloseReportModal();
            }}
            // onClose={() => {
            //     if (selectedPin) handleCancelPin(selectedPin); // Delete on "Close"
            //     handleCloseReportModal();
            // }}
        />
    </div>
</Modal>
    </>
            )}
        </div>
    );
};

export default FloorMap;

