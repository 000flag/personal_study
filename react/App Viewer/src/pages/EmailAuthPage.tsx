import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
    Alert, Box, Card, CardContent, Container, Stack, TextField,
    Typography, Button, Snackbar, Divider,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { sendEmailVerification, checkEmailVerification } from "../api/api";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_TTL = 90; // 1분 30초

// import.meta 안전 캐스팅용
interface MaybeImportMeta {
    env?: Record<string, string | undefined>;
}

function isDevMode(): boolean {
    try {
        return import.meta.env.MODE === "development";
    } catch {
        return false;
    }
}

function getEnv(name: string): string | undefined {
    try {
        const meta = (import.meta as unknown as MaybeImportMeta) ?? {};
        return meta.env?.[name];
    } catch {
        return undefined;
    }
}

const EmailAuthPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation() as { state?: { from?: Location } };

    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    const [sent, setSent] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string>("");

    // ----- 개발/로컬 스킵 옵션 -----
    const dev = isDevMode();
    const searchParams = new URLSearchParams(window.location.search);
    const skipParam = searchParams.get("skipAuth") === "1";
    const skipEnv = getEnv("VITE_SKIP_EMAIL_AUTH") === "1";
    const shouldAutoSkip = dev && (skipEnv || skipParam);

    // .env 에서 허용 도메인 읽기 (Vite/CRA 호환 시도)
    const ALLOWED_DOMAINS = useMemo(() => {
        let raw = "";
        try {
            const meta = (import.meta as unknown as MaybeImportMeta) ?? {};
            const env = meta.env ?? {};
            raw = env.VITE_ALLOWED_EMAIL_DOMAINS ?? env.REACT_APP_ALLOWED_EMAIL_DOMAINS ?? "";
        } catch {
            raw = "";
        }
        return raw
            .split(/[,\s]+/)
            .map((d) => d.trim().toLowerCase())
            .filter(Boolean);
    }, []);

    const emailValid = useMemo(() => EMAIL_REGEX.test(email.trim()), [email]);
    const codeValid = useMemo(() => /^[A-Za-z0-9]{5,6}$/.test(code), [code]);

    // 이메일 도메인 허용 여부
    const domainAllowed = useMemo(() => {
        if (!emailValid) return false;
        const domain = email.split("@")[1]?.toLowerCase() ?? "";
        if (ALLOWED_DOMAINS.length === 0) return true; // 비어있으면 전부 허용
        return ALLOWED_DOMAINS.includes(domain);
    }, [email, emailValid, ALLOWED_DOMAINS]);

    const canSendCode = emailValid && domainAllowed && countdown === 0;
    const lastSubmittedRef = useRef<string>("");

    // 만료 여부
    const codeExpired = sent && countdown <= 0;

    // 남은 시간 표시 mm:ss
    const fmt = (s: number) => {
        const mm = String(Math.floor(s / 60)).padStart(2, "0");
        const ss = String(s % 60).padStart(2, "0");
        return `${mm}:${ss}`;
    };

    // resend/TTL 타이머
    useEffect(() => {
        if (countdown <= 0) return;
        const t = setInterval(() => setCountdown((s) => s - 1), 1000);
        return () => clearInterval(t);
    }, [countdown]);

    // 🔹 개발모드 자동 스킵
    useEffect(() => {
        if (!shouldAutoSkip) return;
        login();
        const redirectTo = location.state?.from?.pathname ?? "/";
        navigate(redirectTo, { replace: true });
    }, [shouldAutoSkip, login, navigate, location.state?.from?.pathname]);

    const devSkip = () => {
        // 🔹 개발모드 수동 스킵 버튼
        if (!dev) return;
        login();
        const redirectTo = location.state?.from?.pathname ?? "/";
        navigate(redirectTo, { replace: true });
    };

    const handleSendCode = async () => {
        setError(null);
        if (!emailValid) {
            setError("올바른 이메일을 입력해 주세요.");
            return;
        }
        if (!domainAllowed) {
            setError("접근할 수 없습니다.");
            return;
        }
        try {
            const msg = await sendEmailVerification(email.trim());
            setSent(true);
            setCountdown(CODE_TTL);
            lastSubmittedRef.current = ""; // 새 코드 발급 시 초기화
            setSuccessMsg(msg || "Email 인증이 발송되었습니다.");
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "인증 코드 발송 중 오류가 발생했습니다.";
            setError(message);
        }
    };

    const doVerify = async () => {
        setError(null);

        if (!emailValid) {
            setError("올바른 이메일을 입력해 주세요.");
            return;
        }
        if (!domainAllowed) {
            setError("접근할 수 없습니다.");
            return;
        }
        if (!/^[A-Za-z0-9]{5,6}$/.test(code)) {
            setError("올바른 인증 코드를 입력해 주세요.");
            return;
        }
        if (codeExpired) {
            setError("인증 코드 유효 시간이 만료되었습니다. 다시 요청해 주세요.");
            return;
        }
        if (loading) return;
        if (lastSubmittedRef.current === code) return;

        setLoading(true);
        try {
            const ok = await checkEmailVerification(email.trim(), code);
            lastSubmittedRef.current = code;
            if (!ok) {
                setError("인증 실패: 코드가 올바르지 않습니다.");
                return;
            }
            login();
            const redirectTo = location.state?.from?.pathname ?? "/";
            navigate(redirectTo, { replace: true });
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "인증 처리 중 오류가 발생했습니다.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    // 자동 제출: 유효/미만료/허용도메인일 때만
    useEffect(() => {
        if (emailValid && domainAllowed && codeValid && !codeExpired && !loading) {
            void doVerify();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [codeValid, emailValid, domainAllowed, codeExpired, loading]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await doVerify();
    };

    // 🔹 개발모드 자동 스킵이면 화면을 거의 보지 못하고 바로 리다이렉트됨
    return (
        <Container maxWidth="sm" sx={{ minHeight: "100vh", display: "grid", placeItems: "center", py: 6 }}>
            <Card elevation={3} sx={{ width: "100%", borderRadius: 3 }}>
                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                        이메일 인증
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        이메일로 받은 인증 코드를 입력해 주세요. 인증이 완료되면 다음 화면으로 이동합니다.
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={onSubmit}>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="stretch" sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                label="이메일"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    lastSubmittedRef.current = "";
                                }}
                                autoComplete="email"
                                required
                                error={!!email && (!emailValid || (emailValid && !domainAllowed))}
                                helperText={
                                    !!email && !emailValid
                                        ? "유효한 이메일 형식이 아닙니다."
                                        : !!email && emailValid && !domainAllowed
                                            ? "접근할 수 없습니다."
                                            : " "
                                }
                            />
                            <Button
                                variant="outlined"
                                onClick={handleSendCode}
                                disabled={!canSendCode}
                                sx={{ whiteSpace: "nowrap", height: 56 }}
                            >
                                {countdown > 0 ? `재전송 (${fmt(countdown)})` : sent ? "재전송" : "코드 받기"}
                            </Button>
                        </Stack>

                        <TextField
                            fullWidth
                            label="인증 코드"
                            value={code}
                            onChange={(e) => {
                                const alnum = e.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 6);
                                setCode(alnum);
                            }}
                            inputProps={{ pattern: "[A-Za-z0-9]{5,6}", maxLength: 6 }}
                            required
                            error={!!code && (!codeValid || codeExpired)}
                            helperText={
                                codeExpired
                                    ? "인증 코드 유효 시간이 만료되었습니다. 다시 요청해 주세요."
                                    : !!code && !codeValid
                                        ? "영문/숫자 5~6자리를 입력해 주세요."
                                        : sent && countdown > 0
                                            ? `남은 시간 ${fmt(countdown)}`
                                            : " "
                            }
                            sx={{ mb: 2 }}
                        />

                        <LoadingButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            loading={loading}
                            disabled={!emailValid || !domainAllowed || !codeValid || codeExpired || loading}
                            sx={{ py: 1.4, borderRadius: 2, fontWeight: 700 }}
                        >
                            인증 확인
                        </LoadingButton>
                    </Box>

                    {/* 🔹 개발모드 전용 스킵 UI */}
                    {dev && (
                        <>
                            <Divider sx={{ my: 3 }} />
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="caption" color="text.secondary">
                                    개발모드: <code>VITE_SKIP_EMAIL_AUTH=1</code> 또는 <code>?skipAuth=1</code>로 자동 스킵
                                </Typography>
                                <Button size="small" color="secondary" onClick={devSkip}>
                                    개발용: 인증 건너뛰기
                                </Button>
                            </Stack>
                        </>
                    )}
                </CardContent>
            </Card>

            <Snackbar
                open={!!successMsg}
                autoHideDuration={2000}
                onClose={() => setSuccessMsg("")}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={() => setSuccessMsg("")} severity="success" sx={{ width: "100%" }}>
                    {successMsg}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default EmailAuthPage;
