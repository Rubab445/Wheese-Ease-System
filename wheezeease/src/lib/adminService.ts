import { supabase } from './supabase';
import type { AppUser } from '../AdminDashboard/Pages/UserManagement';

function av(name: string) {
  return name.split(' ').map(w => w[0] ?? '').slice(0, 2).join('').toUpperCase();
}

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(diff / 86_400_000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

export interface RawAdminAlert {
  id: number;
  title: string;
  subtitle: string;
  time: string;
  severity: 'critical' | 'high' | 'medium';
  detail: string;
  patientName?: string;
  actions: string[];
}

export async function fetchAdminAlerts(): Promise<RawAdminAlert[]> {
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, city')
    .eq('onboarding_completed', true);

  if (!profiles?.length) return [];

  const profileMap = Object.fromEntries(profiles.map(p => [p.id, p]));
  const userIds = profiles.map(p => p.id);

  const { data: logs } = await supabase
    .from('prediction_logs')
    .select('user_id, risk_level, main_message, advice, created_at')
    .in('user_id', userIds)
    .in('risk_level', ['HIGH', 'MEDIUM'])
    .order('created_at', { ascending: false })
    .limit(8);

  return (logs ?? []).map((log, i) => {
    const profile = profileMap[log.user_id];
    const isHigh = log.risk_level === 'HIGH';
    const msg = (log.advice ?? log.main_message ?? 'Patient requires attention');
    return {
      id: i + 1,
      title: `${profile?.full_name ?? 'Patient'} — ${isHigh ? 'High Risk Alert' : 'Moderate Risk'}`,
      subtitle: msg.length > 80 ? msg.slice(0, 80) + '…' : msg,
      time: timeAgo(log.created_at),
      severity: isHigh ? 'critical' as const : 'medium' as const,
      detail: msg,
      patientName: profile?.full_name,
      actions: isHigh
        ? ['Notify Assigned Doctor', 'Send Alert to Patient', 'Log Emergency Event']
        : ['Schedule Follow-up', 'Send Reminder', 'Monitor Closely'],
    };
  });
}

export interface ActivityChartData {
  labels: string[];
  newPatients: number[];
  flareups: number[];
  recovered: number[];
}

export async function fetchAdminActivityChart(range: '7d' | '30d' | '90d'): Promise<ActivityChartData> {
  const now = new Date();
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const { data: logs } = await supabase
    .from('prediction_logs')
    .select('risk_level, created_at')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true });

  if (!logs?.length) {
    if (range === '7d') return { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], newPatients: Array(7).fill(0), flareups: Array(7).fill(0), recovered: Array(7).fill(0) };
    if (range === '30d') return { labels: ['Week 1','Week 2','Week 3','Week 4'], newPatients: Array(4).fill(0), flareups: Array(4).fill(0), recovered: Array(4).fill(0) };
    return { labels: [], newPatients: [], flareups: [], recovered: [] };
  }

  if (range === '7d') {
    const labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const total = Array(7).fill(0), high = Array(7).fill(0), low = Array(7).fill(0);
    for (const log of logs) {
      const idx = (new Date(log.created_at).getDay() + 6) % 7;
      total[idx]++;
      if (log.risk_level === 'HIGH') high[idx]++;
      if (log.risk_level === 'LOW') low[idx]++;
    }
    return { labels, newPatients: total, flareups: high, recovered: low };
  }

  if (range === '30d') {
    const labels = ['Week 1','Week 2','Week 3','Week 4'];
    const total = [0,0,0,0], high = [0,0,0,0], low = [0,0,0,0];
    for (const log of logs) {
      const diffDays = Math.floor((now.getTime() - new Date(log.created_at).getTime()) / 86400000);
      const idx = Math.min(3, 3 - Math.floor(diffDays / 7));
      total[idx]++; if (log.risk_level === 'HIGH') high[idx]++; if (log.risk_level === 'LOW') low[idx]++;
    }
    return { labels, newPatients: total, flareups: high, recovered: low };
  }

  const monthMap: Record<string, { total: number; high: number; low: number }> = {};
  const monthOrder: string[] = [];
  for (const log of logs) {
    const key = new Date(log.created_at).toLocaleDateString('en-US', { month: 'short' });
    if (!monthMap[key]) { monthMap[key] = { total: 0, high: 0, low: 0 }; monthOrder.push(key); }
    monthMap[key].total++; if (log.risk_level === 'HIGH') monthMap[key].high++; if (log.risk_level === 'LOW') monthMap[key].low++;
  }
  const uniqueMonths = [...new Set(monthOrder)];
  return { labels: uniqueMonths, newPatients: uniqueMonths.map(m => monthMap[m].total), flareups: uniqueMonths.map(m => monthMap[m].high), recovered: uniqueMonths.map(m => monthMap[m].low) };
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
    { data: usersData },
  ] = await Promise.all([
    supabase.from('profiles').select('id, full_name, age, gender, conditions, city, created_at, doctor_id').eq('onboarding_completed', true),
    supabase.from('doctors').select('id, full_name, specialty, hospital, created_at'),
    supabase.from('prediction_logs').select('user_id, risk_level, created_at').order('created_at', { ascending: false }),
    supabase.from('users').select('id, email'),
  ]);

  const emailMap: Record<string, string> = {};
  for (const u of usersData ?? []) emailMap[u.id] = u.email ?? '—';

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
    email: emailMap[p.id] ?? '—',
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
    email: emailMap[d.id] ?? '—',
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
