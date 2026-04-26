import type { Activity, Alert, BroadcastHistory, Doctor, Patient } from "../types";

// src/data/mockData.ts
export const INIT_DOCTORS: Doctor[] = [
  {id:'D-001',name:'Dr. A. Rahman',  init:'AR',spec:'Pulmonologist',    hosp:'Gujranwala General Hospital', patients:9, response:'4 min', status:'active',  email:'rahman@ggh.health',  phone:'+92-301-1111111',color:'linear-gradient(135deg,#3a8eff,#7c5cfc)',joined:'Jan 15, 2024'},
  {id:'D-002',name:'Dr. Sana Mirza', init:'SM',spec:'Allergist',        hosp:'Allergy & Chest Care Clinic', patients:6, response:'7 min', status:'active',  email:'sana@acc.health',    phone:'+92-302-2222222',color:'linear-gradient(135deg,#e84393,#f5a623)',joined:'Feb 02, 2024'},
  {id:'D-003',name:'Dr. Umar Farooq',init:'UF',spec:'Pulmonologist',    hosp:'Punjab Medical Centre',       patients:8, response:'18 min',status:'active',  email:'umar@pmc.health',    phone:'+92-303-3333333',color:'linear-gradient(135deg,#20b2aa,#3a8eff)',joined:'Jan 28, 2024'},
  {id:'D-004',name:'Dr. Hina Bajwa', init:'HB',spec:'General Physician',hosp:'City Health Clinic',          patients:11,response:'24 min',status:'active',  email:'hina@chc.health',    phone:'+92-304-4444444',color:'linear-gradient(135deg,#f5a623,#e84343)',joined:'Mar 05, 2024'},
  {id:'D-005',name:'Dr. Bilal Ch.',  init:'BC',spec:'Allergist',        hosp:'Premier Allergy Institute',   patients:0, response:'—',    status:'pending', email:'bilal@pai.health',   phone:'+92-305-5555555',color:'linear-gradient(135deg,#7c5cfc,#e843e8)',joined:'Mar 10, 2024'},
  {id:'D-006',name:'Dr. Ayesha T.',  init:'AT',spec:'Pulmonologist',    hosp:'Fatima Memorial Hospital',    patients:0, response:'—',    status:'pending', email:'ayesha@fmh.health',  phone:'+92-306-6666666',color:'linear-gradient(135deg,#22c87a,#3a8eff)',joined:'Mar 11, 2024'},
  {id:'D-007',name:'Dr. Kamran M.',  init:'KM',spec:'General Physician',hosp:'Malik Family Clinic',         patients:7, response:'52 min',status:'active',  email:'kamran@mfc.health',  phone:'+92-307-7777777',color:'linear-gradient(135deg,#ff6b35,#f5a623)',joined:'Dec 10, 2023'},
  {id:'D-008',name:'Dr. Rabia Noor', init:'RN',spec:'Allergist',        hosp:'Gujranwala Allergy Centre',   patients:0, response:'—',    status:'pending', email:'rabia@gac.health',   phone:'+92-308-8888888',color:'linear-gradient(135deg,#e84393,#7c5cfc)',joined:'Mar 12, 2024'},
  {id:'D-009',name:'Dr. Zafar Iqbal',init:'ZI',spec:'Pulmonologist',    hosp:'Iqbal Chest & Lung Clinic',   patients:3, response:'—',    status:'inactive',email:'zafar@icl.health',   phone:'+92-309-9999999',color:'linear-gradient(135deg,#20b2aa,#22c87a)',joined:'Nov 22, 2023'},
];

