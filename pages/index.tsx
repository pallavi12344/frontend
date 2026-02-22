import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    router.replace(isAuthenticated ? '/tasks' : '/login');
  }, [isAuthenticated, router]);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="spinner-border text-primary" />
    </div>
  );
}
