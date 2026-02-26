import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import { 
  Card, CardContent, CardMedia, Typography, Button, Box, 
  Modal, IconButton, CircularProgress, TextField 
} from "@mui/material";
import { FaMapMarkerAlt } from "react-icons/fa";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import supabase from "../helper/supabaseClient";

const StyledCard = styled(Card)(() => ({
    maxWidth: 500,
    borderRadius: "16px",
    backgroundColor: "#A8DADC",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
}));

const StyledHeader = styled(Box)(() => ({
    backgroundColor: "#1D3557",
    padding: "10px",
    borderRadius: "16px 16px 0 0",
    textAlign: "center",
    color: "#fae6cfff",
    fontFamily: "Poppins",
    fontWeight: 500,
    fontSize: "1.5rem",
}));

const StyledContent = styled(CardContent)(() => ({
    padding: "20px",
    fontFamily: "Poppins",
}));

const DetailItem = styled(Box)(() => ({
    marginBottom: "10px",
    textAlign: "left",
    padding: "10px",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: "8px",
}));

const DetailLabel = styled(Typography)(() => ({
    fontWeight: 700,
    fontSize: "1.1rem",
    color: "#E63946",
}));

const DetailValue = styled(Typography)(() => ({
    fontSize: "1rem",
    color: "#1D3557",
    lineHeight: "1.5",
}));

const ActionButton = styled(Button)(() => ({
    marginTop: "10px",
    backgroundColor: "#457B9D",
    color: "#fff",
    padding: "10px 20px",
    fontSize: "1rem",
    borderRadius: "24px",
    "&:hover": {
        backgroundColor: "#dc2f3c",
        transform: "scale(1.05)",
    },
}));

const ModalImage = styled(Box)(() => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
}));

