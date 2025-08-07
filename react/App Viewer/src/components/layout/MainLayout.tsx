import type { PropsWithChildren } from "react";
import { Box, Toolbar } from "@mui/material";
import Header from "./Header";
// import Sidebar from "./Sidebar";

const MainLayout = ({ children }: PropsWithChildren) => {
    return (
        <Box sx={{ display: "flex" }}>
            <Header />
            {/* <Sidebar /> */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: "100%",
                    ml: 0,
                    px: 3,
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default MainLayout;
