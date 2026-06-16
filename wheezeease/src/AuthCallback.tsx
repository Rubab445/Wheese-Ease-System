import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) { navigate('/login'); return; }

      const user = session.user;

      // Check if already in doctors table
      const { data: existing } = await supabase
        .from('doctors')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (!existing) {
        const storedName = localStorage.getItem('pendingDoctorName');
        const fullName = storedName
          || user.user_metadata?.full_name
          || user.email
          || 'Doctor';

        await supabase.from('doctors').insert({
          id: user.id,
          full_name: fullName,
          specialty: 'Pulmonology',
        });

        await supabase.from('users').insert({
          id: user.id,
          full_name: fullName,
          email: user.email,
          role: 'doctor',
        });

        localStorage.removeItem('pendingDoctorName');
      }

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'doctor');
      navigate('/dashboard');
    });
  }, [navigate]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 40, height: 40, border: '3px solid #16a34a', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#64748b', fontSize: 14 }}>Completing sign in...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
