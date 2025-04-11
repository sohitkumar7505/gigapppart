import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18n } from 'i18n-js';

const i18n = new I18n({
  en: {
    welcome: 'Welcome',
    earnings: 'Earnings',
    health: 'Health',
    community: 'Community',
    learn: 'Learn',
    safety: 'Safety',
    totalEarnings: 'Total Earnings',
    expenses: 'Expenses',
    netEarnings: 'Net Earnings',
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
  },
  hi: {
    welcome: 'स्वागत है',
    earnings: 'कमाई',
    health: 'स्वास्थ्य',
    community: 'समुदाय',
    learn: 'सीखें',
    safety: 'सुरक्षा',
    totalEarnings: 'कुल कमाई',
    expenses: 'खर्च',
    netEarnings: 'शुद्ध कमाई',
    today: 'आज',
    thisWeek: 'इस सप्ताह',
    thisMonth: 'इस महीने',
  },
  ta: {
    welcome: 'வரவேற்பு',
    earnings: 'வருமானம்',
    health: 'ஆரோக்கியம்',
    community: 'சமூகம்',
    learn: 'கற்றல்',
    safety: 'பாதுகாப்பு',
    totalEarnings: 'மொத்த வருமானம்',
    expenses: 'செலவுகள்',
    netEarnings: 'நிகர வருமானம்',
    today: 'இன்று',
    thisWeek: 'இந்த வாரம்',
    thisMonth: 'இந்த மாதம்',
  },
});

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    loadStoredLanguage();
  }, []);

  const loadStoredLanguage = async () => {
    try {
      const storedLanguage = await AsyncStorage.getItem('userLanguage');
      if (storedLanguage) {
        setLocale(storedLanguage);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const changeLanguage = async (newLocale) => {
    try {
      await AsyncStorage.setItem('userLanguage', newLocale);
      setLocale(newLocale);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const translate = (key) => {
    return i18n.t(key, { locale });
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}