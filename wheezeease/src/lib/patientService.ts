import { supabase } from './supabase';
import type { Patient, Medication } from '../types/patient.types';

const AVATAR_COLORS = [
  { bg: '#FEE2E2', color: '#991B1B' },
  { bg: '#EFF6FF', color: '#1E40AF' },
  { bg: '#F0FDF4', color: '#166534' },
  { bg: '#FEF3C7', color: '#92400E' },
  { bg: '#F5F3FF', color: '#5B21B6' },
  { bg: '#FDF2F8', color: '#9D174D' },
];

function riskToStatus(risk: string): 'critical' | 'watch' | 'stable' {
  if (risk === 'HIGH') return 'critical';
  if (risk === 'MEDIUM') return 'watch';
  return 'stable';
}

function initials(name: string): string {
  return name.split(' ').map(w => w[0] ?? '').slice(0, 2).join('').toUpperCase();
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(diff / 86_400_000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

function parseMedications(raw: string): Medication[] {
  if (!raw) return [];
  return raw.split(',').map(m => m.trim()).filter(Boolean).map(name => ({
    name,
    dose: name.toLowerCase().includes('inhaler') ? '100mcg' : '10mg',
    freq: name.toLowerCase().includes('rescue') ? 'As needed' : 'Daily',
  }));
}

function symptomsFromLog(log: Record<string, unknown>) {
  const map: Record<string, { name: string; icon: string }> = {
    wheezing: { name: 'Wheezing', icon: '🌬️' },
    coughing: { name: 'Coughing', icon: '😮' },
    chest_tightness: { name: 'Chest Tightness', icon: '💢' },
    breathing_difficulty: { name: 'Breathing Difficulty', icon: '😮‍💨' },
    inhaler_usage: { name: 'Inhaler Used', icon: '💨' },
  };
  return Object.entries(map)
    .filter(([key]) => { const v = log[key]; return v === true || v === 1; })
    .map(([, meta]) => ({
      name: meta.name,
      severity: Math.floor(Math.random() * 30) + 55,
      time: timeAgo(log.created_at as string),
      icon: meta.icon,
    }));
}

export interface PatientAlert {
  id: string;
  type: 'ai' | 'emergency' | 'warning' | 'system';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  timestamp: string;
  patientName?: string;
  patientId?: string;
  patientLocation?: string;
  actionRequired: boolean;
  read: boolean;
  aiNote?: string;
}

// ── Helper: get doctor's patient IDs (or all if not logged in) ──
async function getPatientScope(): Promise<string[] | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null; // null = fetch all patients

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id')
    .eq('onboarding_completed', true)
    .eq('doctor_id', user.id);

  return profiles?.map(p => p.id) ?? [];
}

export async function fetchPatients(): Promise<Patient[]> {
  let query = supabase
    .from('profiles')
    .select('id, full_name, age, gender, conditions, medications, allergies, activity_level, city, country')
    .eq('onboarding_completed', true);

  // Filter by doctor if logged in
  const { data: { user } } = await supabase.auth.getUser();
  if (user) query = query.eq('doctor_id', user.id);

  const { data: profiles, error: pErr } = await query;
  if (pErr || !profiles?.length) return [];

  const userIds = profiles.map(p => p.id);
  const { data: logs } = await supabase
    .from('prediction_logs')
    .select('user_id, risk_level, main_message, advice, reasons, wheezing, coughing, chest_tightness, breathing_difficulty, inhaler_usage, high_probability, created_at')
    .in('user_id', userIds)
    .order('created_at', { ascending: false });

  const latestLog: Record<string, Record<string, unknown>> = {};
  for (const log of logs ?? []) {
    if (!latestLog[log.user_id]) latestLog[log.user_id] = log;
  }

  return profiles.map((p, i) => {
    const log = latestLog[p.id] ?? null;
    const riskLevel = (log?.risk_level as string) ?? 'LOW';
    const riskScore = riskLevel === 'HIGH' ? 75 : riskLevel === 'MEDIUM' ? 45 : 18;
    const av = AVATAR_COLORS[i % AVATAR_COLORS.length];
    const reasons = (log?.reasons as string[]) ?? [];

    return {
      id: p.id.slice(0, 8).toUpperCase(),
      supabaseId: p.id,
      name: p.full_name ?? 'Unknown',
      age: p.age ?? 0,
      gender: p.gender === 'male' ? 'Male' : p.gender === 'female' ? 'Female' : p.gender ?? '—',
      blood: '—',
      condition: p.conditions ?? 'Asthma',
      status: riskToStatus(riskLevel),
      lastActive: log ? timeAgo(log.created_at as string) : 'No data',
      phone: '—',
      email: '—',
      city: p.city ?? '—',
      initials: initials(p.full_name ?? '?'),
      avatarBg: av.bg,
      avatarColor: av.color,
      allergies: p.allergies ? p.allergies.split(',').map((s: string) => s.trim()) : [],
      triggers: [],
      vitals: { spo2: '97%', peakFlow: '380 L/min', heartRate: '78 bpm', temp: '36.8°C' },
      risk: {
        level: riskLevel === 'HIGH' ? 'High' : riskLevel === 'MEDIUM' ? 'Medium' : 'Low',
        score: riskScore,
        factors: reasons.slice(0, 3),
      },
      symptoms: log ? symptomsFromLog(log) : [],
      medications: parseMedications(p.medications ?? ''),
      ai: log ? [{
        type: riskLevel === 'HIGH' ? 'warn' : riskLevel === 'MEDIUM' ? 'info' : 'ok',
        icon: riskLevel === 'HIGH' ? '⚠️' : riskLevel === 'MEDIUM' ? 'ℹ️' : '✅',
        title: riskLevel === 'HIGH' ? 'Immediate Review Recommended'
          : riskLevel === 'MEDIUM' ? 'Monitor Closely' : 'Patient Stable',
        desc: (log.advice as string) ?? (log.main_message as string) ?? '',
        conf: Math.round(((log.high_probability as number ?? 0.5)) * 100),
      }] : [],
      history: [],
    } satisfies Patient;
  });
}

export interface ActivityLogItem {
  type: string;
  risk_level: string;
  data: Record<string, unknown>;
  created_at: string;
}

function formatActivityLog(log: ActivityLogItem): { text: string; note?: string; time: string } {
  const d = log.data;
  const time = timeAgo(log.created_at);

  switch (log.type) {
    case 'checkin': {
      const symptoms = (d.symptoms as string[] | null)?.join(', ') || 'No symptoms';
      const severity = (d.severity as string) || '';
      const note = (d.notes as string) || undefined;
      const moodLabels = ['Great', 'Good', 'Okay', 'Poor', 'Bad'];
      const mood = typeof d.mood === 'number' ? moodLabels[d.mood] ?? '' : '';
      const text = `Check-in: ${symptoms}${severity && severity !== 'None' ? ` (${severity})` : ''}${mood ? ` · Mood: ${mood}` : ''}`;
      return { text, note, time };
    }
    case 'exercise': {
      const type = (d.exercise_type as string) ?? 'Exercise';
      const duration = d.duration ? `${d.duration}min` : '';
      const intensity = (d.intensity as string) ?? '';
      const location = d.indoor ? 'Indoor' : 'Outdoor';
      const note = (d.symptom_notes as string) || undefined;
      return { text: `Exercise: ${type} · ${duration} · ${intensity} (${location})`, note, time };
    }
    case 'household': {
      const type = (d.activity_type as string) ?? 'Activity';
      const duration = d.duration ? `${d.duration}min` : '';
      const mask = d.wore_mask ? 'Mask worn' : 'No mask';
      const note = (d.symptom_notes as string) || undefined;
      return { text: `Household: ${type} · ${duration} · ${mask}`, note, time };
    }
    case 'trip': {
      const dest = (d.destination as string) ?? 'Unknown';
      return { text: `Trip Risk Check: ${dest} (${log.risk_level})`, time };
    }
    default:
      return { text: `Activity logged`, time };
  }
}

export async function fetchActivityLogs(supabaseId: string): Promise<ReturnType<typeof formatActivityLog>[]> {
  const { data, error } = await supabase
    .from('activity_logs')
    .select('type, risk_level, data, created_at')
    .eq('user_id', supabaseId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error || !data) return [];
  return (data as ActivityLogItem[]).map(formatActivityLog);
}

export async function fetchDashboardStats() {
  let profileQuery = supabase
    .from('profiles')
    .select('id')
    .eq('onboarding_completed', true);

  const { data: { user } } = await supabase.auth.getUser();
  if (user) profileQuery = profileQuery.eq('doctor_id', user.id);

  const { data: profiles } = await profileQuery;
  if (!profiles?.length) return { totalPatients: 0, highRisk: 0, moderateRisk: 0, lowRisk: 0 };

  const userIds = profiles.map(p => p.id);
  const { data: logs } = await supabase
    .from('prediction_logs')
    .select('user_id, risk_level, created_at')
    .in('user_id', userIds)
    .order('created_at', { ascending: false });

  const latest: Record<string, string> = {};
  for (const log of logs ?? []) {
    if (!latest[log.user_id]) latest[log.user_id] = log.risk_level;
  }

  const levels = Object.values(latest);
  return {
    totalPatients: profiles.length,
    highRisk: levels.filter(l => l === 'HIGH').length,
    moderateRisk: levels.filter(l => l === 'MEDIUM').length,
    lowRisk: levels.filter(l => l === 'LOW').length,
  };
}

export async function fetchAlerts(): Promise<PatientAlert[]> {
  let profileQuery = supabase
    .from('profiles')
    .select('id, full_name, city')
    .eq('onboarding_completed', true);

  const { data: { user } } = await supabase.auth.getUser();
  if (user) profileQuery = profileQuery.eq('doctor_id', user.id);

  const { data: profiles } = await profileQuery;
  if (!profiles?.length) return [];

  const userIds = profiles.map(p => p.id);
  const profileMap = Object.fromEntries(profiles.map(p => [p.id, p]));

  const { data: logs } = await supabase
    .from('prediction_logs')
    .select('user_id, risk_level, main_message, advice, created_at')
    .in('user_id', userIds)
    .in('risk_level', ['HIGH', 'MEDIUM'])
    .order('created_at', { ascending: false })
    .limit(30);

  return (logs ?? []).map((log, i) => {
    const profile = profileMap[log.user_id];
    const isHigh = log.risk_level === 'HIGH';
    return {
      id: `${log.user_id.slice(0, 8)}-${i}`,
      type: isHigh ? 'emergency' as const : 'warning' as const,
      severity: isHigh ? 'critical' as const : 'high' as const,
      title: isHigh
        ? `High Risk Alert — ${profile?.full_name ?? 'Patient'}`
        : `Moderate Risk — ${profile?.full_name ?? 'Patient'}`,
      message: log.advice ?? log.main_message ?? 'Patient requires attention.',
      timestamp: log.created_at,
      patientName: profile?.full_name ?? 'Unknown',
      patientId: log.user_id.slice(0, 8).toUpperCase(),
      patientLocation: profile?.city ?? '—',
      actionRequired: isHigh,
      read: false,
      aiNote: isHigh ? '⚠️ Immediate Review' : 'ℹ️ Monitor Closely',
    };
  });
}
