-- ============================================================
-- WheezeEase Patient Seed Script
-- Doctor: celestialveil313@gmail.com
-- Doctor ID: a4d6246e-b697-40eb-9edb-74457765966c
-- ============================================================

-- Step 1: Insert real patient profiles (Khunsha & Arshiq have real auth accounts)
INSERT INTO public.profiles (id, full_name, age, gender, conditions, medications, allergies, activity_level, city, country, onboarding_completed, doctor_id)
VALUES
  ('5cd2dba2-0e4b-4a00-b654-d5228507226e', 'Khunsha Shoab', 22, 'female', 'Asthma, Allergic Rhinitis', 'Salbutamol, Fluticasone', 'Dust, Pollen', 'moderate', 'Lahore', 'Pakistan', true, 'a4d6246e-b697-40eb-9edb-74457765966c'),
  ('b4f9818b-2b4d-4e4a-a67d-01f9ebcae86f', 'Arshiq Shoib', 25, 'male', 'Asthma', 'Salbutamol, Montelukast', 'Cold air, Exercise', 'light', 'Gujrat', 'Pakistan', true, 'a4d6246e-b697-40eb-9edb-74457765966c')
ON CONFLICT (id) DO UPDATE SET
  doctor_id = EXCLUDED.doctor_id,
  onboarding_completed = true,
  full_name = EXCLUDED.full_name;

-- Step 2: Insert 10 synthetic patients into auth.users first (avoids FK violation)
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin)
VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','fatima.malik@patient.wheeze','',NOW(),NOW(),NOW(),'{"provider":"email","providers":["email"]}','{}',false),
  ('aaaaaaaa-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated','hassan.ahmed@patient.wheeze','',NOW(),NOW(),NOW(),'{"provider":"email","providers":["email"]}','{}',false),
  ('aaaaaaaa-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000000','authenticated','authenticated','sara.khan@patient.wheeze','',NOW(),NOW(),NOW(),'{"provider":"email","providers":["email"]}','{}',false),
  ('aaaaaaaa-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000000','authenticated','authenticated','usman.tariq@patient.wheeze','',NOW(),NOW(),NOW(),'{"provider":"email","providers":["email"]}','{}',false),
  ('aaaaaaaa-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000000','authenticated','authenticated','ayesha.noor@patient.wheeze','',NOW(),NOW(),NOW(),'{"provider":"email","providers":["email"]}','{}',false),
  ('aaaaaaaa-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000000','authenticated','authenticated','ali.raza@patient.wheeze','',NOW(),NOW(),NOW(),'{"provider":"email","providers":["email"]}','{}',false),
  ('aaaaaaaa-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000000','authenticated','authenticated','zara.hussain@patient.wheeze','',NOW(),NOW(),NOW(),'{"provider":"email","providers":["email"]}','{}',false),
  ('aaaaaaaa-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000000','authenticated','authenticated','bilal.sheikh@patient.wheeze','',NOW(),NOW(),NOW(),'{"provider":"email","providers":["email"]}','{}',false),
  ('aaaaaaaa-0000-0000-0000-000000000009','00000000-0000-0000-0000-000000000000','authenticated','authenticated','mariam.iqbal@patient.wheeze','',NOW(),NOW(),NOW(),'{"provider":"email","providers":["email"]}','{}',false),
  ('aaaaaaaa-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000000','authenticated','authenticated','imran.butt@patient.wheeze','',NOW(),NOW(),NOW(),'{"provider":"email","providers":["email"]}','{}',false)
ON CONFLICT (id) DO NOTHING;

