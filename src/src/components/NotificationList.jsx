import React, { useState, useEffect } from 'react';
import { supabase } from '../helper/supabaseClient';
import styled from '@emotion/styled';
import { Box, Badge, IconButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';

const NotificationContainer = styled(Box)`
  position: relative;
  display: inline-block;
`;

const NotificationDropdown = styled(Box)`
  position: absolute;
  top: 100%;
  right: 0;
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
`;

const NotificationItem = styled(Box)`
  padding: 12px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.isRead ? 'white' : '#f0f7ff'};
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    subscribeToNotifications();
  }, []);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return;
    }

    setNotifications(data);
    updateUnreadCount(data);
  };

  const subscribeToNotifications = () => {
    const subscription = supabase
      .channel('notifications')
      .on('INSERT', payload => {
        setNotifications(prev => [payload.new, ...prev]);
        updateUnreadCount([payload.new, ...notifications]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const updateUnreadCount = (notifs) => {
    const count = notifs.filter(n => !n.is_read).length;
    setUnreadCount(count);
  };

  const markAsRead = async (notificationId) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (!error) {
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
      updateUnreadCount(notifications);
    }
  };

  const deleteNotification = async (notificationId) => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (!error) {
      setNotifications(notifications.filter(n => n.id !== notificationId));
      updateUnreadCount(notifications.filter(n => n.id !== notificationId));
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <NotificationContainer>
      <IconButton onClick={() => setIsOpen(!isOpen)}>
        <NotificationsIcon />
        {unreadCount > 0 && (
          <Badge 
            badgeContent={unreadCount} 
            color="error" 
            sx={{ position: 'absolute', top: 0, right: 0 }}
          />
        )}
      </IconButton>

      {isOpen && (
        <NotificationDropdown>
          {notifications.length === 0 ? (
            <Box p={2} textAlign="center">No notifications</Box>
          ) : (
            notifications.map(notification => (
              <NotificationItem 
                key={notification.id}
                isRead={notification.is_read}
                onClick={() => markAsRead(notification.id)}
              >
                <Box flex={1}>
                  <Box fontWeight={notification.is_read ? 'normal' : 'bold'}>
                    {notification.message}
                  </Box>
                  <Box fontSize="0.8rem" color="text.secondary">
                    {formatTimestamp(notification.created_at)}
                  </Box>
                </Box>
                <IconButton 
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </NotificationItem>
            ))
          )}
        </NotificationDropdown>
      )}
    </NotificationContainer>
  );
};

export default NotificationList;