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
import { useNavigate, useLocation } from "react-router-dom";
import MapIcon from '@mui/icons-material/Map';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import Report from './ReportForm'; // Import the ReportForm component

// Import icons
import CautionIcon from '../assets/images/Caution_noshadow.png';
import CautionHoverIcon from '../assets/images/Caution_symbol.png';
import CautionInProgressIcon from '../assets/images/Caution_inprogress.png';
import CautionDoneIcon from '../assets/images/Caution_done.png';
import CleaningIcon from '../assets/images/Cleaning_shadow.png';
import CleaningHoverIcon from '../assets/images/Cleaning_symbol.png';
import CleaningInProgressIcon from '../assets/images/Cleaning_inprogress.png';
import CleaningDoneIcon from '../assets/images/Cleaning_done.png';
import ElectricalIcon from '../assets/images/Electrical Hazard_shadow.png';
import ElectricalHoverIcon from '../assets/images/Electrical Hazard_symbol.png';
import ElectricalInProgressIcon from '../assets/images/Electrical Hazard_inprogress.png';
import ElectricalDoneIcon from '../assets/images/Electrical Hazard_done.png';
import ITIcon from '../assets/images/IT Maintenance_shadow.png';
import ITHoverIcon from '../assets/images/IT Maintenance_symbol.png';
import ITInProgressIcon from '../assets/images/IT Maintenance_inprogress.png';
import ITDoneIcon from '../assets/images/IT Maintenance_done.png';
import RepairIcon from '../assets/images/Repair_shadow.png';
import RepairHoverIcon from '../assets/images/Repair_symbol.png';
import RepairInProgressIcon from '../assets/images/Repair_inprogress.png';
import RepairDoneIcon from '../assets/images/Repair_done.png';
import RequestIcon from '../assets/images/Request_shadow.png';
import RequestHoverIcon from '../assets/images/Request_symbol.png';
import RequestInProgressIcon from '../assets/images/Request_inprogress.png';
import RequestDoneIcon from '../assets/images/Request_done.png';

const pinTypes = [
    { id: 1, label: "Caution", icon: CautionIcon, hoverIcon: CautionHoverIcon, inProgressIcon: CautionInProgressIcon, doneIcon: CautionDoneIcon },
    { id: 2, label: "Cleaning", icon: CleaningIcon, hoverIcon: CleaningHoverIcon, inProgressIcon: CleaningInProgressIcon, doneIcon: CleaningDoneIcon },
    { id: 3, label: "Electrical", icon: ElectricalIcon, hoverIcon: ElectricalHoverIcon, inProgressIcon: ElectricalInProgressIcon, doneIcon: ElectricalDoneIcon },
    { id: 4, label: "IT Maintenance", icon: ITIcon, hoverIcon: ITHoverIcon, inProgressIcon: ITInProgressIcon, doneIcon: ITDoneIcon },
    { id: 5, label: "Repair", icon: RepairIcon, hoverIcon: RepairHoverIcon, inProgressIcon: RepairInProgressIcon, doneIcon: RepairDoneIcon },
    { id: 6, label: "Request", icon: RequestIcon, hoverIcon: RequestHoverIcon, inProgressIcon: RequestInProgressIcon, doneIcon: RequestDoneIcon },
];

