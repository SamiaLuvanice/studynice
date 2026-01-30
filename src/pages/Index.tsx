import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import Landing from './Landing';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show landing page for unauthenticated users
  if (!user) {
    return <Landing />;
  }

  // Redirect authenticated users to dashboard
  return <Navigate to="/dashboard" replace />;
};

export default Index;
