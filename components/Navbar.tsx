import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link href={isAuthenticated ? '/tasks' : '/'} className="navbar-brand fw-bold">
          TaskManager
        </Link>
        <div className="ms-auto d-flex align-items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-white opacity-75 small">Hello, <strong>{user?.username}</strong></span>
              <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline-light btn-sm">Login</Link>
              <Link href="/register" className="btn btn-light btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