const DenyReasonModal = ({ 
    open, 
    onClose, 
    reason, 
    setReason, 
    onConfirm, 
    isProcessing 
  }) => (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2
      }}>
        <Typography variant="h6" mb={2}>
          Reason for Denying the Request
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          label="Enter reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button 
            onClick={onClose}
            variant="outlined"
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            variant="contained" 
            color="error"
            disabled={!reason || isProcessing}
          >
            {isProcessing ? <CircularProgress size={24} /> : 'Confirm Deny'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
  


const ReportStatus = () => {
    const { pinId } = useParams();
    const [reportData, setReportData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [status, setStatus] = useState(null);
    const [showDenyReasonModal, setShowDenyReasonModal] = useState(false);
    const [denialReason, setDenialReason] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (reportData) {
            setStatus(reportData.status);
        }
    }, [reportData]);

    

    const handleMarkAsDone = async () => {
        try {
            // 1) Mark report as Resolved
            const { error } = await supabase
                .from('reports')
                .update({ status: 'Resolved' })
                .or(`pinid.eq.${pinId},id.eq.${pinId}`);

            if (error) throw error;

            // 2) Keep the pin (do NOT delete). Just mark it as Resolved so it can still be shown on the reporter's map
            //    and can render with the *_done.png pin style.
            const { error: pinErr } = await supabase
                .from('pins')
                .update({ status: 'Resolved' })
                .eq('pinid', pinId);

            if (pinErr) {
                console.warn('[WARN] Could not update pin status to Resolved:', pinErr.message);
            }

            setReportData(prev => ({ ...prev, status: 'Resolved' }));
            alert('Report marked as done!');
            await sendNotification(`Your ${reportData.type} Report at ${reportData.specific_place} has been resolved!`);
            navigate("/dashboard");
    
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                // Primary: reports linked by pinid (expected)
                let { data, error } = await supabase
                    .from("reports")
                    .select("*")
                    .eq("pinid", pinId)
                    .order("created_at", { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (error) throw error;

                // Fallback #1: sometimes the route param might be a report id
                if (!data) {
                    const r1 = await supabase
                        .from("reports")
                        .select("*")
                        .eq("id", pinId)
                        .maybeSingle();
                    if (r1.error) throw r1.error;
                    data = r1.data || null;
                }
                if (!data) throw new Error("No report found for this pin");
                setReportData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        if (pinId) fetchReportData();
    }, [pinId]);

    // Start the 24hr expiration countdown when the REPORTER views a DONE pin.
    // We store a local timestamp; Map.jsx will auto-delete the pin/report after 24hrs.
    useEffect(() => {
        const markDoneSeen = async () => {
            if (!reportData) return;
            const status = String(reportData.status || '').trim().toLowerCase();
            if (status !== 'done') return;

            const { data: { user } } = await supabase.auth.getUser();
            if (!user?.id) return;

            // Only the reporter triggers the countdown.
            if (String(reportData.user_uid || '') !== String(user.id)) return;

            const key = `doneSeenAt:${user.id}:${reportData.pinid || pinId}`;
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, String(Date.now()));
            }
        };
        markDoneSeen();
    }, [reportData, pinId]);

    useEffect(() => {
        // NOTE: this component doesn't need to fetch and store local user profile state.
        // The previous version referenced setUserId/setUserData which did not exist and
        // caused a runtime crash (blank page).
    }, []);


    useEffect(() => {
        const fetchUserRole = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (user) {
                const { data: userDetails } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', user.id)
                    .single();
                setUserRole(userDetails?.role?.trim().toLowerCase() || '');
            }
        };
        fetchUserRole();
    }, []);

    const sendNotification = async (message) => {
        try {
          if (!reportData?.user_uid) return;
      
          const { error } = await supabase
            .from('notifications')
            .insert([{
              user_id: reportData.user_uid,
              message: message,
              type: 'status_update'
            }]);
      
          if (error) throw error;
        } catch (err) {
          console.error('Error sending notification:', err);
        }
    };

    // Notify "nearby" users when a repair starts.
    // This build doesn't track live user GPS/position, so we treat "nearby" as:
    // users who have pins on the same floor (i.e., they likely use that area).
    const notifyNearbyUsersRepairStarted = async ({ pinid, floor, type, specific_place, accepted_by, reporter_uid }) => {
        try {
            if (!pinid) return;
            if (!floor) return;

            // Find users who have pins on the same floor.
            const { data: floorPins, error: floorPinsError } = await supabase
                .from('pins')
                .select('user_uid')
                .eq('floor', String(floor));
            if (floorPinsError) throw floorPinsError;

            const candidateIds = Array.from(
                new Set((floorPins || []).map(p => p.user_uid).filter(Boolean))
            );

            // Remove the reporter (they already get a direct notification)
            const filteredCandidates = candidateIds.filter(id => id !== reporter_uid);
            if (filteredCandidates.length === 0) return;

            // Filter out admins (they don't need "nearby" user alerts)
            const { data: usersRows, error: usersError } = await supabase
                .from('users')
                .select('id, role')
                .in('id', filteredCandidates);
            if (usersError) throw usersError;

            const targetUserIds = (usersRows || [])
                .filter(u => String(u.role || '').trim().toLowerCase() !== 'admin')
                .map(u => u.id);

            if (targetUserIds.length === 0) return;

            const place = specific_place ? ` at ${specific_place}` : '';
            const msg = `Repair started: ${type || 'Maintenance'}${place} is now In Progress${accepted_by ? ` (accepted by ${accepted_by})` : ''}.`;

            const rows = targetUserIds.map(uid => ({
                user_id: uid,
                message: msg,
                type: 'status_update',
                pinid: pinid,
            }));

            const { error: insError } = await supabase
                .from('notifications')
                .insert(rows);
            if (insError) throw insError;
        } catch (err) {
            console.warn('[WARN] Nearby user notification failed:', err?.message);
        }
    };
      
    // const handleAccept = async () => {
    //     try {
    //         const { error: reportError } = await supabase
    //             .from('reports')
    //             .update({ status: 'In Progress' })
    //             .eq('pinid', pinId);
            
    //         if (reportError) throw reportError;

    //         const { error: pinError } = await supabase
    //             .from('pins')
    //             .update({ status: 'In Progress' })
    //             .eq('pinid', pinId);
            
    //         if (pinError) throw pinError;

    //         setReportData(prev => ({ ...prev, status: 'In Progress' }));
    //         alert('Report Accepted!');
    //         await sendNotification(`Your ${reportData.type} Report at ${reportData.specific_place} has been accepted and is now in progress!`);
    //     } catch (err) {
    //         setError(err.message);
    //     }
    // };

    const handleAccept = async () => {
        try {
            // Get current user's details
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError) throw authError;
            if (!user) throw new Error('No authenticated user found');
            
            // Fetch user's full name from public.users table
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('fname, lname')
                .eq('id', user.id)
                .single();
    
            if (userError) throw userError;
            if (!userData) throw new Error('User details not found');
    
            // Combine first and last name
            const adminName = `${userData.fname} ${userData.lname}`.trim();
            
            // Update report with admin name
            const { error: reportError } = await supabase
                .from('reports')
                .update({ 
                    status: 'In Progress',
                    accepted_by: adminName 
                })
                .or(`pinid.eq.${pinId},id.eq.${pinId}`);
            
            if (reportError) throw reportError;
    
            // Update pin status
            // This FixFinder build links pins <-> reports via `pinid` (see ReportForm.jsx).
            // So: when a report is accepted, update the pin row using pinid.
            // (If your DB has RLS enabled, make sure admins can UPDATE pins.)
            let pinIdForPin = pinId;
            try {
                const { data: r1 } = await supabase
                    .from('reports')
                    .select('pinid')
                    .or(`pinid.eq.${pinId},id.eq.${pinId}`)
                    .maybeSingle();
                if (r1?.pinid) pinIdForPin = r1.pinid;
            } catch (e) {
                console.warn('[WARN] Could not resolve pinid from reports; using route pinId.', e?.message);
            }

            const { error: pinError } = await supabase
                .from('pins')
                .update({
                    status: 'In Progress',
                    accepted_by: adminName,
                })
                .eq('pinid', pinIdForPin);
            if (pinError) throw pinError;
    
            // Update local state
            setReportData(prev => ({ 
                ...prev, 
                status: 'In Progress',
                accepted_by: adminName
            }));
            
            alert('Report Accepted!');
            await sendNotification(
                `Your ${reportData.type} Report at ${reportData.specific_place} ` +
                `has been accepted by ${adminName} and is now in progress!`
            );

            // Notify other "nearby" users (same floor) that a repair has started.
            await notifyNearbyUsersRepairStarted({
                pinid: pinIdForPin,
                floor: reportData.floor,
                type: reportData.type,
                specific_place: reportData.specific_place,
                accepted_by: adminName,
                reporter_uid: reportData.user_uid,
            });
        } catch (err) {
            console.error('Error accepting report:', err);
            setError(err.message);
            alert(`Failed to accept report: ${err.message}`);
        }
    };
    const handleDeny = async (reason) => {
        setIsProcessing(true);
        try {
            const { error: reportError } = await supabase
                .from('reports')
                .update({ 
                    status: 'Denied',
                    denied_reason: reason 
                })
                .or(`pinid.eq.${pinId},id.eq.${pinId}`);
    
            if (reportError) throw reportError;
    
            await sendNotification(
                `Your ${reportData.type} Report at ${reportData.specific_place} has been denied. Reason: ${reason}`
            );
    
            await handleDeletePin();
            setShowDenyReasonModal(false);
            navigate("/dashboard");
    
        } catch (err) {
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
    };
    
    const handleDeletePin = async () => {
        if (!pinId) return;
        try {
            const { error: pinErr } = await supabase
                .from('pins')
                .delete()
                .eq('pinid', pinId);

            if (pinErr) throw pinErr;

            // Keep DB consistent: remove the report row(s) tied to this pin.
            // Some legacy code uses either `pinid` or `id` for lookup.
            await supabase
                .from('reports')
                .delete()
                .or(`pinid.eq.${pinId},id.eq.${pinId}`);

        } catch (err) {
            console.error('Error deleting pin:', err.message);
            throw err;
        }
    };


    if (isLoading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
    if (error) return <Typography color="error" textAlign="center" mt={4}>Error: {error}</Typography>;
    if (!reportData) return <Typography textAlign="center" mt={4}>No report found for this pin</Typography>;

    return (
        <>
             <DenyReasonModal
        open={showDenyReasonModal}
        onClose={() => setShowDenyReasonModal(false)}
        reason={denialReason}
        setReason={setDenialReason}
        onConfirm={() => handleDeny(denialReason)}
        isProcessing={isProcessing}
      />
            <StyledCard>
                <StyledHeader>Report Status</StyledHeader>
                {reportData.image && (
                    <CardMedia
                        component="img"
                        height="200"
                        image={reportData.image}
                        alt="Report Image"
                        sx={{ 
                            cursor: "pointer", 
                            objectFit: "cover",
                            maxHeight: "40vh",
                        }}
                        onClick={() => setIsImageModalOpen(true)}
                    />
                )}
                <StyledContent>
                    <DetailItem style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <DetailLabel>Title:</DetailLabel>
                        <DetailValue>{reportData.title}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                        <DetailLabel>Details:</DetailLabel>
                        <DetailValue>{reportData.details}</DetailValue>
                    </DetailItem>
                    <DetailItem style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <DetailLabel>Report Type:</DetailLabel>
                        <DetailValue>{reportData.type}</DetailValue>
                    </DetailItem>
                    <DetailItem style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <DetailLabel>Status:</DetailLabel>
                        <DetailValue>{reportData.status}</DetailValue>
                    </DetailItem>
                    <DetailItem style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <DetailLabel>Reporter Name:</DetailLabel>
                        <DetailValue>{reportData.name}</DetailValue>
                    </DetailItem>
                    <DetailItem style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <DetailLabel>UID:</DetailLabel>
                        <DetailValue>{reportData.user_uid}</DetailValue>
                    </DetailItem>
                    <DetailItem style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <DetailLabel>Place:</DetailLabel>
                        <DetailValue>{reportData.specific_place}</DetailValue>
                    </DetailItem>
                    <DetailItem style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <DetailLabel>Accepted By:</DetailLabel>
                        <DetailValue>{reportData.accepted_by}</DetailValue>
                    </DetailItem>
                    <Box textAlign="center">
                    {!['student', 'faculty'].includes(userRole?.toLowerCase()) ? (
  <>
    {reportData.status === "Pending" && (
      <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
        <ActionButton 
          onClick={handleAccept} 
          startIcon={<CheckCircleRoundedIcon />}
        >
          Accept
        </ActionButton>
        <ActionButton 
          onClick={() => setShowDenyReasonModal(true)}
          startIcon={<CancelRoundedIcon />}
        >
          Deny
        </ActionButton>
        <ActionButton 
          onClick={() => navigate("/dashboard")}
          startIcon={<FaMapMarkerAlt />}
        >
          Go to map
        </ActionButton>
      </Box>
    )}
                                 {reportData.status === "In Progress" && (
                <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
                    <ActionButton 
                        onClick={handleMarkAsDone} 
                        startIcon={<CheckCircleRoundedIcon />}
                    >
                        Mark as Done
                    </ActionButton>
                    <ActionButton 
                        onClick={() => navigate("/dashboard")}
                        startIcon={<FaMapMarkerAlt />}
                    >
                        Go to map
                    </ActionButton>
                </Box>
            )}

{reportData.status === "Resolved" && (
                <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
                    <ActionButton 
                        onClick={() => navigate("/dashboard")}
                        startIcon={<FaMapMarkerAlt />}
                    >
                        Go to map
                    </ActionButton>
                </Box>
            )}

{reportData.status === "Denied" && (
                <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
                    <ActionButton 
                        onClick={() => navigate("/dashboard")}
                        startIcon={<FaMapMarkerAlt />}
                    >
                        Go to map
                    </ActionButton>
                </Box>
            )}

                            </>
                        ) : (
                            <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
                                {(() => {
                                    const statusNorm = String(reportData.status || '').trim().toLowerCase();
                                    const canDelete = statusNorm === 'pending' || statusNorm === 'resolved';
                                    if (!canDelete) return null;

                                    const isResolved = statusNorm === 'resolved';
                                    return (
                                        <ActionButton
                                            onClick={async () => {
                                                try {
                                                    await handleDeletePin();
                                                    navigate("/dashboard");
                                                } catch (e) {
                                                    alert(`Failed to delete pin: ${e?.message || e}`);
                                                }
                                            }}
                                            sx={{
                                                backgroundColor: isResolved ? '#2E7D32' : '#E63946',
                                                '&:hover': {
                                                    backgroundColor: isResolved ? '#1B5E20' : '#dc2f3c',
                                                    transform: 'scale(1.05)',
                                                },
                                            }}
                                        >
                                            {isResolved ? 'Thank you' : 'Delete'}
                                        </ActionButton>
                                    );
                                })()}

                                <ActionButton 
                                    onClick={() => navigate("/dashboard")}
                                    startIcon={<FaMapMarkerAlt />}
                                >
                                    Go to map
                                </ActionButton>
                            </Box>
                        )}
                    </Box>
                </StyledContent>
            </StyledCard>
            <Modal open={isImageModalOpen} onClose={() => setIsImageModalOpen(false)}>
                <ModalImage>
                    <Box 
                        component="img" 
                        src={reportData.image} 
                        alt="Full Size Report Image" 
                        sx={{ 
                            maxWidth: "95%", 
                            maxHeight: "95%", 
                            borderRadius: "16px",
                            objectFit: "contain" 
                        }} 
                    />
                    <IconButton 
                        onClick={() => setIsImageModalOpen(false)} 
                        sx={{ position: "absolute", top: 20, right: 20, color: "#fff" }}
                    >
                        <CloseIcon />
                    </IconButton>
                </ModalImage>
            </Modal>
        </>
    );
};

export default ReportStatus;