export const INIT_PATIENTS: Patient[] = [
  {id:'P-041',name:'Sara Ahmed', init:'SA',age:34,gender:'F',cond:'Asthma',          risk:78,doctor:'Dr. A. Rahman',  lastCI:'Today 9:41 AM', color:'#e84393',med:'Salbutamol + Fluticasone',phone:'+92-311-1111111',city:'Gujranwala'},
  {id:'P-012',name:'M. Khan',    init:'MK',age:52,gender:'M',cond:'COPD + Allergy',  risk:71,doctor:'Dr. A. Rahman',  lastCI:'Today 8:30 AM', color:'#e84343',med:'Tiotropium + Montelukast',phone:'+92-312-2222222',city:'Gujranwala'},
  {id:'P-055',name:'Bilal Ch.',  init:'BC',age:31,gender:'M',cond:'Asthma + Allergy',risk:63,doctor:'Dr. Umar Farooq',lastCI:'Today 10:00 AM',color:'#9b43e8',med:'Montelukast + Salbutamol',phone:'+92-313-3333333',city:'Sialkot'},
  {id:'P-027',name:'Fatima Noor',init:'FN',age:28,gender:'F',cond:'Seasonal Allergy',risk:55,doctor:'Dr. Sana Mirza', lastCI:'Today 7:55 AM', color:'#f5a623',med:'Cetirizine + Fluticasone',phone:'+92-314-4444444',city:'Gujranwala'},
  {id:'P-033',name:'Usman Iqbal',init:'UI',age:45,gender:'M',cond:'Asthma',          risk:47,doctor:'Dr. Hina Bajwa', lastCI:'Yesterday',     color:'#3a8eff',med:'Budesonide + Formoterol',phone:'+92-315-5555555',city:'Gujranwala'},
  {id:'P-061',name:'Ayesha Raza',init:'AR',age:24,gender:'F',cond:'Allergy',         risk:38,doctor:'Dr. Hina Bajwa', lastCI:'Today 6:20 AM', color:'#20b2aa',med:'Azelastine nasal spray',phone:'+92-316-6666666',city:'Lahore'},
  {id:'P-019',name:'Zara Butt',  init:'ZB',age:19,gender:'F',cond:'Dust Allergy',    risk:22,doctor:'Dr. Sana Mirza', lastCI:'Today 8:10 AM', color:'#22c87a',med:'Loratadine',phone:'+92-317-7777777',city:'Gujranwala'},
  {id:'P-008',name:'Ali Javed',  init:'AJ',age:61,gender:'M',cond:'Asthma',          risk:14,doctor:'Dr. A. Rahman',  lastCI:'Today 7:00 AM', color:'#22c87a',med:'Salmeterol + Fluticasone',phone:'+92-318-8888888',city:'Gujranwala'},
  {id:'P-015',name:'Hina Malik', init:'HM',age:39,gender:'F',cond:'Allergy',         risk:9, doctor:'Dr. Kamran M.',  lastCI:'Today 9:00 AM', color:'#22c87a',med:'Fexofenadine',phone:'+92-319-9999999',city:'Faisalabad'},
  {id:'P-099',name:'Omar Cheema',init:'OC',age:28,gender:'M',cond:'Asthma',          risk:45,doctor:'—',              lastCI:'2 days ago',    color:'#6b7c93',med:'Not set',phone:'+92-310-0000000',city:'Gujranwala'},
  {id:'P-102',name:'Layla Hassan',init:'LH',age:33,gender:'F',cond:'Allergy',        risk:30,doctor:'—',              lastCI:'3 days ago',    color:'#6b7c93',med:'Not set',phone:'+92-320-1010101',city:'Gujranwala'},
];

export const INIT_ALERTS: Alert[] = [
  {id:1,type:'high',icon:'🆘',msg:'Sara Ahmed triggered SOS — no doctor response in 8 min',patient:'Sara Ahmed',time:'8 min ago',read:false,tag:'sos'},
  {id:2,type:'high',icon:'🚨',msg:'Mohammad Khan risk score reached 78% — unresponded',patient:'Mohammad Khan',time:'22 min ago',read:false,tag:'high'},
  {id:3,type:'high',icon:'⚠️',msg:'Bilal Chaudhry alert unresponded for 35 minutes',patient:'Bilal Chaudhry',time:'35 min ago',read:false,tag:'high'},
  {id:4,type:'mod', icon:'🔔',msg:'Dr. Bilal Ch. submitted registration — pending review',patient:'System',time:'1h ago',read:false,tag:'system'},
  {id:5,type:'mod', icon:'🤖',msg:'Unusual AI prediction spike detected for 3 patients',patient:'AI System',time:'2h ago',read:false,tag:'system'},
  {id:6,type:'low', icon:'✅',msg:'87% of patients completed daily check-in today',patient:'System',time:'3h ago',read:true,tag:'system'},
  {id:7,type:'low', icon:'📊',msg:'Weekly analytics report is ready for download',patient:'System',time:'5h ago',read:true,tag:'system'},
];

export const INIT_ACTIVITY: Activity[] = [
  {icon:'🆘',msg:'SOS triggered by Sara Ahmed',time:'8 min ago'},
  {icon:'🚨',msg:'High risk alert: Mohammad Khan 78%',time:'22 min ago'},
  {icon:'🩺',msg:'Dr. Bilal Ch. submitted registration',time:'1h ago'},
  {icon:'👤',msg:'New patient Omar Cheema registered',time:'2h ago'},
  {icon:'🤖',msg:'AI anomaly flagged for 3 patients',time:'2h ago'},
  {icon:'✅',msg:'87% check-in rate achieved today',time:'3h ago'},
  {icon:'💊',msg:'Medication reminders sent to 42 patients',time:'4h ago'},
  {icon:'📥',msg:'AQI data updated for Gujranwala',time:'5h ago'},
];

export const INIT_BROADCASTS: BroadcastHistory[] = [
  {icon:'⚠️',title:'High AQI Warning',to:'All Doctors',time:'Yesterday 2:00 PM'},
  {icon:'📋',title:'Weekly Check-in Reminder',to:'All Patients',time:'Mon 8:00 AM'},
  {icon:'🔧',title:'System Maintenance Notice',to:'All Doctors',time:'Sun 6:00 PM'},
];