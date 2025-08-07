import { AppBar, Toolbar, Typography } from "@mui/material";

const Header = () => {
    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: "#1F2937",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}
        >
            <Toolbar>
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    모델 관리
                </Typography>
                {/* 추가: 알림 아이콘, 프로필, 로그아웃 등 */}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
