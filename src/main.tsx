import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';
import { SmoothScrollProvider } from '@/components/SmoothScrollProvider';
import './index.css';

createRoot(document.getElementById('root')!, {
  onCaughtError: (error, errorInfo) => {
    console.error(error, errorInfo.componentStack);
  },
}).render(
  <ErrorBoundary>
    <SmoothScrollProvider>
      <App />
    </SmoothScrollProvider>
  </ErrorBoundary>,
);