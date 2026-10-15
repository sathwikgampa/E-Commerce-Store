import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import './styles.css';
import App from './App';

// Programmatically set the tab icon to Lord Venkateshwara Thiruman Namam to invalidate browser favicon cache
try {
  const venkateshwaraFavicon = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64' fill='none'%3E%3Crect width='64' height='64' rx='14' fill='%230A3D91'/%3E%3Crect x='1.5' y='1.5' width='61' height='61' rx='12.5' stroke='%23FF9800' stroke-width='1.5' stroke-opacity='0.45'/%3E%3Cpath d='M22 52.5C22 54 26.5 55.5 32 55.5C37.5 55.5 42 54 42 52.5C42 51 37.5 49.5 32 49.5C26.5 49.5 22 51 22 52.5Z' fill='%23FF9800'/%3E%3Cpath d='M17.5 13C17.5 13 16 35 22.5 47C25.5 49 29.5 50 32 50C28.5 47 24.5 42 24.5 30C24.5 20.5 25.5 13 25.5 13L17.5 13Z' fill='%23FFFFFF' stroke='%2387CEEB' stroke-width='1.2' stroke-linejoin='round'/%3E%3Cpath d='M46.5 13C46.5 13 48 35 41.5 47C38.5 49 34.5 50 32 50C35.5 47 39.5 42 39.5 30C39.5 20.5 38.5 13 38.5 13L46.5 13Z' fill='%23FFFFFF' stroke='%2387CEEB' stroke-width='1.2' stroke-linejoin='round'/%3E%3Cpath d='M29.8 15.5C29.8 15.5 28.8 35.5 29.5 43.5C30.2 46.5 32 48 32 48C32 48 33.8 46.5 34.5 43.5C35.2 35.5 34.2 15.5 34.2 15.5C34.2 15.5 33 13.5 32 13.5C31 13.5 29.8 15.5 29.8 15.5Z' fill='%23FF7A50' stroke='%23D84315' stroke-width='0.8'/%3E%3Ccircle cx='32' cy='10.5' r='2.8' fill='%23FFD54F' stroke='%23E65100' stroke-width='0.8'/%3E%3C/svg%3E`;
  const existingLink = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
  if (existingLink) {
    existingLink.href = venkateshwaraFavicon;
  }
} catch {
  // no-op
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
