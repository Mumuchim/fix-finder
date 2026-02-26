// import React, { useState, useEffect } from 'react';
// import Box from '@mui/material/Box';
// import Drawer from '@mui/material/Drawer';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import MenuIcon from '@mui/icons-material/Menu';
// import Divider from '@mui/material/Divider';
// import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
// import Typography from '@mui/material/Typography';
// import LogoutIcon from '@mui/icons-material/Logout';
// import MapIcon from '@mui/icons-material/Map';
// import HistoryIcon from '@mui/icons-material/History';
// import EditIcon from '@mui/icons-material/Edit';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import PersonIcon from '@mui/icons-material/Person';
// import supabase from "../helper/supabaseClient";
// import '../css/Navbar.css';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Badge from '@mui/material/Badge';

// const Navbar = ({ userDetails }) => {
//     const [state, setState] = useState({ left: false });
//     const [userName, setUserName] = useState('');
//     const [userRole, setUserRole] = useState('');
//     const [userID, setUserID] = useState(null);
//     const [notificationCount, setNotificationCount] = useState(0);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchUserInfo = async () => {
//             const { data: { user }, error } = await supabase.auth.getUser();
//             if (error) {
//                 console.error('Error fetching user:', error);
//                 return;
//             }
//             if (user) {
//                 const { data: userDetails, error: userError } = await supabase
//                     .from('users')
//                     .select('fname, role, id')
//                     .eq('id', user.id)
//                     .single();
                
//                 if (userError) {
//                     console.error('Error fetching user details:', userError);
//                 } else {
//                     setUserName(userDetails?.fname || 'User');
//                     setUserRole(userDetails?.role || 'Role');
//                     setUserID(userDetails?.id || 'UserID');
//                     fetchNotificationCount(user.id);
//                 }
//             }
//         };
//         fetchUserInfo();
//     }, []);

//     const fetchNotificationCount = async (userId) => {
//         const { count, error } = await supabase
//             .from('notifications')
//             .select('*', { count: 'exact', head: true })
//             .eq('user_id', userId)
//             .eq('read', false);

//         if (!error) {
//             setNotificationCount(count || 0);
//         }
//     };

//     useEffect(() => {
//         if (!userID) return;

//         const channel = supabase
//             .channel('navbar-notifications')
//             .on('postgres_changes', {
//                 event: '*',
//                 schema: 'public',
//                 table: 'notifications',
//             }, (payload) => {
//                 if (payload.new?.user_id === userID) {
//                     fetchNotificationCount(userID);
//                 }
//             })
//             .subscribe();

//         return () => {
//             supabase.removeChannel(channel);
//         };
//     }, [userID]);

//     useEffect(() => {
//         if (userDetails) {
//             setUserRole(userDetails.role || '');
//         }
//     }, [userDetails]);

//     const toggleDrawer = (anchor, open) => (event) => {
//         if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
//             return;
//         }
//         setState({ ...state, [anchor]: open });
//     };

//     const signOut = async () => {
//         try {
//             const { error } = await supabase.auth.signOut();
//             if (error) {
//                 toast.error('Error signing out. Please try again.', {
//                     position: 'top-center',
//                     autoClose: 3000,
//                 });
//                 throw error;
//             }
//             toast.success('Signed out successfully.', {
//                 position: 'top-center',
//                 autoClose: 3000,
//             });
//             setTimeout(() => {
//                 navigate('/register');
//             }, 2000);
//         } catch (error) {
//             console.error('Sign-out error:', error);
//         }
//     };

//     const handleItemClick = (path) => {
//         if (path === '/logout') {
//             signOut();
//         } else {
//             navigate(path);
//         }
//     };

