import { createContext, useContext, useState, type ReactNode } from 'react';
import { getBrowserLanguage, t, type LanguageCode } from '@i18n/index';

interface LangContextValue {
  lang: LanguageCode;
  setLang: (l: LanguageCode) => void;
  $: (key: string, params?: Record<string, string | number>) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<LanguageCode>(() => getBrowserLanguage());
  const $ = (key: string, params?: Record<string, string | number>) => t(lang, key, params);

  return <LangContext.Provider value={{ lang, setLang, $ }}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
