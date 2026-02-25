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
            const { error } = await supabase
                .from('reports')
                .update({ status: 'Resolved' })
                .eq('pinid', pinId);
    
            if (error) throw error;
            
            await handleDeletePin();
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
                const { data, error } = await supabase
                    .from("reports")
                    .select("*")
                    .eq("pinid", pinId)
                    .single();
                
                if (error) throw error;
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
                .eq('pinid', pinId);
            
            if (reportError) throw reportError;
    
            // Update pin status
            const { error: pinError } = await supabase
                .from('pins')
                .update({ 
                    status: 'In Progress',
                    accepted_by: adminName
                })
                .eq('pinid', pinId);
            
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
                .eq('pinid', pinId);
    
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
            const { error } = await supabase
                .from('pins')
                .delete()
                .eq('pinid', pinId);
    
            if (error) throw error;
        } catch (err) {
            console.error('Error deleting pin:', err.message);
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
                            <ActionButton 
                                onClick={() => navigate("/dashboard")}
                                startIcon={<FaMapMarkerAlt />}
                            >
                                Go to map
                            </ActionButton>
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