//     const list = (anchor) => (
//         <Box
//             className="navbar-box"
//             role="presentation"
//             onKeyDown={toggleDrawer(anchor, false)}
//         >
//             <Box className="navbar-header">
//                 <Typography variant="h6">{`Welcome, ${userName}`}</Typography>
//                 <IconButton onClick={toggleDrawer(anchor, false)} className="navbar-close-btn">
//                     <CloseIcon />
//                 </IconButton>
//             </Box>
//             <Divider className="navbar-divider" />
//             <List className="navbar-list">
//                 {[
//                     { text: 'Map', path: '/dashboard', icon: <MapIcon /> },
//                     ...(userRole !== 'admin' ? [{
//                         text: 'Notification',
//                         path: '/notification',
//                         icon: notificationCount > 0 ? (
//                             <Badge badgeContent={notificationCount} color="error">
//                                 <NotificationsIcon />
//                             </Badge>
//                         ) : (
//                             <NotificationsIcon />
//                         )
//                     }] : []),
//                     { text: 'Report History', path: '/history', icon: <HistoryIcon /> },
//                     { text: 'Profile', path: '/profile', icon: <EditIcon /> },
//                 ].map(({ text, path, icon }) => (
//                     <ListItem key={text} disablePadding className="navbar-item">
//                         <ListItemButton onClick={() => handleItemClick(path)}>
//                             <ListItemIcon>{icon}</ListItemIcon>
//                             <ListItemText primary={text} />
//                         </ListItemButton>
//                     </ListItem>
//                 ))}
//             </List>
//             <Divider className="navbar-divider" />
//             <List className="navbar-list-logout">
//                 <ListItem disablePadding className="navbar-item">
//                     <ListItemButton>
//                         <ListItemIcon className="navbar-item-icon">
//                             <PersonIcon />
//                         </ListItemIcon>
//                         <ListItemText primary={userRole} className="navbar-logout-text" />
//                     </ListItemButton>
//                 </ListItem>
//                 <ListItem disablePadding className="navbar-item">
//                     <ListItemButton onClick={() => handleItemClick('/logout')}>
//                         <ListItemIcon className="navbar-item-icon">
//                             <LogoutIcon />
//                         </ListItemIcon>
//                         <ListItemText primary="Logout" className="navbar-logout-text" />
//                     </ListItemButton>
//                 </ListItem>
//             </List>
//         </Box>
//     );

//     return (
//         <div className="Navbar">
//             {userRole !== 'admin' ? (
//                 notificationCount > 0 ? (
//                     <Badge 
//                         badgeContent={notificationCount} 
//                         color="error"
//                         overlap="circular"
//                     >
//                         <MenuIcon
//                             onClick={toggleDrawer('left', true)}
//                             style={{ cursor: 'pointer' }}
//                         />
//                     </Badge>
//                 ) : (
//                     <MenuIcon
//                         onClick={toggleDrawer('left', true)}
//                         style={{ cursor: 'pointer' }}
//                     />
//                 )
//             ) : (
//                 <MenuIcon
//                     onClick={toggleDrawer('left', true)}
//                     style={{ cursor: 'pointer' }}
//                 />
//             )}
//             <Drawer
//                 anchor="left"
//                 open={state['left']}
//                 onClose={toggleDrawer('left', false)}
//                 ModalProps={{
//                     keepMounted: true,
//                 }}
//             >
//                 {list('left')}
//             </Drawer>
//         </div>
//     );
// };

// export default Navbar;

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/Logout';
import MapIcon from '@mui/icons-material/Map';
import HistoryIcon from '@mui/icons-material/History';
import EditIcon from '@mui/icons-material/Edit';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import supabase from "../helper/supabaseClient";
import '../css/Navbar.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SettingsModal from './SettingsModal';
import { playSlideSfx } from '../helper/sfx';

