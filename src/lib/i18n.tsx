import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Lang = "en" | "hi" | "gu";

type I18nContextValue = {
    lang: Lang;
    setLang: (l: Lang) => void;
    t: (path: string) => any;
};

import en from "../language/en.json";
import hi from "../language/hi.json";
import gu from "../language/gu.json";

const Locales: Record<Lang, Record<string, any>> = {
    en,
    hi,
    gu,
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem("lang") as Lang) || "en");

    useEffect(() => {
        try {
            localStorage.setItem("lang", lang);
        } catch (e) {
            // ignore
        }
    }, [lang]);

    const setLang = (l: Lang) => setLangState(l);

    const t = (path: string) => {
        const parts = path.split(".");
        let cur: any = Locales[lang];
        for (const p of parts) {
            if (!cur) return path;
            cur = cur[p];
        }
        return cur;
    };

    const value = useMemo(() => ({ lang, setLang, t }), [lang]);

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValue => {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error("useI18n must be used within I18nProvider");
    return ctx;
};

export default I18nContext;
