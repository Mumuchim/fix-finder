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


const PinSidebar = ({ isOpen, setIsOpen, onPinSelect }) => {
    const pinData = [
        { id: 'Hazard', icon: CautionHoverIcon, hoverIcon: CautionIcon, label: 'Hazard', type: 'Hazard' },
        { id: 'Cleaning', icon: CleaningHoverIcon, hoverIcon: CleaningIcon, label: 'Cleaning Pin', type: 'Cleaning' },
        { id: 'Electrical Hazard', icon: ElectricalHoverIcon, hoverIcon: ElectricalIcon, label: 'Electrical Hazard', type: 'Electrical Hazard' },
        { id: 'IT Maintenance', icon: ITHoverIcon, hoverIcon: ITIcon, label: 'IT Maintenance Pin', type: 'IT Maintenance' },
        { id: 'Repair', icon: RepairHoverIcon, hoverIcon: RepairIcon, label: 'Repair Pin', type: 'Repair' },
        { id: 'Request', icon: RequestHoverIcon, hoverIcon: RequestIcon, label: 'Request Pin', type: 'Request' },
    ];

    const handlePinClick = (pin) => {
        const userConfirmed = window.confirm(`${pin.label} selected`);
        if (userConfirmed) {
            onPinSelect(pin); // Notify parent component of the selected pin
            setIsOpen(false);
        }
    };

    return (
        <Drawer
            anchor="right"
            open={isOpen}
            onClose={() => setIsOpen(false)}
            sx={{
                '& .MuiDrawer-paper': {
                    width: 300,
                    backgroundColor: '#A8DADC',
                },
            }}
        >
            <Box>
                <Typography variant="h6" component="div">
                    Select a Pin
                </Typography>
                <List>
                    {pinData.map((pin) => (
                        <ListItem key={pin.id} onClick={() => handlePinClick(pin)}>
                            <ListItemIcon>
                                <img src={pin.icon} alt={pin.label} style={{ width: 40 }} />
                            </ListItemIcon>
                            <ListItemText primary={pin.label} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
};

export default PinSidebar;
