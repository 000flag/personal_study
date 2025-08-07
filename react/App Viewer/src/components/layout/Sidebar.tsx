import { useNavigate } from "react-router-dom";
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Box,
    ListItemButton
} from "@mui/material";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import InfoIcon from "@mui/icons-material/Info";

const drawerWidth = 240;

const menuItems = [
    { text: "모델 목록", icon: <AssignmentIndIcon />, path: "/" },
    { text: "관리자 가이드", icon: <InfoIcon />, path: "/guide" }
];

const Sidebar = () => {
    const navigate = useNavigate();

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: "border-box",
                    backgroundColor: "#F9FAFB",
                    borderRight: "1px solid #E5E7EB"
                }
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: "auto", mt: 2 }}>
                <List>
                    {menuItems.map(({ text, icon, path }) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton onClick={() => navigate(path)}>
                                <ListItemIcon>{icon}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
