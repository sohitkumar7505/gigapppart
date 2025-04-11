import { Slot } from 'expo-router';
import { LanguageProvider } from './context/LanguageContext';

export default function RootLayout() {
  return (
    <LanguageProvider>
      <Slot />
    </LanguageProvider>
  );
}