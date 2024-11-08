import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es' | 'fr' | 'it' | 'ja' | 'de' | 'ru' | 'zh' | 'pt' | 'tr';

type Translations = {
  [key in Language]: {
    greeting: string;
    description: string;
    viewProjects: string;
    sourceCode: string;
    legacyVersion: string;
  };
};

const translations: Translations = {
  en: {
    greeting: "Hi! I'm Spoody",
    description: "A passionate developer crafting digital experiences with modern web technologies.",
    viewProjects: "View Projects",
    sourceCode: "Source Code",
    legacyVersion: "Legacy Version",
  },
  es: {
    greeting: "¡Hola! Soy Spoody",
    description: "Un desarrollador apasionado creando experiencias digitales con tecnologías web modernas.",
    viewProjects: "Ver Proyectos",
    sourceCode: "Código Fuente",
    legacyVersion: "Versión Anterior",
  },
  fr: {
    greeting: "Bonjour ! Je suis Spoody",
    description: "Un développeur passionné créant des expériences numériques avec des technologies web modernes.",
    viewProjects: "Voir les Projets",
    sourceCode: "Code Source",
    legacyVersion: "Version Précédente",
  },
  it: {
    greeting: "Ciao! Sono Spoody",
    description: "Uno sviluppatore appassionato che crea esperienze digitali con tecnologie web moderne.",
    viewProjects: "Visualizza Progetti",
    sourceCode: "Codice Sorgente",
    legacyVersion: "Versione Precedente",
  },
  ja: {
    greeting: "こんにちは！Spoodyです",
    description: "最新のWeb技術でデジタル体験を作り出す情熱的な開発者です。",
    viewProjects: "プロジェクトを見る",
    sourceCode: "ソースコード",
    legacyVersion: "旧バージョン",
  },
  de: {
    greeting: "Hallo! Ich bin Spoody",
    description: "Ein leidenschaftlicher Entwickler, der digitale Erlebnisse mit modernen Webtechnologien gestaltet.",
    viewProjects: "Projekte ansehen",
    sourceCode: "Quellcode",
    legacyVersion: "Alte Version",
  },
  ru: {
    greeting: "Привет! Я Spoody",
    description: "Увлеченный разработчик, создающий цифровые впечатления с помощью современных веб-технологий.",
    viewProjects: "Посмотреть проекты",
    sourceCode: "Исходный код",
    legacyVersion: "Предыдущая версия",
  },
  zh: {
    greeting: "你好！我是Spoody",
    description: "一位热情的开发者，使用现代网络技术打造数字体验。",
    viewProjects: "查看项目",
    sourceCode: "源代码",
    legacyVersion: "旧版本",
  },
  pt: {
    greeting: "Olá! Eu sou Spoody",
    description: "Um desenvolvedor apaixonado criando experiências digitais com tecnologias web modernas.",
    viewProjects: "Ver Projetos",
    sourceCode: "Código Fonte",
    legacyVersion: "Versão Anterior",
  },
  tr: {
    greeting: "Merhaba! Ben Spoody",
    description: "Modern web teknolojileriyle dijital deneyimler oluşturan tutkulu bir geliştirici.",
    viewProjects: "Projeleri Görüntüle",
    sourceCode: "Kaynak Kodu",
    legacyVersion: "Eski Sürüm",
  },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations['en']) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: keyof Translations['en']) => translations[language][key];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};