-- Step 3: Insert 10 synthetic patient profiles
INSERT INTO public.profiles (id, full_name, age, gender, conditions, medications, allergies, activity_level, city, country, onboarding_completed, doctor_id)
VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001','Fatima Malik',28,'female','Asthma, Eczema','Salbutamol, Hydrocortisone','Dust mites, Pet dander','light','Gujrat','Pakistan',true,'a4d6246e-b697-40eb-9edb-74457765966c'),
  ('aaaaaaaa-0000-0000-0000-000000000002','Hassan Ahmed',35,'male','Asthma, Hypertension','Salbutamol, Amlodipine','Smoke, Strong perfumes','moderate','Lahore','Pakistan',true,'a4d6246e-b697-40eb-9edb-74457765966c'),
  ('aaaaaaaa-0000-0000-0000-000000000003','Sara Khan',19,'female','Allergic Asthma','Fluticasone, Cetirizine','Pollen, Mold','high','Islamabad','Pakistan',true,'a4d6246e-b697-40eb-9edb-74457765966c'),
  ('aaaaaaaa-0000-0000-0000-000000000004','Usman Tariq',42,'male','Asthma, COPD','Salbutamol, Tiotropium','Dust, Cold air','sedentary','Rawalpindi','Pakistan',true,'a4d6246e-b697-40eb-9edb-74457765966c'),
  ('aaaaaaaa-0000-0000-0000-000000000005','Ayesha Noor',31,'female','Asthma','Salbutamol, Montelukast','Exercise, Cold air','moderate','Sialkot','Pakistan',true,'a4d6246e-b697-40eb-9edb-74457765966c'),
  ('aaaaaaaa-0000-0000-0000-000000000006','Ali Raza',24,'male','Allergic Rhinitis, Asthma','Salbutamol, Loratadine','Pollen, Animal dander','light','Gujrat','Pakistan',true,'a4d6246e-b697-40eb-9edb-74457765966c'),
  ('aaaaaaaa-0000-0000-0000-000000000007','Zara Hussain',16,'female','Asthma','Fluticasone, Salbutamol','Dust, Strong smells','moderate','Lahore','Pakistan',true,'a4d6246e-b697-40eb-9edb-74457765966c'),
  ('aaaaaaaa-0000-0000-0000-000000000008','Bilal Sheikh',55,'male','Asthma, Diabetes','Salbutamol, Metformin','Cold air, Smoke','sedentary','Karachi','Pakistan',true,'a4d6246e-b697-40eb-9edb-74457765966c'),
  ('aaaaaaaa-0000-0000-0000-000000000009','Mariam Iqbal',38,'female','Asthma, Allergic Rhinitis','Salbutamol, Fluticasone, Cetirizine','Dust mites, Cockroaches','light','Faisalabad','Pakistan',true,'a4d6246e-b697-40eb-9edb-74457765966c'),
  ('aaaaaaaa-0000-0000-0000-000000000010','Imran Butt',29,'male','Exercise-induced Asthma','Salbutamol','Exercise, Cold air','high','Islamabad','Pakistan',true,'a4d6246e-b697-40eb-9edb-74457765966c')
ON CONFLICT (id) DO NOTHING;

