import React, { useState, useEffect } from "react";
import { 
  Alert,
  IconButton, 
  Typography, 
  Box, 
  Container, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Divider,
  Collapse,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { styled } from "@mui/system";
import { FaCheckCircle, FaTimes, FaBell, FaEnvelope, FaEye } from "react-icons/fa";
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import supabase from "../helper/supabaseClient";

const StyledAlert = styled(Alert)(({ theme }) => ({
  fontSize: "1.1rem",
  alignItems: "center",
  "& .MuiAlert-icon": {
    fontSize: "2rem"
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: "1rem",
    margin: theme.spacing(1),
    "& .MuiAlert-icon": {
      fontSize: "1.5rem"
    }
  }
}));

const NotificationContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  }
}));

const NotificationItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[3]
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(1)
  }
}));

const NotificationPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    role: "",
    customUid: "",
  });
  
  const [showBanner, setShowBanner] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [latestNotification, setLatestNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (showBanner) {
      const timer = setTimeout(() => setShowBanner(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showBanner]);

  useEffect(() => {
    const fetchUserAndNotifications = async () => {
      try {
        setLoading(true);
        
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) return;

        const { data: userDetails, error: userError } = await supabase
          .from('users')
          .select('fname, lname, role, id')
          .eq('id', user.id)
          .single();

        if (userError) throw userError;

        setFormData({
          name: `${userDetails.fname} ${userDetails.lname}`,
          lastName: userDetails.lname,
          email: user.email,
          role: userDetails.role,
          customUid: userDetails.id,
        });

        const { data: notificationsData, error: notificationsError } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (notificationsError) throw notificationsError;
        
        setNotifications(notificationsData);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndNotifications();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        async (payload) => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          if (payload.new.user_id === user.id) {
            setNotifications(prev => [payload.new, ...prev]);
            setLatestNotification(payload.new);
            setShowBanner(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const markAsRead = async (id) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (!error) {
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    }
  };

  const openNotification = async (notification) => {
    setSelectedNotification(notification);
    setDetailsOpen(true);
    if (!notification.read) {
      await markAsRead(notification.id);
    }
  };

  const closeDetails = () => {
    setDetailsOpen(false);
    setSelectedNotification(null);
  };

  const markAllAsRead = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return;

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);

    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const clearAllNotifications = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) return;

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      if (!error) {
        setNotifications([]);
      }
      setShowClearConfirmation(false);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const handleCloseBanner = () => {
    setShowBanner(false);
    setLatestNotification(null);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const ClearConfirmationDialog = () => (
    <Dialog
      open={showClearConfirmation}
      onClose={() => setShowClearConfirmation(false)}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle sx={{ fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
        Confirm Clear All Notifications
      </DialogTitle>
      <DialogContent>
        <Typography variant={isMobile ? 'body2' : 'body1'}>
          Are you sure you want to permanently delete all notifications? 
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ 
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 1 : 0
      }}>
        <Button 
          onClick={() => setShowClearConfirmation(false)} 
          fullWidth={isMobile}
          size={isMobile ? "small" : "medium"}
        >
          Cancel
        </Button>
        <Button 
          onClick={clearAllNotifications} 
          color="error"
          variant="contained"
          fullWidth={isMobile}
          size={isMobile ? "small" : "medium"}
        >
          Confirm Delete All
        </Button>
      </DialogActions>
    </Dialog>
  );

  const DetailsDialog = () => (
    <Dialog
      open={detailsOpen}
      onClose={closeDetails}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Notification</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.8 }}>
          {selectedNotification?.type === 'status_update' ? 'Status Update' : 'New Message'}
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {selectedNotification?.message || ''}
        </Typography>
        {selectedNotification?.created_at && (
          <Typography variant="caption" sx={{ display: 'block', mt: 2, opacity: 0.7 }}>
            {new Date(selectedNotification.created_at).toLocaleString()}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 2, py: 1.5, gap: 1, flexWrap: 'wrap' }}>
        <Button onClick={closeDetails} variant="outlined">Close</Button>
        <Button
          onClick={() => { closeDetails(); navigate('/dashboard'); }}
          variant="contained"
        >
          Open Map
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box>
      <Navbar userDetails={formData} notificationCount={unreadCount}/>

      <Collapse in={showBanner && !!latestNotification}>
        <StyledAlert
          severity="info"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleCloseBanner}
            >
              <FaTimes fontSize="inherit" />
            </IconButton>
          }
          sx={{ mt: 2, mb: 2 }}
        >
          {latestNotification?.message}
        </StyledAlert>
      </Collapse>

      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 4 
        }}>
          <CircularProgress size={isMobile ? "2.5rem" : "4rem"} />
        </Box>
      ) : notifications.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 4 
        }}>
          <Typography variant="h6">No notifications found</Typography>
        </Box>
      ) : (
        <NotificationContainer maxWidth="md">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 4,
            gap: 2 
          }}>
            <Typography variant={isMobile ? "h5" : "h4"} component="h1" sx={{ 
              display: "flex", 
              alignItems: "center",
              mb: isMobile ? 2 : 0
            }}>
              <FaBell style={{ marginRight: "12px", fontSize: isMobile ? "1.5rem" : "2rem" }} />
              Notifications
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              width: isMobile ? '100%' : 'auto',
              flexDirection: isMobile ? 'column' : 'row'
            }}>
              <Button 
                variant="contained" 
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                fullWidth={isMobile}
                size={isMobile ? "small" : "medium"}
              >
                Mark All as Read
              </Button>
              <Button 
                variant="contained" 
                color="error"
                onClick={() => setShowClearConfirmation(true)}
                disabled={notifications.length === 0}
                fullWidth={isMobile}
                size={isMobile ? "small" : "medium"}
              >
                Clear All
              </Button>
            </Box>
          </Box>

          <List>
            {notifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <NotificationItem elevation={1}>
                  <ListItem onClick={() => openNotification(notification)} sx={{ 
                    padding: isMobile ? theme.spacing(1) : theme.spacing(2),
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}>
                    <ListItemIcon sx={{ minWidth: isMobile ? 40 : 56 }}>
                      {notification.type === 'status_update' ? (
                        notification.message.toLowerCase().includes('denied') ? (
                          <FaTimes color="#ff4444" style={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
                        ) : (
                          <FaCheckCircle color="#4caf50" style={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
                        )
                      ) : (
                        <FaEnvelope color="#2196f3" style={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={notification.type === 'status_update' ? 'Status Update' : 'New Message'}
                      secondary={notification.message}
                      sx={{ 
                        opacity: notification.read ? 0.6 : 1,
                        transition: 'opacity 0.3s ease',
                        '& .MuiListItemText-primary': {
                          fontSize: isMobile ? '0.9rem' : '1rem'
                        },
                        '& .MuiListItemText-secondary': {
                          fontSize: isMobile ? '0.8rem' : '0.9rem'
                        }
                      }}
                    />
                    <IconButton 
                      edge="end" 
                      aria-label="mark as read"
                      onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                      size={isMobile ? "small" : "medium"}
                    >
                      {notification.read ? (
                        <FaCheckCircle color="#4caf50" />
                      ) : (
                        <FaEye color="#666" />
                      )}
                    </IconButton>
                  </ListItem>
                </NotificationItem>
                <Divider sx={{ my: 1 }} />
              </React.Fragment>
            ))}
          </List>
        </NotificationContainer>
      )}
      <ClearConfirmationDialog />
      <DetailsDialog />
    </Box>
  );
};

export default NotificationPage;