const FloorContent = ({ areas, showImages, pins, onAreaClick, onPinClick, textStyle, blinkPinId, focusPulse }) => (
    <svg
        width="100%"
        height="100%"
        viewBox="0 0 1080 1080"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
        style={{ overflow: 'visible' }}
    >
        <style>{`
          @keyframes ffBlinkOpacity {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.25; }
          }

          /* Hover blink for pins */
          .ff-pin-group:hover .ff-pin-img {
            animation: ffBlinkOpacity 0.85s infinite;
          }
        `}</style>

        {/* Optional focus marker (used when admin clicks "Go to Map" from Report History) */}
        {focusPulse && (
            <g transform={`translate(${focusPulse.x}, ${focusPulse.y})`} style={{ pointerEvents: 'none' }}>
                <circle
                    cx="0"
                    cy="0"
                    r="34"
                    fill="rgba(230, 57, 70, 0.25)"
                    style={{ animation: 'ffBlinkOpacity 0.85s infinite' }}
                />
            </g>
        )}
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

            const pinKey = pin.pinid ?? pin.id;
            const isBlinking = blinkPinId != null && String(pinKey) === String(blinkPinId);
            const isInProgress = String(pin.status || '').trim().toLowerCase() === 'in progress';
            const isDone = ['resolved','done','finished','completed'].includes(String(pin.status || '').trim().toLowerCase());

    return (
                <g
                    key={pinKey}
                    transform={`translate(${pin.coordinates.x}, ${pin.coordinates.y})`}
                    onClick={() => onPinClick(pin)}
                    style={{ cursor: "pointer" }}
                    className="ff-pin-group"
                >
                    {isBlinking && (
                        <circle
                            cx="0"
                            cy="0"
                            r="34"
                            fill="rgba(230, 57, 70, 0.25)"
                            style={{ animation: 'ffBlinkOpacity 0.85s infinite' }}
                        />
                    )}
                    <image
                        href={isDone ? (pinType.doneIcon || pinType.icon) : (isInProgress ? (pinType.inProgressIcon || pinType.icon) : pinType.icon)}
                        width="90"
                        height="90"
                        x="-20"
                        y="-70"
                        className="ff-pin-img"
                        style={{
                          ...(isBlinking ? { animation: 'ffBlinkOpacity 0.85s infinite' } : {})
                        }}
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
    // Admin dashboard metric (used in the small overlay on the map)
    const activeJobsCount = pins.filter(p => String(p.status || '').trim().toLowerCase() === 'in progress').length;
    const pendingJobsCount = pins.filter(p => String(p.status || '').trim().toLowerCase() === 'pending').length;
    const navigate = useNavigate();
    const location = useLocation();

    // When coming from notifications, we can focus + blink a specific pin.
    const [blinkPinId, setBlinkPinId] = useState(null);

    // Blink a pin for a short time (used for newly-accepted "In Progress" pins and
    // when jumping from notifications).
    const blinkTimeoutRef = useRef(null);
    function triggerPinBlink(pinId) {
        if (pinId == null) return;
        setBlinkPinId(pinId);
        if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
        blinkTimeoutRef.current = setTimeout(() => setBlinkPinId(null), 6500);
    }

    // Coordinate-based focus marker (used by Admin "Go to Map" in Report History)
    const [focusPulse, setFocusPulse] = useState(null);

    // Capture focus state from route state (and clear it so refresh doesn't keep re-triggering)
    useEffect(() => {
        const st = location?.state || {};
        const focusPinId = st?.focusPinId;
        const focusFloor = st?.focusFloor;
        const focusCoordinatesRaw = st?.focusCoordinates;

        if (focusPinId != null) {
            triggerPinBlink(focusPinId);
        }

        if (focusFloor != null) {
            const nf = Number(focusFloor);
            if (!Number.isNaN(nf)) setCurrentFloor(nf);
        }

        if (focusCoordinatesRaw != null) {
            const parsed = safeParseCoordinates(focusCoordinatesRaw);
            if (parsed && typeof parsed.x === 'number' && typeof parsed.y === 'number') {
                const nf = Number(focusFloor);
                setFocusPulse({
                    x: parsed.x,
                    y: parsed.y,
                    floor: !Number.isNaN(nf) ? nf : currentFloor,
                });
            }
        }

        if (focusPinId != null || focusFloor != null || focusCoordinatesRaw != null) {
            navigate(location.pathname, { replace: true, state: {} });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        return () => {
            if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
        };
    }, []);

    function safeParseCoordinates(value) {
        try {
            if (value == null) return null;
            return typeof value === 'string' ? JSON.parse(value) : value;
        } catch {
            return null;
        }
    }

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
        // If we're currently blinking this pin (focused from notification), stop blinking on click.
        const pinKey = pin?.pinid ?? pin?.id;
        if (blinkPinId != null && String(pinKey) === String(blinkPinId)) {
            setBlinkPinId(null);
        }

        // Stop coordinate-focus marker once user interacts.
        if (focusPulse) {
            setFocusPulse(null);
        }

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

        const currentUserId = userRef.current?.id;
        const roleNorm = String(userRole || '').trim().toLowerCase();
        const isAdminRole = roleNorm === 'admin' || roleNorm === 'it admin';

        // New rule: users cannot delete pins that are already "In Progress".
        // Only admins can delete/mark them done.
        const statusNorm = String(selectedPin.status || '').trim().toLowerCase();
        if (statusNorm === 'in progress' && !isAdminRole) {
            alert('You cannot delete a pin that is already In Progress. Please wait for the admin to mark it as done.');
            return;
        }
    
        // Admin confirmation
        if (isAdminRole && !window.confirm('Are you sure you want to delete this pin?')) {
            return;
        }
    
        try {
            // Fetch related report so we can notify the owner and clean up reports table.
            const { data: reportRow } = await supabase
                .from('reports')
                .select('user_uid, title, specific_place')
                .eq('pinid', selectedPin.pinid)
                .maybeSingle();

            const { error } = await supabase
                .from('pins')
                .delete()
                .eq('pinid', selectedPin.pinid);
    
            if (error) throw error;

            // Also remove the report row(s) tied to this pin (keeps DB consistent)
            await supabase
                .from('reports')
                .delete()
                .eq('pinid', selectedPin.pinid);

            // Notify the report owner only when an admin removes someone else's pin.
            if (isAdminRole && reportRow?.user_uid && String(reportRow.user_uid) !== String(currentUserId)) {
                const place = reportRow.specific_place ? ` at ${reportRow.specific_place}` : '';
                const title = reportRow.title ? `"${reportRow.title}"` : 'your report';
                await supabase
                    .from('notifications')
                    .insert([{
                        user_id: reportRow.user_uid,
                        message: `An admin removed ${title}${place}.`,
                        type: 'status_update'
                    }]);
            }
    
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
                console.log('[DEBUG] Filtering for user + in-progress pins');
                // Non-admins: show their own pins PLUS any accepted pins (In Progress).
                // IMPORTANT: This project’s schema (ReportForm.jsx) links reports <-> pins via `pinid`.
                // RLS can still block non-owner reads; if you have RLS enabled, add a SELECT policy:
                //   user_uid = auth.uid() OR status = 'In Progress'
                // NOTE: don't manually URL-encode the space here.
                // Supabase/PostgREST will handle encoding; using "In%20Progress" can end up double-encoded
                // and fail to match rows (so other users won't see accepted pins).
                query = query.or(`user_uid.eq.${user?.id},status.eq.In Progress`);
            }

            const { data, error } = await query;
            console.log('[DEBUG] Query results:', { data, error });

            if (error) throw error;

            let parsedPins = data.map(pin => ({
                ...pin,
                coordinates: safeParseCoordinates(pin.coordinates)
            }));

            // Auto-expire DONE pins 24hrs after the reporter has *seen* the completion.
            // Countdown starts when reporter opens the Status page (stored in localStorage).
            const maybeExpireDonePins = async () => {
                if (!user?.id) return;

                const now = Date.now();
                const keep = [];
                for (const pin of parsedPins) {
                    const status = String(pin?.status || '').trim().toLowerCase();
                    const isDone = status === 'done';
                    const isOwner = String(pin?.user_uid || '') === String(user.id);
                    if (!isDone || !isOwner) {
                        keep.push(pin);
                        continue;
                    }

                    const key = `doneSeenAt:${user.id}:${pin.pinid}`;
                    const seenAtRaw = localStorage.getItem(key);
                    if (!seenAtRaw) {
                        // Reporter hasn't viewed the DONE status yet; don't start countdown.
                        keep.push(pin);
                        continue;
                    }

                    const seenAt = Number(seenAtRaw);
                    const msSinceSeen = now - (Number.isFinite(seenAt) ? seenAt : now);
                    const ms24h = 24 * 60 * 60 * 1000;
                    if (msSinceSeen < ms24h) {
                        keep.push(pin);
                        continue;
                    }

                    try {
                        // Remove both pin and related report(s) by pinid.
                        await supabase.from('reports').delete().eq('pinid', pin.pinid);
                        await supabase.from('pins').delete().eq('pinid', pin.pinid);
                        localStorage.removeItem(key);
                    } catch (e) {
                        console.warn('[WARN] Failed to expire done pin:', pin?.pinid, e?.message || e);
                        keep.push(pin); // Keep it if deletion fails.
                    }
                }
                parsedPins = keep;
            };

            await maybeExpireDonePins();

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

// If we were asked to focus a pin (from notification), ensure we're on the right floor.
useEffect(() => {
    if (blinkPinId == null) return;
    const match = pins.find(p => String(p.pinid ?? p.id) === String(blinkPinId));
    if (!match) return;

    const pinFloor = Number(match.floor);
    if (!Number.isNaN(pinFloor) && pinFloor !== currentFloor) {
        setCurrentFloor(pinFloor);
    }
}, [blinkPinId, pins, currentFloor]);

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

                const isVisibleToUser = (pinRow) => {
                    if (!pinRow) return false;
                    const role = String(currentRole || '').trim().toLowerCase();
                    const status = String(pinRow.status || '').trim().toLowerCase();
                    if (role === 'admin') return true;
                    if (role === 'it admin') return pinRow.type === 'IT Maintenance';
                    // Regular users: show their own pins OR any pin that is In Progress.
                    return pinRow.user_uid === currentUser?.id || status === 'in progress';
                };

                const upsertPin = (prev, pinRow) => {
                    const idx = prev.findIndex(p => p.pinid === pinRow.pinid);
                    if (idx === -1) return [...prev, pinRow];
                    const next = [...prev];
                    next[idx] = pinRow;
                    return next;
                };

                // Process the change
                switch (payload.eventType) {
                    case 'INSERT': {
                        const newPin = processPin(payload.new);
                        if (!isVisibleToUser(newPin)) return;
                        setPins(prev => upsertPin(prev, newPin));
                        playPinSfx();
                        // If the inserted pin is already "In Progress" (rare but possible), blink it.
                        if (String(newPin.status || '').trim().toLowerCase() === 'in progress') {
                            triggerPinBlink(newPin.pinid);
                        }
                        break;
                    }
                    case 'UPDATE': {
                        const oldPin = payload.old;
                        const newPin = processPin(payload.new);
                        const wasVisible = isVisibleToUser(oldPin);
                        const nowVisible = isVisibleToUser(newPin);

                        // If it just became visible (e.g., accepted -> In Progress), add it.
                        if (!wasVisible && nowVisible) {
                            setPins(prev => upsertPin(prev, newPin));
                        } else if (wasVisible && !nowVisible) {
                            // If it became invisible (edge case), remove it.
                            setPins(prev => prev.filter(p => p.pinid !== newPin.pinid));
                        } else if (nowVisible) {
                            // Normal update for visible pins.
                            setPins(prev => upsertPin(prev, newPin));
                        }

                        // Blink when it is newly accepted (status transitions to In Progress).
                        const oldStatus = String(oldPin?.status || '').trim().toLowerCase();
                        const newStatus = String(newPin?.status || '').trim().toLowerCase();
                        if (oldStatus !== 'in progress' && newStatus === 'in progress' && nowVisible) {
                            triggerPinBlink(newPin.pinid);
                        }
                        break;
                    }
                    case 'DELETE': {
                        setPins(prev => prev.filter(p => p.pinid !== payload.old.pinid));
                        break;
                    }
                    default:
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
            bottom: "24px",
            right: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(6px, 1vw, 8px)",
            zIndex: 10,
            '@media (maxWidth: 600px)': {
                bottom: "16px",
                right: "16px",
            },
        },
        button: {
            // Slightly reduced left padding so Floor/Labels buttons feel less "pushed".
            padding: "clamp(6px, 1.2vw, 10px) clamp(12px, 1.8vw, 16px) clamp(6px, 1.2vw, 10px) clamp(8px, 1.4vw, 12px)",
            fontSize: "clamp(11px, 1.6vw, 14px)",
            backgroundColor: "#457B9D",
            color: "#fae6cfff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            width: "clamp(105px, 16vw, 165px)",
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
                    {(userRole === 'admin' || userRole === 'it admin') && (
                        <div style={{
                            position: 'fixed',
                            top: '80px',
                            right: '16px',
                            zIndex: 1002,
                            pointerEvents: 'none'
                        }}>
                            <div style={{
                                background: '#1D3557',
                                color: '#fae6cfff',
                                padding: '10px 12px',
                                borderRadius: '14px',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                                fontFamily: 'Poppins',
                                minWidth: '160px'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <div>
                                        <div style={{ fontSize: '12px', opacity: 0.9 }}>Active jobs</div>
                                        <div style={{ fontSize: '24px', fontWeight: 700, lineHeight: 1 }}>{activeJobsCount}</div>
                                    </div>
                                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.18)', paddingTop: '6px' }}>
                                        <div style={{ fontSize: '12px', opacity: 0.9 }}>Pending jobs</div>
                                        <div style={{ fontSize: '24px', fontWeight: 700, lineHeight: 1 }}>{pendingJobsCount}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
<div style={responsiveStyles.controlButtons}>
                       
 {/* Notification Banner (Students/Faculty only) */}
 {(userRole !== 'admin' && userRole !== 'it admin') && (
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
 )}
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
                        overflow: 'visible',
                    }}>
                        <FloorContent
                            areas={areasToDisplay}
                            showImages={showImages}
                            pins={pins.filter(pin => pin.floor === String(currentFloor))}
                            // pins={pins}
                            onAreaClick={handleAreaClick}
                            onPinClick={handlePinClick}
                            textStyle={responsiveStyles.pinText}
                            blinkPinId={blinkPinId}
                            focusPulse={(focusPulse && Number(focusPulse.floor) === Number(currentFloor)) ? focusPulse : null}
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
            {(userRole === 'admin' || userRole === 'it admin') && (
                <Button
                    style={{
                        fontSize: 'clamp(12px, 2vw, 14px)',
                        backgroundColor: '#E63946',
                        color: '#fae6cfff',
                        flex: 1, // Equal button width
                        padding: '8px',
                    }}
                    onClick={handleDeletePin}
                >
                    Delete Pin
                </Button>
            )}

            {/* Students/Faculty: allow delete if their own pin is NOT In Progress.
                If Resolved, show a green "Thank you" button instead. */}
            {['student', 'faculty'].includes(String(userRole || '').trim().toLowerCase()) &&
                selectedPin?.user_uid &&
                userRef.current?.id &&
                String(selectedPin.user_uid) === String(userRef.current.id) &&
                String(selectedPin.status || '').trim().toLowerCase() !== 'in progress' && (
                    <Button
                        style={{
                            fontSize: 'clamp(12px, 2vw, 14px)',
                            backgroundColor:
                                String(selectedPin.status || '').trim().toLowerCase() === 'resolved'
                                    ? '#2E7D32'
                                    : '#E63946',
                            color: '#fae6cfff',
                            flex: 1,
                            padding: '8px',
                        }}
                        onClick={handleDeletePin}
                    >
                        {String(selectedPin.status || '').trim().toLowerCase() === 'resolved'
                            ? 'Thank you'
                            : 'Delete'}
                    </Button>
                )}
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
