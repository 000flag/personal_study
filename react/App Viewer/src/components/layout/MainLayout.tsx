import type { PropsWithChildren } from "react";
import { Box, Toolbar } from "@mui/material";
import Header from "./Header";

const MainLayout = ({ children }: PropsWithChildren) => {
    return (
        <Box sx={{ display: "flex" }}>
            <Header />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: "100%",
                    ml: 0,
                    px: 4,
                    py: 3,
                    margin: "0 auto",
                    boxSizing: "border-box",
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default MainLayout;