-- Step 4: Prediction logs for all 12 patients (2 real + 10 synthetic)
-- wheezing/coughing/chest_tightness/breathing_difficulty/inhaler_usage are integer columns (0 or 1)
INSERT INTO public.prediction_logs (user_id, risk_level, main_message, advice, reasons, wheezing, coughing, chest_tightness, breathing_difficulty, inhaler_usage, high_probability, medium_probability, low_probability, created_at)
VALUES
  -- Khunsha Shoab - HIGH risk
  ('5cd2dba2-0e4b-4a00-b654-d5228507226e','HIGH','Severe asthma symptoms detected. Immediate attention required.','Use rescue inhaler immediately. Contact your doctor if no improvement in 20 minutes.',ARRAY['Wheezing detected','Chest tightness reported','High pollen exposure'],1,1,1,1,1,0.82,0.12,0.06,NOW() - INTERVAL '1 hour'),
  ('5cd2dba2-0e4b-4a00-b654-d5228507226e','MEDIUM','Moderate symptoms. Monitor closely.','Avoid outdoor exposure. Take preventer medication as prescribed.',ARRAY['Coughing episodes','Pollen levels elevated'],0,1,0,0,1,0.38,0.48,0.14,NOW() - INTERVAL '2 days'),
  ('5cd2dba2-0e4b-4a00-b654-d5228507226e','HIGH','Worsening symptoms over past 24 hours.','Increase preventer dose. Avoid triggers.',ARRAY['Increased inhaler use','Sleep disturbance'],1,1,1,0,1,0.78,0.15,0.07,NOW() - INTERVAL '4 days'),

  -- Arshiq Shoib - MEDIUM risk
  ('b4f9818b-2b4d-4e4a-a67d-01f9ebcae86f','MEDIUM','Mild to moderate asthma activity detected.','Reduce outdoor exercise. Monitor peak flow daily.',ARRAY['Exercise-induced symptoms','Cold air exposure'],0,1,1,0,0,0.35,0.52,0.13,NOW() - INTERVAL '3 hours'),
  ('b4f9818b-2b4d-4e4a-a67d-01f9ebcae86f','LOW','Symptoms well controlled today.','Continue current medication regimen.',ARRAY['Good medication adherence'],0,0,0,0,0,0.08,0.22,0.70,NOW() - INTERVAL '3 days'),
  ('b4f9818b-2b4d-4e4a-a67d-01f9ebcae86f','MEDIUM','Moderate risk. Cold front approaching.','Stay indoors during peak cold hours.',ARRAY['Temperature drop detected','Previous cold sensitivity'],0,1,0,1,1,0.41,0.44,0.15,NOW() - INTERVAL '6 days'),

  -- Fatima Malik - HIGH risk
  ('aaaaaaaa-0000-0000-0000-000000000001','HIGH','Critical: Multiple symptoms active simultaneously.','Seek emergency care if inhaler not effective within 15 minutes.',ARRAY['Severe wheezing','Breathing difficulty','AQI 158 in area'],1,1,1,1,1,0.88,0.09,0.03,NOW() - INTERVAL '30 minutes'),
  ('aaaaaaaa-0000-0000-0000-000000000001','HIGH','High risk episode. AQI spiked.','Stay indoors. Use air purifier.',ARRAY['Dust mite exposure','High AQI'],1,0,1,1,1,0.79,0.14,0.07,NOW() - INTERVAL '5 days'),

  -- Hassan Ahmed - MEDIUM risk
  ('aaaaaaaa-0000-0000-0000-000000000002','MEDIUM','Moderate asthma activity with hypertension consideration.','Avoid strenuous activity. Monitor blood pressure alongside peak flow.',ARRAY['Smoke exposure','Stress indicators'],0,1,0,1,0,0.42,0.45,0.13,NOW() - INTERVAL '2 hours'),
  ('aaaaaaaa-0000-0000-0000-000000000002','LOW','Well controlled. Continue monitoring.','Keep up with medication schedule.',ARRAY['Good compliance'],0,0,0,0,0,0.12,0.28,0.60,NOW() - INTERVAL '4 days'),

  -- Sara Khan - LOW risk
  ('aaaaaaaa-0000-0000-0000-000000000003','LOW','Asthma well controlled. No significant symptoms.','Maintain current treatment. Continue daily peak flow diary.',ARRAY['Low pollen count today','Good medication adherence'],0,0,0,0,0,0.09,0.21,0.70,NOW() - INTERVAL '4 hours'),
  ('aaaaaaaa-0000-0000-0000-000000000003','MEDIUM','Pollen count elevated in Islamabad.','Pre-medicate before outdoor activities.',ARRAY['Seasonal pollen spike'],0,1,0,0,0,0.31,0.50,0.19,NOW() - INTERVAL '7 days'),

  -- Usman Tariq - HIGH risk (COPD + Asthma)
  ('aaaaaaaa-0000-0000-0000-000000000004','HIGH','COPD-asthma overlap. High exacerbation risk.','Urgent review recommended. Increase bronchodilator frequency.',ARRAY['COPD overlap syndrome','Dust exposure','Sedentary lifestyle'],1,1,1,1,1,0.85,0.10,0.05,NOW() - INTERVAL '45 minutes'),
  ('aaaaaaaa-0000-0000-0000-000000000004','HIGH','Persistent high-risk status for 3 days.','Consider oral corticosteroids. Contact specialist.',ARRAY['Prolonged exacerbation','Low activity'],1,1,0,1,1,0.77,0.16,0.07,NOW() - INTERVAL '3 days'),

  -- Ayesha Noor - MEDIUM risk
  ('aaaaaaaa-0000-0000-0000-000000000005','MEDIUM','Exercise-related symptoms flagged.','Warm up before exercise. Use inhaler 15 min prior to activity.',ARRAY['Post-exercise coughing','Cold air sensitivity'],0,1,1,0,1,0.40,0.46,0.14,NOW() - INTERVAL '6 hours'),
  ('aaaaaaaa-0000-0000-0000-000000000005','LOW','Good symptom control reported.','Continue preventer medication.',ARRAY['Stable readings'],0,0,0,0,0,0.11,0.29,0.60,NOW() - INTERVAL '5 days'),

  -- Ali Raza - LOW risk
  ('aaaaaaaa-0000-0000-0000-000000000006','LOW','Mild rhinitis. Asthma controlled.','Continue antihistamine. Avoid known allergens.',ARRAY['Mild nasal symptoms only'],0,0,0,0,0,0.14,0.31,0.55,NOW() - INTERVAL '2 hours'),
  ('aaaaaaaa-0000-0000-0000-000000000006','MEDIUM','Pollen spike affecting patient.','Take antihistamine prophylactically.',ARRAY['High pollen count','Outdoor exposure'],0,1,0,0,0,0.33,0.48,0.19,NOW() - INTERVAL '6 days'),

  -- Zara Hussain - HIGH risk (young patient)
  ('aaaaaaaa-0000-0000-0000-000000000007','HIGH','Acute episode in adolescent patient. Urgent attention.','Contact parents/guardian. Administer rescue inhaler. Monitor for 30 minutes.',ARRAY['Acute wheeze onset','School environment triggers','Age risk factor'],1,1,1,1,1,0.83,0.11,0.06,NOW() - INTERVAL '20 minutes'),
  ('aaaaaaaa-0000-0000-0000-000000000007','MEDIUM','Moderate symptoms after school.','Review school action plan. Ensure inhaler available at school.',ARRAY['After-school activity','Classroom dust'],0,1,1,0,1,0.44,0.42,0.14,NOW() - INTERVAL '4 days'),

  -- Bilal Sheikh - MEDIUM risk (elderly)
  ('aaaaaaaa-0000-0000-0000-000000000008','MEDIUM','Asthma-diabetes comorbidity. Moderate risk.','Monitor blood glucose alongside peak flow. Avoid corticosteroid overuse.',ARRAY['Comorbidity risk','Cold air exposure','Sedentary'],0,1,1,0,0,0.39,0.47,0.14,NOW() - INTERVAL '5 hours'),
  ('aaaaaaaa-0000-0000-0000-000000000008','LOW','Stable day. Both conditions controlled.','Continue dual management plan.',ARRAY['Good compliance'],0,0,0,0,0,0.13,0.27,0.60,NOW() - INTERVAL '6 days'),

  -- Mariam Iqbal - HIGH risk
  ('aaaaaaaa-0000-0000-0000-000000000009','HIGH','Severe indoor allergen exposure causing flare-up.','Deep clean home environment. Mattress covers recommended. Immediate bronchodilator use.',ARRAY['Dust mite count high','Cockroach allergen','Indoor air quality poor'],1,1,0,1,1,0.80,0.13,0.07,NOW() - INTERVAL '1 hour'),
  ('aaaaaaaa-0000-0000-0000-000000000009','MEDIUM','Partial improvement after cleaning.','Continue anti-allergen measures.',ARRAY['Improving but not resolved'],0,1,0,0,1,0.37,0.49,0.14,NOW() - INTERVAL '3 days'),

  -- Imran Butt - LOW risk (fit patient)
  ('aaaaaaaa-0000-0000-0000-000000000010','LOW','Exercise-induced asthma well managed today.','Great adherence to pre-exercise inhaler use.',ARRAY['Pre-medicated before exercise','Warm weather helped'],0,0,0,0,0,0.10,0.25,0.65,NOW() - INTERVAL '3 hours'),
  ('aaaaaaaa-0000-0000-0000-000000000010','MEDIUM','Cold morning run triggered mild symptoms.','Avoid early morning runs in cold weather.',ARRAY['Cold air trigger','Outdoor exercise'],0,1,1,0,1,0.36,0.47,0.17,NOW() - INTERVAL '5 days')

