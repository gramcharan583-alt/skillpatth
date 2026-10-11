import { StudentProfile } from '../types';

export interface DemoPreset {
  id: string;
  label: string;
  description: string;
  profile: StudentProfile;
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'ece-embedded-y2',
    label: 'Aarav Sharma — ECE 2nd Year',
    description: 'Embedded Systems & IoT focus, active hardware prototyping, preparing for 3rd year core internships.',
    profile: {
      id: 'demo-aarav',
      name: 'Aarav Sharma',
      academicYear: '2nd',
      branch: 'ECE',
      careerGoal: 'Embedded Systems and IoT',
      skillLevel: 'Intermediate',
      weeklyStudyHours: 16,
      targetCompany: 'Texas Instruments / Qualcomm',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOnboarded: true,
    },
  },
  {
    id: 'cse-sde-y3',
    label: 'Priya Patel — CSE 3rd Year',
    description: 'Software Development & DSA focus, preparing for upcoming campus placement season and tech internships.',
    profile: {
      id: 'demo-priya',
      name: 'Priya Patel',
      academicYear: '3rd',
      branch: 'CSE',
      careerGoal: 'Software Development',
      skillLevel: 'Intermediate',
      weeklyStudyHours: 20,
      targetCompany: 'Google / Microsoft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOnboarded: true,
    },
  },
  {
    id: 'ece-vlsi-y4',
    label: 'Rohan Verma — ECE 4th Year',
    description: 'VLSI & Semiconductor Design specialization, completing capstone chip design and interview mock assessments.',
    profile: {
      id: 'demo-rohan',
      name: 'Rohan Verma',
      academicYear: '4th',
      branch: 'ECE',
      careerGoal: 'VLSI and Semiconductor Design',
      skillLevel: 'Advanced',
      weeklyStudyHours: 25,
      targetCompany: 'Intel / Synopsys',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOnboarded: true,
    },
  },
  {
    id: 'first-year-general',
    label: 'Sneha Reddy — 1st Year (Discovery)',
    description: 'First year engineering foundation, exploring programming, electronics labs, and deciding specialization.',
    profile: {
      id: 'demo-sneha',
      name: 'Sneha Reddy',
      academicYear: '1st',
      branch: 'CSE',
      careerGoal: 'Not Decided Yet',
      skillLevel: 'Beginner',
      weeklyStudyHours: 12,
      targetCompany: 'Top Tech / Research',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOnboarded: true,
    },
  },
  {
    id: 'mech-robotics-y2',
    label: 'Vikram Joshi — Mechanical 2nd Year',
    description: 'Core Engineering & Robotics focus, learning CAD modeling, kinematics, and electro-mechanical systems.',
    profile: {
      id: 'demo-vikram',
      name: 'Vikram Joshi',
      academicYear: '2nd',
      branch: 'Mechanical',
      careerGoal: 'Core Engineering',
      skillLevel: 'Intermediate',
      weeklyStudyHours: 15,
      targetCompany: 'Tata Motors / L&T',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOnboarded: true,
    },
  },
];