const Navbar = ({ userDetails }) => {
    const [state, setState] = useState({ left: false });
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [userID, setUserID] = useState(null);
    const [notificationCount, setNotificationCount] = useState(0);
    const navigate = useNavigate();

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
                    .select('fname, role, id')
                    .eq('id', user.id)
                    .single();
                
                if (userError) {
                    console.error('Error fetching user details:', userError);
                } else {
                    setUserName(userDetails?.fname || 'User');
                    setUserRole(userDetails?.role || 'Role');
                    setUserID(userDetails?.id || 'UserID');
                    fetchNotificationCount(user.id);
                }
            }
        };
        fetchUserInfo();
    }, []);

    const fetchNotificationCount = async (userId) => {
        const { count, error } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('is_read', false);

        if (!error) {
            setNotificationCount(count || 0);
        }
    };

    useEffect(() => {
        if (!userID) return;

        const channel = supabase
            .channel('navbar-notifications')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'notifications',
            }, (payload) => {
                if (payload.new?.user_id === userID) {
                    fetchNotificationCount(userID);
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userID]);

    useEffect(() => {
        if (userDetails) {
            setUserRole(userDetails.role || '');
        }
    }, [userDetails]);

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
        // Slide SFX for both opening and closing the sidebar.
        playSlideSfx();
    };

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                toast.error('Error signing out. Please try again.', {
                    position: 'top-center',
                    autoClose: 3000,
                });
                throw error;
            }
            toast.success('Signed out successfully.', {
                position: 'top-center',
                autoClose: 3000,
            });
            setTimeout(() => {
                navigate('/register');
            }, 2000);
        } catch (error) {
            console.error('Sign-out error:', error);
        }
    };

    const handleItemClick = (path) => {
        if (path === '/logout') {
            signOut();
        } else if (path === '__settings__') {
            setSettingsOpen(true);
        } else {
            navigate(path);
        }
    };

    // Red "pill" badge style (copied from the Floor button style)
    const notifBadge = (count) => (
        <span
            style={{
                backgroundColor: '#e63946',
                borderRadius: '999px',
                padding: '2px 8px',
                fontSize: '0.75em',
                fontWeight: 'bold',
                lineHeight: 1,
                minWidth: '22px',
                textAlign: 'center',
                color: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.12)',
            }}
        >
            {count}
        </span>
    );

    const notificationsIconWithBadge = (count) => (
        <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            <NotificationsIcon />
            {count > 0 ? (
                <span
                    style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-14px',
                        pointerEvents: 'none',
                    }}
                >
                    {notifBadge(count)}
                </span>
            ) : null}
        </span>
    );

    const list = (anchor) => (
        <Box
            className="navbar-box"
            role="presentation"
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <Box className="navbar-header">
                <Typography variant="h6">{`Welcome, ${userName}`}</Typography>
                <IconButton onClick={toggleDrawer(anchor, false)} className="navbar-close-btn" data-sfx="click">
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider className="navbar-divider" />
            <List className="navbar-list">
                {[
                    { text: 'Map', path: '/dashboard', icon: <MapIcon /> },
                    // Notifications are for Students/Faculty only.
                    ...((userRole !== 'admin' && userRole !== 'it admin') ? ([{
                        text: 'Notification',
                        path: '/notification',
                        icon: <NotificationsIcon />,
                        badgeCount: notificationCount,
                    }]) : ([])),
                    { text: 'Report History', path: '/history', icon: <HistoryIcon /> },
                    { text: 'Profile', path: '/profile', icon: <EditIcon /> },
                    { text: 'Settings', path: '__settings__', icon: <SettingsIcon /> },
                ].map(({ text, path, icon, badgeCount }) => (
                    <ListItem key={text} disablePadding className="navbar-item">
                        <ListItemButton onClick={() => handleItemClick(path)} data-sfx="click">
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={text} />
                            {typeof badgeCount === 'number' && badgeCount > 0 ? (
                              <Box sx={{ marginLeft: 'auto', paddingRight: '6px' }}>
                                {notifBadge(badgeCount)}
                              </Box>
                            ) : null}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider className="navbar-divider" />
            <List className="navbar-list-logout">
                <ListItem disablePadding className="navbar-item">
                    <ListItemButton data-sfx="click">
                        <ListItemIcon className="navbar-item-icon">
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary={userRole} className="navbar-logout-text" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding className="navbar-item">
                    <ListItemButton onClick={() => handleItemClick('/logout')} data-sfx="click">
                        <ListItemIcon className="navbar-item-icon">
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" className="navbar-logout-text" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <div className="Navbar">
            <Box 
                sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px',
                    position: 'relative',
                    '&:hover': {
                        backgroundColor: 'action.hover',
                        borderRadius: '50%'
                    }
                }}
            >
                <span style={{ position: 'relative', display: 'inline-flex' }}>
                    <IconButton
                        onClick={toggleDrawer('left', true)}
                        size="large"
                        sx={{
                            padding: '12px',
                            '&:hover': { backgroundColor: 'transparent' }
                        }}
                        data-sfx="noclick"
                    >
                        <MenuIcon sx={{ fontSize: '2rem', color: '#ffffff' }} />
                    </IconButton>
                    {(userRole !== 'admin' && userRole !== 'it admin') && notificationCount > 0 ? (
                        <span
                            style={{
                                position: 'absolute',
                                top: '2px',
                                right: '2px',
                                pointerEvents: 'none',
                            }}
                        >
                            {notifBadge(notificationCount)}
                        </span>
                    ) : null}
                </span>
            </Box>
            <Drawer
                anchor="left"
                open={state['left']}
                onClose={toggleDrawer('left', false)}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                {list('left')}
            </Drawer>

            <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        </div>
    );
};

export default Navbar;