ON CONFLICT DO NOTHING;

-- Step 5: Activity logs for Khunsha, Arshiq, and a few synthetic patients
INSERT INTO public.activity_logs (user_id, type, risk_level, data, created_at)
VALUES
  ('5cd2dba2-0e4b-4a00-b654-d5228507226e','checkin','HIGH','{"symptoms":["wheezing","chest_tightness"],"severity":"Severe","mood":3,"notes":"Worse after going outside, AQI was very high today"}',NOW() - INTERVAL '1 hour'),
  ('5cd2dba2-0e4b-4a00-b654-d5228507226e','exercise','MEDIUM','{"exercise_type":"Walking","duration":20,"intensity":"Light","indoor":false,"symptom_notes":"Mild coughing during walk"}',NOW() - INTERVAL '2 days'),
  ('5cd2dba2-0e4b-4a00-b654-d5228507226e','checkin','MEDIUM','{"symptoms":["coughing"],"severity":"Mild","mood":2,"notes":"Coughing in the morning, took inhaler"}',NOW() - INTERVAL '3 days'),

  ('b4f9818b-2b4d-4e4a-a67d-01f9ebcae86f','checkin','MEDIUM','{"symptoms":["coughing","chest_tightness"],"severity":"Moderate","mood":2,"notes":"Chest felt tight after morning run"}',NOW() - INTERVAL '3 hours'),
  ('b4f9818b-2b4d-4e4a-a67d-01f9ebcae86f','trip','LOW','{"destination":"Islamabad","risk_level":"LOW"}',NOW() - INTERVAL '4 days'),
  ('b4f9818b-2b4d-4e4a-a67d-01f9ebcae86f','exercise','LOW','{"exercise_type":"Cycling","duration":30,"intensity":"Moderate","indoor":true,"symptom_notes":"No issues indoors"}',NOW() - INTERVAL '6 days'),

  ('aaaaaaaa-0000-0000-0000-000000000001','checkin','HIGH','{"symptoms":["wheezing","breathing_difficulty","chest_tightness"],"severity":"Severe","mood":4,"notes":"Could not sleep last night due to wheezing"}',NOW() - INTERVAL '30 minutes'),
  ('aaaaaaaa-0000-0000-0000-000000000004','checkin','HIGH','{"symptoms":["wheezing","coughing","breathing_difficulty"],"severity":"Severe","mood":4,"notes":"Very dusty at work today, forgot mask"}',NOW() - INTERVAL '45 minutes'),
  ('aaaaaaaa-0000-0000-0000-000000000007','checkin','HIGH','{"symptoms":["wheezing","chest_tightness"],"severity":"Severe","mood":4,"notes":"Had an episode during PE class"}',NOW() - INTERVAL '20 minutes'),
  ('aaaaaaaa-0000-0000-0000-000000000009','household','HIGH','{"activity_type":"Cleaning","duration":45,"wore_mask":false,"symptom_notes":"Dust from cleaning triggered symptoms badly"}',NOW() - INTERVAL '1 hour')

ON CONFLICT DO NOTHING;

-- Step 6: Grant SELECT permissions on all relevant tables
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT SELECT ON public.prediction_logs TO anon, authenticated;
GRANT SELECT ON public.activity_logs TO anon, authenticated;
GRANT SELECT ON public.doctors TO anon, authenticated;
GRANT SELECT ON public.users TO anon, authenticated;
