import React, { useState } from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    IconButton,
    Typography,
    Button,
} from '@mui/material';
import { Inbox, ExpandLess, ExpandMore, Menu } from '@mui/icons-material';

const Sidebar = ({ onButtonClick }) => {
    const [openDrawer, setOpenDrawer] = useState(true); // Sidebar open state
    const [openCategory, setOpenCategory] = useState(false); // Dropdown toggle for "Category"

    const toggleDrawer = () => setOpenDrawer(!openDrawer); // Toggle sidebar visibility

    const handleCategoryClick = () => setOpenCategory(!openCategory); // Toggle dropdown menu

    return (
        <>
            {/* Toggle Button */}
            <IconButton
                onClick={toggleDrawer}
                sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1201 }}
            >
                <Menu />
            </IconButton>

            {/* Sidebar Drawer */}
            <Drawer
                variant="persistent"
                open={openDrawer}
                sx={{
                    width: openDrawer ? 240 : 0,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        boxSizing: 'border-box',
                        transition: 'width 0.3s',
                    },
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        textAlign: 'center',
                        py: 2,
                        borderBottom: '3px solid #ddd',
                        backgroundColor: '#1976d2',
                        color: '#fff',
                    }}
                >
                    Admin Dashboard
                </Typography>

                <List>
                    {/* Dashboard */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => onButtonClick('dashboard')}>
                            <ListItemIcon>
                                <Inbox />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItemButton>
                    </ListItem>

                    {/* Category Dropdown */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleCategoryClick}>
                            <ListItemIcon>
                                <Inbox />
                            </ListItemIcon>
                            <ListItemText primary="Category" />
                            {openCategory ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={openCategory} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                onClick={() => onButtonClick('products')}
                            >
                                <ListItemText primary="Manage Products" />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                onClick={() => onButtonClick('orders')}
                            >
                                <ListItemText primary="Manage Orders" />
                            </ListItemButton>
                            {/* <ListItemButton
                                sx={{ pl: 4 }}
                                onClick={() => onButtonClick('users')}
                            >
                                <ListItemText primary="Manage Users" />
                            </ListItemButton> */}
                        </List>
                    </Collapse>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => onButtonClick('charts')}>
                            <ListItemIcon>
                                <Inbox />
                            </ListItemIcon>
                            <ListItemText primary="Charts" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
};

export default Sidebar;
