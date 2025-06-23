import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

// 动态导入语言资源
const loadResources = (language: string, namespace: string) =>
  import(`./locales/${language}/${namespace}.json`);

i18n
  // 检测用户语言
  .use(LanguageDetector)
  // 动态加载资源
  .use(
    resourcesToBackend((language: string, namespace: string) =>
      loadResources(language, namespace),
    ),
  )
  // 传递给react-i18next
  .use(initReactI18next)
  // 初始化i18next
  .init({
    // 调试模式
    debug: process.env.NODE_ENV === 'development',

    // 默认语言
    lng: 'en',
    fallbackLng: 'en',

    // 支持的语言
    supportedLngs: ['en', 'zh'],

    // 命名空间
    defaultNS: 'common',
    ns: [
      'common',
      'auth',
      'dashboard',
      'users',
      'profile',
      'permissions',
      'theme',
    ],

    // 语言检测配置
    detection: {
      // 检测顺序
      order: ['localStorage', 'navigator', 'htmlTag'],
      // 缓存用户语言
      caches: ['localStorage'],
      // localStorage键名
      lookupLocalStorage: 'i18nextLng',
    },

    // 插值配置
    interpolation: {
      escapeValue: false, // React已经转义了
    },

    // 资源加载配置
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    // React配置
    react: {
      useSuspense: false, // 禁用Suspense以避免SSR问题
    },

    // 加载失败时的回退
    saveMissing: process.env.NODE_ENV === 'development',
    missingKeyHandler: (lng, ns, key) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: ${key} in ${lng}/${ns}`);
      }
    },
  });

export default i18n;
