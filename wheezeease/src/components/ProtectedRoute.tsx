import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Props {
  children: React.ReactNode;
  requiredRole: 'admin' | 'doctor';
}

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const [status, setStatus] = useState<'checking' | 'allowed' | 'denied'>('checking');

  useEffect(() => {
    const check = async () => {
      // Validate live Supabase session for both roles
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        setStatus('denied');
        return;
      }

      const userId = session.user.id;

      if (requiredRole === 'admin') {
        const { data } = await supabase
          .from('admins')
          .select('id')
          .eq('id', userId)
          .maybeSingle();

        if (!data) {
          await supabase.auth.signOut();
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('userRole');
          setStatus('denied');
          return;
        }

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', 'admin');
        setStatus('allowed');
        return;
      }

      if (requiredRole === 'doctor') {
        const { data } = await supabase
          .from('doctors')
          .select('id')
          .eq('id', userId)
          .maybeSingle();

        if (!data) {
          await supabase.auth.signOut();
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('userRole');
          setStatus('denied');
          return;
        }

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', 'doctor');
        setStatus('allowed');
        return;
      }

      setStatus('denied');
    };

    check();
  }, [requiredRole]);

  if (status === 'checking') {
    return (
      <div style={{
        display: 'flex', height: '100vh',
        alignItems: 'center', justifyContent: 'center',
        fontSize: 14, color: '#64748B', fontFamily: 'Inter, sans-serif',
      }}>
        Verifying session…
      </div>
    );
  }

  if (status === 'denied') return <Navigate to="/login" replace />;
  return <>{children}</>;
}
