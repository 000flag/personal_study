import { AppBar, Toolbar, Typography, Box } from "@mui/material";

const Header: React.FC = () => {
    const HOME_HREF = "index.html";

    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: "#1F2937",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
        >
            <Toolbar>
                <Typography
                    variant="h6"
                    component="a"
                    href={HOME_HREF}
                    sx={{
                        color: "inherit",
                        textDecoration: "none",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        display: "inline-flex",
                        alignItems: "center",
                    }}
                    aria-label="관리 목록으로 이동"
                >
                    관리
                </Typography>

                <Box sx={{ flexGrow: 1 }} />
            </Toolbar>
        </AppBar>
    );
};

export default Header;
