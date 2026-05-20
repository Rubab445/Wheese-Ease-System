import { supabase } from './supabase';
import type { AppUser } from '../AdminDashboard/Pages/UserManagement';

function av(name: string) {
  return name.split(' ').map(w => w[0] ?? '').slice(0, 2).join('').toUpperCase();
}

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export async function fetchAdminStats() {
  const [
    { count: patientCount },
    { count: doctorCount },
    { data: logs },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('onboarding_completed', true),
    supabase.from('doctors').select('*', { count: 'exact', head: true }),
    supabase.from('prediction_logs').select('user_id, risk_level, created_at').order('created_at', { ascending: false }),
  ]);

  const latest: Record<string, string> = {};
  for (const log of logs ?? []) {
    if (!latest[log.user_id]) latest[log.user_id] = log.risk_level;
  }
  const levels = Object.values(latest);

  return {
    totalPatients: patientCount ?? 0,
    totalDoctors: doctorCount ?? 0,
    highRisk: levels.filter(l => l === 'HIGH').length,
    moderateRisk: levels.filter(l => l === 'MEDIUM').length,
    lowRisk: levels.filter(l => l === 'LOW').length,
    totalPredictions: logs?.length ?? 0,
  };
}

export async function fetchAdminUsers(): Promise<AppUser[]> {
  const [
    { data: profiles },
    { data: doctors },
    { data: logs },
  ] = await Promise.all([
    supabase.from('profiles').select('id, full_name, age, gender, conditions, city, created_at, doctor_id').eq('onboarding_completed', true),
    supabase.from('doctors').select('id, full_name, specialty, hospital, created_at'),
    supabase.from('prediction_logs').select('user_id, risk_level, created_at').order('created_at', { ascending: false }),
  ]);

  // Latest risk per patient
  const latestRisk: Record<string, string> = {};
  const lastSeen: Record<string, string> = {};
  for (const log of logs ?? []) {
    if (!latestRisk[log.user_id]) {
      latestRisk[log.user_id] = log.risk_level;
      lastSeen[log.user_id] = log.created_at;
    }
  }

  // Doctor id → name map
  const doctorNameMap: Record<string, string> = {};
  for (const d of doctors ?? []) doctorNameMap[d.id] = d.full_name;

  const patientUsers: AppUser[] = (profiles ?? []).map(p => ({
    id: p.id.slice(0, 8).toUpperCase(),
    name: p.full_name ?? 'Unknown',
    email: '—',
    phone: '—',
    role: 'Patient' as const,
    status: 'Active' as const,
    dateJoined: fmt(p.created_at),
    lastLogin: lastSeen[p.id] ? fmt(lastSeen[p.id]) : 'No activity',
    avatar: av(p.full_name ?? '?'),
    condition: (p.conditions ?? '').toLowerCase().includes('asthma') ? 'Asthma' : 'Allergy',
    riskLevel: latestRisk[p.id] === 'HIGH' ? 'High' : latestRisk[p.id] === 'MEDIUM' ? 'Medium' : 'Low',
    city: p.city ?? '—',
    gender: p.gender ?? '—',
    assignedDoctor: p.doctor_id ? (doctorNameMap[p.doctor_id] ?? '—') : '—',
  }));

  const doctorUsers: AppUser[] = (doctors ?? []).map(d => ({
    id: d.id.slice(0, 8).toUpperCase(),
    name: d.full_name,
    email: '—',
    phone: '—',
    role: 'Doctor' as const,
    status: 'Active' as const,
    dateJoined: fmt(d.created_at),
    lastLogin: '—',
    avatar: av(d.full_name),
    specialization: d.specialty ?? 'Pulmonology',
    hospital: d.hospital ?? '—',
    verified: true,
    patientsAssigned: (profiles ?? []).filter(p => p.doctor_id === d.id).length,
  }));

  return [...doctorUsers, ...patientUsers];
}
