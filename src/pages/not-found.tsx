import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="error-screen">
      <AlertCircle size={32} />
      <p className="eyebrow">/ 404</p>
      <h1>Page not found.</h1>
      <p>Did you forget to add the page to the router?</p>
      <a className="button button-primary" href="#hero">Return home</a>
    </main>
  );
}