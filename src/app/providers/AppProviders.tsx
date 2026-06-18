import { type ReactNode } from 'react';
import { AuthProvider } from '@/shared/contexts/AuthContext';
import { LanguageProvider } from '@/shared/i18n/LanguageContext';
import { LoginPromptModal } from '@/shared/components/LoginPromptModal';
import { Toaster } from '@/shared/ui/sonner';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <LanguageProvider>
      <AuthProvider>
        {children}
        <Toaster />
        <LoginPromptModal />
      </AuthProvider>
    </LanguageProvider>
  );
}
