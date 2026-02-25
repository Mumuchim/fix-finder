// imports.js

import React, { useState, useRef } from 'react';
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
import '@fontsource/poppins'; // Defaults to 400 weight
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Report from './ReportForm'; // Import your component
// Import your images here
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

export {
    React,
    useState,
    useRef,
    Box,
    Drawer,
    Typography,
    IconButton,
    CloseIcon,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    createTheme,
    ThemeProvider,
    Report,
    CautionIcon,
    CautionHoverIcon,
    CleaningIcon,
    CleaningHoverIcon,
    ElectricalIcon,
    ElectricalHoverIcon,
    ITIcon,
    ITHoverIcon,
    RepairIcon,
    RepairHoverIcon,
    RequestIcon,
    RequestHoverIcon
};
