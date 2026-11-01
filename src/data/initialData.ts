import { Patient, Doctor, Appointment, MedicalRecord } from '../types';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'PID-1001',
    name: 'Aarav Sharma',
    age: 34,
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+91 98765 43210',
    email: 'aarav.sharma@example.com',
    address: '14/B, Lotus Boulevard, Green Glen Layout, Bengaluru',
    emergencyContact: '+91 98765 11111 (Wife)',
    allergies: 'Penicillin',
    registeredDate: '2026-10-15',
    status: 'Outpatient'
  },
  {
    id: 'PID-1002',
    name: 'Priya Iyer',
    age: 28,
    gender: 'Female',
    bloodGroup: 'B+',
    phone: '+91 98234 56789',
    email: 'priya.iyer@example.com',
    address: 'Flat 402, Skyline Residency, Adyar, Chennai',
    emergencyContact: '+91 98234 99999 (Father)',
    allergies: 'None',
    registeredDate: '2026-10-18',
    status: 'Outpatient'
  },
  {
    id: 'PID-1003',
    name: 'Rajesh Verma',
    age: 52,
    gender: 'Male',
    bloodGroup: 'A+',
    phone: '+91 97112 34567',
    email: 'rajesh.verma@example.com',
    address: 'Plot 88, Sector 14, Rohini, New Delhi',
    emergencyContact: '+91 97112 88888 (Son)',
    allergies: 'Sulfa Drugs',
    registeredDate: '2026-10-22',
    status: 'Inpatient'
  },
  {
    id: 'PID-1004',
    name: 'Ananya Deshmukh',
    age: 7,
    gender: 'Female',
    bloodGroup: 'AB+',
    phone: '+91 99887 76655',
    email: 'deshmukh.parent@example.com',
    address: '32-C, Model Colony, Shivajinagar, Pune',
    emergencyContact: '+91 99887 76655 (Mother)',
    allergies: 'Peanuts',
    registeredDate: '2026-10-25',
    status: 'Outpatient'
  },
  {
    id: 'PID-1005',
    name: 'Vikram Malhotra',
    age: 63,
    gender: 'Male',
    bloodGroup: 'O-',
    phone: '+91 96543 21098',
    email: 'vikram.malhotra@example.com',
    address: '77, Lake View Enclave, Banjara Hills, Hyderabad',
    emergencyContact: '+91 96543 44444 (Daughter)',
    allergies: 'Aspirin',
    registeredDate: '2026-10-28',
    status: 'Outpatient'
  },
  {
    id: 'PID-1006',
    name: 'Meera Nair',
    age: 41,
    gender: 'Female',
    bloodGroup: 'A-',
    phone: '+91 94471 23456',
    email: 'meera.nair@example.com',
    address: 'TC 12/450, Kowdiar Gardens, Thiruvananthapuram',
    emergencyContact: '+91 94471 77777 (Husband)',
    allergies: 'None',
    registeredDate: '2026-10-29',
    status: 'Discharged'
  }
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'DOC-201',
    name: 'Dr. Suresh K. Rao',
    department: 'Cardiology',
    specialization: 'Interventional Cardiologist',
    qualification: 'MBBS, MD (Gen Med), DM (Cardiology)',
    experienceYears: 16,
    opdTimings: '09:00 AM - 01:00 PM',
    roomNo: 'OPD-101',
    phone: '+91 98450 12345',
    email: 'dr.suresh@medicare.org',
    status: 'On Duty',
    consultationFee: 700
  },
  {
    id: 'DOC-202',
    name: 'Dr. Sunita Sen',
    department: 'Pediatrics',
    specialization: 'Child & Adolescent Care',
    qualification: 'MBBS, DCH, MD (Pediatrics)',
    experienceYears: 11,
    opdTimings: '10:00 AM - 02:00 PM',
    roomNo: 'OPD-104',
    phone: '+91 98450 67890',
    email: 'dr.sunita@medicare.org',
    status: 'Available',
    consultationFee: 500
  },
  {
    id: 'DOC-203',
    name: 'Dr. Amitav Banerjee',
    department: 'General Medicine',
    specialization: 'Internal Medicine & Diabetology',
    qualification: 'MBBS, MD (Internal Medicine)',
    experienceYears: 14,
    opdTimings: '08:30 AM - 12:30 PM',
    roomNo: 'OPD-102',
    phone: '+91 98450 33445',
    email: 'dr.amitav@medicare.org',
    status: 'On Duty',
    consultationFee: 500
  },
  {
    id: 'DOC-204',
    name: 'Dr. Kavita Radhakrishnan',
    department: 'Orthopedics',
    specialization: 'Joint Replacement & Spine',
    qualification: 'MBBS, MS (Ortho), DNB, M.Ch (UK)',
    experienceYears: 18,
    opdTimings: '02:00 PM - 06:00 PM',
    roomNo: 'OPD-205',
    phone: '+91 98450 55667',
    email: 'dr.kavita@medicare.org',
    status: 'Available',
    consultationFee: 800
  },
  {
    id: 'DOC-205',
    name: 'Dr. Farhan Qureshi',
    department: 'Neurology',
    specialization: 'Clinical Neurologist & Stroke Specialist',
    qualification: 'MBBS, MD, DM (Neurology)',
    experienceYears: 12,
    opdTimings: '11:00 AM - 03:00 PM',
    roomNo: 'OPD-208',
    phone: '+91 98450 88990',
    email: 'dr.farhan@medicare.org',
    status: 'Available',
    consultationFee: 750
  },
  {
    id: 'DOC-206',
    name: 'Dr. Pooja Hegde',
    department: 'Dermatology',
    specialization: 'Clinical Dermatology & Cosmetology',
    qualification: 'MBBS, MD (DVL)',
    experienceYears: 9,
    opdTimings: '03:30 PM - 07:30 PM',
    roomNo: 'OPD-109',
    phone: '+91 98450 44556',
    email: 'dr.pooja@medicare.org',
    status: 'Available',
    consultationFee: 600
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-301',
    tokenNo: 'TK-01',
    patientId: 'PID-1001',
    patientName: 'Aarav Sharma',
    doctorId: 'DOC-201',
    doctorName: 'Dr. Suresh K. Rao',
    department: 'Cardiology',
    appointmentDate: '2026-10-31',
    timeSlot: '09:30 AM',
    status: 'In-Consultation',
    symptoms: 'Mild chest tightness upon exertion, occasional palpitations',
    notes: 'Prior ECG showed normal sinus rhythm with mild tachycardia.',
    createdAt: '2026-10-30 18:20'
  },
  {
    id: 'APT-302',
    tokenNo: 'TK-02',
    patientId: 'PID-1002',
    patientName: 'Priya Iyer',
    doctorId: 'DOC-203',
    doctorName: 'Dr. Amitav Banerjee',
    department: 'General Medicine',
    appointmentDate: '2026-10-31',
    timeSlot: '10:15 AM',
    status: 'Scheduled',
    symptoms: 'High-grade fever for 3 days with body ache and sore throat',
    notes: 'Fast-track OPD queue; check CBC for viral infection.',
    createdAt: '2026-10-31 08:10'
  },
  {
    id: 'APT-303',
    tokenNo: 'TK-03',
    patientId: 'PID-1004',
    patientName: 'Ananya Deshmukh',
    doctorId: 'DOC-202',
    doctorName: 'Dr. Sunita Sen',
    department: 'Pediatrics',
    appointmentDate: '2026-10-31',
    timeSlot: '11:00 AM',
    status: 'Scheduled',
    symptoms: 'Persistent dry cough, ear pain, loss of appetite',
    notes: 'Pediatric follow-up after allergic bronchitis.',
    createdAt: '2026-10-30 20:05'
  },
  {
    id: 'APT-304',
    tokenNo: 'TK-04',
    patientId: 'PID-1005',
    patientName: 'Vikram Malhotra',
    doctorId: 'DOC-201',
    doctorName: 'Dr. Suresh K. Rao',
    department: 'Cardiology',
    appointmentDate: '2026-10-31',
    timeSlot: '11:45 AM',
    status: 'Scheduled',
    symptoms: 'Monthly hypertension review and lipid medication refill',
    notes: 'Bring previous blood sugar and lipid profile lab sheets.',
    createdAt: '2026-10-29 14:15'
  },
  {
    id: 'APT-305',
    tokenNo: 'TK-05',
    patientId: 'PID-1003',
    patientName: 'Rajesh Verma',
    doctorId: 'DOC-204',
    doctorName: 'Dr. Kavita Radhakrishnan',
    department: 'Orthopedics',
    appointmentDate: '2026-10-31',
    timeSlot: '03:00 PM',
    status: 'Scheduled',
    symptoms: 'Severe right knee swelling and difficulty walking post-fall',
    notes: 'X-Ray right knee AP/Lateral ordered in pre-op.',
    createdAt: '2026-10-30 11:30'
  },
  {
    id: 'APT-306',
    tokenNo: 'TK-06',
    patientId: 'PID-1006',
    patientName: 'Meera Nair',
    doctorId: 'DOC-205',
    doctorName: 'Dr. Farhan Qureshi',
    department: 'Neurology',
    appointmentDate: '2026-10-30',
    timeSlot: '12:00 PM',
    status: 'Completed',
    symptoms: 'Chronic migraine with visual aura',
    notes: 'Prescribed prophylactic migraine therapy; scheduled follow-up in 4 weeks.',
    createdAt: '2026-10-28 09:40'
  }
];

