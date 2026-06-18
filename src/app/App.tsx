import { BrowserRouter, useLocation } from 'react-router';
import { useLayoutEffect } from 'react';
import { AppProviders } from '@/app/providers/AppProviders';
import { PublicLayout } from '@/app/layouts/PublicLayout';

function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <ScrollToTop />
        <PublicLayout />
      </AppProviders>
    </BrowserRouter>
  );
}
