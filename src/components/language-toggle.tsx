'use client';

import { Button, Space, Typography, message } from 'antd';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const languages = {
  zh: { name: '中文', flag: '🇨🇳' },
  en: { name: 'English', flag: '🇺🇸' },
};

export function LanguageToggle() {
  const { i18n, t } = useTranslation('common');

  const currentLang = i18n.language as keyof typeof languages;
  const nextLang = currentLang === 'zh' ? 'en' : 'zh';

  const handleLanguageToggle = () => {
    i18n.changeLanguage(nextLang);
    message.success(t('language.switched', { lang: languages[nextLang].name }));
  };

  return (
    <Button
      type="text"
      size="large"
      onClick={handleLanguageToggle}
      className="language-toggle"
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 'auto',
        padding: '8px 16px',
        borderRadius: '8px',
        border: '1px solid #d9d9d9',
        background: '#fafafa',
      }}
    >
      <Space align="center">
        <span className="language-flag">{languages[currentLang].flag}</span>
        <Languages size={16} style={{ color: '#1677ff' }} />
        <Text strong style={{ color: '#1677ff' }}>
          {languages[currentLang].name}
        </Text>
      </Space>
    </Button>
  );
}
