import { supabase } from './supabase';

// ─── DOCTORS ────────────────────────────────────────────────────────────────

export interface DoctorInput {
  full_name: string;
  specialty: string;
  phone?: string;
  hospital?: string;
  experience?: string;
  qualifications?: string;
  pmdc?: string;
  status?: string;
}

export async function addDoctor(data: DoctorInput) {
  const id = crypto.randomUUID();
  const { error } = await supabase.from('doctors').insert({
    id,
    full_name: data.full_name,
    specialty: data.specialty || 'General Physician',
    phone: data.phone ?? null,
    hospital: data.hospital ?? null,
    experience: data.experience ?? null,
    qualifications: data.qualifications ?? null,
    pmdc: data.pmdc ?? null,
    status: data.status ?? 'Active',
  });
  if (error) throw error;
  return id;
}

export async function updateDoctor(id: string, data: Partial<DoctorInput>) {
  const { error } = await supabase.from('doctors').update({
    full_name: data.full_name,
    specialty: data.specialty,
    phone: data.phone,
    hospital: data.hospital,
    experience: data.experience,
    qualifications: data.qualifications,
    pmdc: data.pmdc,
    status: data.status,
  }).eq('id', id);
  if (error) throw error;
}

export async function deleteDoctor(id: string) {
  const { error } = await supabase.from('doctors').delete().eq('id', id);
  if (error) throw error;
}

export async function softDeleteDoctor(id: string) {
  const { error } = await supabase.from('doctors').update({ status: 'Deleted' }).eq('id', id);
  if (error) throw error;
}

// ─── PATIENTS (profiles) ────────────────────────────────────────────────────

export interface PatientInput {
  full_name: string;
  email?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  city?: string;
  condition?: string;
  severity?: string;
  doctor_id?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  status?: string;
}

export async function addPatient(data: PatientInput) {
  const id = crypto.randomUUID();
  const { error } = await supabase.from('profiles').insert({
    id,
    full_name: data.full_name,
    email: data.email ?? null,
    phone: data.phone ?? null,
    dob: data.dob ?? null,
    gender: data.gender ?? null,
    city: data.city ?? null,
    condition: data.condition ?? null,
    severity: data.severity ?? null,
    doctor_id: data.doctor_id ?? null,
    emergency_contact: data.emergency_contact ?? null,
    emergency_phone: data.emergency_phone ?? null,
    status: data.status ?? 'Active',
    onboarding_completed: false,
  });
  if (error) throw error;
  return id;
}

export async function updatePatient(id: string, data: Partial<PatientInput>) {
  const { error } = await supabase.from('profiles').update({
    full_name: data.full_name,
    phone: data.phone,
    dob: data.dob,
    gender: data.gender,
    city: data.city,
    condition: data.condition,
    severity: data.severity,
    doctor_id: data.doctor_id,
    emergency_contact: data.emergency_contact,
    emergency_phone: data.emergency_phone,
    status: data.status,
  }).eq('id', id);
  if (error) throw error;
}

export async function deletePatient(id: string) {
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  if (error) throw error;
}

export async function softDeletePatient(id: string) {
  const { error } = await supabase.from('profiles').update({ status: 'Deleted' }).eq('id', id);
  if (error) throw error;
}

// ─── ADMINS ─────────────────────────────────────────────────────────────────

export async function deleteAdmin(id: string) {
  const { error } = await supabase.from('admins').delete().eq('id', id);
  if (error) throw error;
}

export async function updateAdmin(id: string, data: { full_name?: string; email?: string }) {
  const { error } = await supabase.from('admins').update(data).eq('id', id);
  if (error) throw error;
}
