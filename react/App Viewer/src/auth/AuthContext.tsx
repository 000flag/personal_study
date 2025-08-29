import { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthContextType = {
    isAuthed: boolean;
    login: () => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthed, setIsAuthed] = useState<boolean>(() => {
        return sessionStorage.getItem("authed") === "true";
    });

    useEffect(() => {
        sessionStorage.setItem("authed", isAuthed ? "true" : "false");
    }, [isAuthed]);

    const value = useMemo(
        () => ({
            isAuthed,
            login: () => setIsAuthed(true),
            logout: () => setIsAuthed(false),
        }),
        [isAuthed]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