export const INITIAL_RECORDS: MedicalRecord[] = [
  {
    id: 'REC-401',
    patientId: 'PID-1001',
    patientName: 'Aarav Sharma',
    doctorId: 'DOC-201',
    doctorName: 'Dr. Suresh K. Rao',
    visitDate: '2026-10-31',
    diagnosis: 'Stage 1 Essential Hypertension & Exertional Angina Rule-out',
    vitals: {
      bloodPressure: '138/88 mmHg',
      pulseRate: '78 bpm',
      temperature: '98.4 °F',
      spO2: '99%',
      weight: '74 kg'
    },
    complaints: 'Substernal tightness after climbing two flights of stairs, relieved by rest.',
    prescriptions: [
      {
        medicine: 'Tab. Telmisartan',
        dosage: '40 mg',
        frequency: '1 - 0 - 0',
        duration: '30 Days',
        instructions: 'Take once daily in the morning before breakfast'
      },
      {
        medicine: 'Tab. Metoprolol Tartrate',
        dosage: '25 mg',
        frequency: '1 - 0 - 1',
        duration: '15 Days',
        instructions: 'After food with water'
      },
      {
        medicine: 'Tab. Sorbitrate (SOS)',
        dosage: '5 mg',
        frequency: 'Sublingual',
        duration: 'As needed',
        instructions: 'Keep under tongue if severe chest pain occurs'
      }
    ],
    labTests: ['12-Lead Resting ECG', 'Lipid Profile Fasting', '2D Echocardiography', 'Serum Creatinine'],
    clinicalNotes: 'Advised low-sodium DASH diet (salt < 4g/day), 30 minutes brisk walking daily. Avoid heavy lifting until TMT is evaluated.',
    followUpDate: '2026-11-15'
  },
  {
    id: 'REC-402',
    patientId: 'PID-1006',
    patientName: 'Meera Nair',
    doctorId: 'DOC-205',
    doctorName: 'Dr. Farhan Qureshi',
    visitDate: '2026-10-30',
    diagnosis: 'Classic Migraine with Sensory Aura',
    vitals: {
      bloodPressure: '118/76 mmHg',
      pulseRate: '72 bpm',
      temperature: '98.6 °F',
      spO2: '98%',
      weight: '62 kg'
    },
    complaints: 'Unilateral throbbing headache on left hemisphere, photophobia, nausea.',
    prescriptions: [
      {
        medicine: 'Tab. Propranolol Hydro',
        dosage: '40 mg',
        frequency: '0 - 0 - 1',
        duration: '30 Days',
        instructions: 'Night time after meals'
      },
      {
        medicine: 'Tab. Naproxen Sodium',
        dosage: '500 mg',
        frequency: 'SOS (At onset)',
        duration: '5 Days',
        instructions: 'Take with antacid immediately when migraine aura starts'
      },
      {
        medicine: 'Tab. Domperidone',
        dosage: '10 mg',
        frequency: '1 - 0 - 1',
        duration: '5 Days',
        instructions: '30 minutes before meal for nausea'
      }
    ],
    labTests: ['MRI Brain (Screening)', 'Serum Vitamin B12 & D3'],
    clinicalNotes: 'Maintain headache diary. Sleep minimum 7-8 hours continuously. Avoid known food triggers (aged cheese, caffeine excess).',
    followUpDate: '2026-11-28'
  }
];

export const DEPARTMENTS = [
  'Cardiology',
  'General Medicine',
  'Pediatrics',
  'Orthopedics',
  'Neurology',
  'Dermatology',
  'ENT',
  'Ophthalmology'
];
