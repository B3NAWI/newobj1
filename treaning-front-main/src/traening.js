import React, { useState, useEffect } from 'react';
import Accordion from 'your-accordion-component'; // تأكد من استخدام الاستيراد الصحيح لمكون الأكورديون
import i18n from 'your-i18n-setup'; // تأكد من استخدام الاستيراد الصحيح لمكتبة i18n
import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 320);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 320);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Accordion.Header
      style={{
        fontSize: isMobile ? '14px' : '20px',
        width: isMobile ? '100%' : '99%',
        padding: isMobile ? '5px' : '2px',
      }}
    >
      <span style={{ flexGrow: 1, textAlign: i18n.language === 'ar' ? 'right' : 'left' }}>
        {t('Orders.Payment.Payment')}
      </span>
    </Accordion.Header>
  );
}

export default App;
