import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Course,
  UserProgress,
  Certificate,
  StudentProfile,
  PaymentTransaction,
  PendingPayment,
  UserNote,
  PlatformAnalytics
} from '../types';
import { COURSES } from '../data/coursesData';
import { INSTRUCTORS } from '../data/instructorsData';
import confetti from 'canvas-confetti';

interface AcademyContextType {
  // Navigation & UI state
  activeView: 'home' | 'courses' | 'course-detail' | 'dashboard' | 'analytics' | 'certificates' | 'instructors' | 'admin' | 'verify-cert';
  setActiveView: (view: 'home' | 'courses' | 'course-detail' | 'dashboard' | 'analytics' | 'certificates' | 'instructors' | 'admin' | 'verify-cert') => void;
  selectedCourseId: string | null;
  setSelectedCourseId: (id: string | null) => void;
  selectedLessonId: string | null;
  setSelectedLessonId: (id: string | null) => void;

  // Modals
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  checkoutCourse: Course | null;
  setCheckoutCourse: (course: Course | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup' | 'forgot' | 'reset';
  setAuthModalMode: (mode: 'login' | 'signup' | 'forgot' | 'reset') => void;
  openAuthModal: (mode?: 'login' | 'signup' | 'forgot' | 'reset') => void;
  closeAuthModal: () => void;
  isVideoIntroOpen: boolean;
  setIsVideoIntroOpen: (open: boolean) => void;
  isBrochureOpen: boolean;
  setIsBrochureOpen: (open: boolean) => void;
  openBrochure: (course?: Course | string) => void;
  downloadBrochurePDF: (course?: Course) => void;
  activeCertificateModal: Certificate | null;
  setActiveCertificateModal: (cert: Certificate | null) => void;

  // Currency & Filter state
  currency: 'INR' | 'USD';
  setCurrency: (c: 'INR' | 'USD') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  // User & Authentication
  isLoggedIn: boolean;
  user: StudentProfile;
  setUser: React.Dispatch<React.SetStateAction<StudentProfile>>;
  toggleUserRole: () => void;
  login: (email: string, password?: string, name?: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password?: string, phone?: string) => Promise<{ success: boolean; message?: string }>;
  registerSendOtp: (name: string, email: string, password?: string, phone?: string) => Promise<{ success: boolean; requireVerification?: boolean; message?: string }>;
  registerVerifyOtp: (email: string, otp: string) => Promise<{ success: boolean; message?: string }>;
  registerResendOtp: (email: string) => Promise<{ success: boolean; message?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (email: string, token: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  adminChangePassword: (newPassword: string) => Promise<{ success: boolean; message: string }>;
  loginWithOAuth: (provider: 'google' | 'github', tokenOrCredential?: string) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogleCredential: (credential: string) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogleAccessToken: (accessToken: string) => Promise<{ success: boolean; message?: string }>;
  quickDemoLogin: (role: 'student' | 'instructor') => void;
  authToken: string | null;
  courses: Course[];
  enrolledCourseIds: string[];
  userProgress: Record<string, UserProgress>;
  certificates: Certificate[];
  transactions: PaymentTransaction[];
  cart: Course[];

  // Actions
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  isEnrolled: (courseId: string) => boolean;
  isPendingApproval: (courseId: string) => boolean;
  pendingCourseIds: string[];
  startCheckout: (course: Course) => void;
  processPayment: (params: {
    course: Course;
    gateway: 'UPI' | 'Razorpay / UPI' | 'Stripe (Card)' | 'PayPal' | 'NetBanking';
    paymentMethodDetails: string;
    couponCode?: string;
    discountAmount: number;
    finalAmount: number;
  }) => Promise<PaymentTransaction>;
  submitPaymentProof: (params: {
    course: Course;
    utrNumber: string;
    couponCode?: string;
    discountAmount: number;
    finalAmount: number;
    paymentMethodDetails?: string;
  }) => Promise<{ success: boolean; message: string; transaction?: PaymentTransaction }>;
  fetchPendingPayments: () => Promise<{ success: boolean; pendingPayments: PendingPayment[] }>;
  approvePendingPayment: (transactionId: string, userId: string, courseId: string) => Promise<{ success: boolean; message: string }>;
  rejectPendingPayment: (transactionId: string, userId: string, courseId: string) => Promise<{ success: boolean; message: string }>;

  openCoursePlayer: (courseId: string, lessonId?: string) => void;
  openCourseDetail: (courseId: string) => void;
  markLessonComplete: (courseId: string, lessonId: string) => void;
  toggleLessonComplete: (courseId: string, lessonId: string) => void;
  submitQuizScore: (courseId: string, lessonId: string, score: number) => void;
  generateCertificateForCourse: (courseId: string) => Certificate;
  verifyCertificateById: (credentialOrId: string) => Certificate | null;
  fetchCertificates: () => Promise<void>;
  issueCertificateAdmin: (params: {
    studentId?: string;
    studentEmail?: string;
    courseId: string;
    courseTitle?: string;
    category?: string;
    instructorName?: string;
    instructorTitle?: string;
    grade?: string;
    overallScore?: number;
    skillsVerified?: string[];
    moduleType?: 'all' | 'py' | 'viz' | 'pro';
  }) => Promise<{ success: boolean; message: string; certificate?: Certificate; certificates?: Certificate[] }>;
  revokeCertificateAdmin: (certId: string) => Promise<{ success: boolean; message: string }>;
  revokeCertificateBundleAdmin: (userId: string, courseId: string) => Promise<{ success: boolean; message: string }>;
  fetchAdminRegistry: () => Promise<{ success: boolean; students: any[]; enrollments: any[]; certificates: any[] }>;
  addLessonNote: (courseId: string, lessonId: string, lessonTitle: string, text: string, videoTime?: string) => void;
  deleteLessonNote: (courseId: string, noteId: string) => void;
  getCourseProgress: (courseId: string) => {
    percentage: number;
    completedCount: number;
    totalCount: number;
    isCompleted: boolean;
  };
  triggerConfetti: () => void;
  platformAnalytics: PlatformAnalytics;
}

const AcademyContext = createContext<AcademyContextType | undefined>(undefined);

// Initial default user profile (clean guest state - NEVER admin by default)
const INITIAL_STUDENT: StudentProfile = {
  id: '',
  name: 'Guest Learner',
  email: '',
  avatar: '/student-avatar.png',
  role: 'student',
  headline: 'Data Analytics Explorer',
  streakDays: 0,
  totalHoursLearned: 0,
  xpPoints: 0,
  joinedDate: 'August 2026'
};

// Initial clean progress
const INITIAL_PROGRESS: Record<string, UserProgress> = {};

// Official Verifiable Certificate Registry (for public verification portal sample lookup)
export const OFFICIAL_VERIFIABLE_REGISTRY: Certificate[] = [
  {
    id: 'cert-mew-py-1',
    certificateNumber: 'MEW-2026-PY-1041',
    recipientName: 'Aarav Sharma',
    recipientEmail: 'aarav.sharma@example.com',
    courseId: 'course-data-analytics',
    courseTitle: 'Certificate in Python for Data Analytics',
    category: 'Python Data Analytics',
    instructorName: 'Prof. MD Tahseen Equbal',
    instructorTitle: 'Course Director & Lead Data Scientist',
    issueDate: 'August 30, 2026',
    grade: 'High Honors',
    overallScore: 98,
    skillsVerified: ['Python 3 Programming', 'NumPy Vectorized Ops', 'Pandas Data Wrangling', 'Missing Value Imputation', 'Data Structuring & Lambdas'],
    verificationUrl: 'https://mewacademy.com/verify/MEW-2026-PY-1041',
    credentialId: 'MEW-2026-PY-1041',
    certificateIndex: 1,
    badgeTitle: 'Python Data Analytics',
    covers: 'Python • NumPy • Pandas',
    isFlagship: false,
    verificationHash: '8f92b7c4a1e95632d847b201f65c9183'
  },
  {
    id: 'cert-mew-viz-2',
    certificateNumber: 'MEW-2026-VIZ-2042',
    recipientName: 'Priya Patel',
    recipientEmail: 'priya.patel@example.com',
    courseId: 'course-data-analytics',
    courseTitle: 'Certificate in Data Visualization & Business Intelligence',
    category: 'Data Visualization & BI',
    instructorName: 'Prof. MD Tahseen Equbal',
    instructorTitle: 'Course Director & Lead Data Scientist',
    issueDate: 'August 30, 2026',
    grade: 'Excellence',
    overallScore: 96,
    skillsVerified: ['Matplotlib Storytelling', 'Seaborn Statistical Plots', 'Excel Modeling', 'Power BI Interactive Dashboards', 'DAX Measures & KPIs'],
    verificationUrl: 'https://mewacademy.com/verify/MEW-2026-VIZ-2042',
    credentialId: 'MEW-2026-VIZ-2042',
    certificateIndex: 2,
    badgeTitle: 'Data Visualization & Business Intelligence',
    covers: 'Matplotlib • Seaborn • Excel • Power BI',
    isFlagship: false,
    verificationHash: '3a18e5792c4b810d9f67a345e82b9941'
  },
  {
    id: 'cert-mew-flagship-3',
    certificateNumber: 'MEW-2026-PRO-3043',
    recipientName: 'Rohan Verma',
    recipientEmail: 'rohan.verma@example.com',
    courseId: 'course-data-analytics',
    courseTitle: 'Professional Certificate in Data Analytics',
    category: 'Full-Stack Data Analytics Program',
    instructorName: 'Prof. MD Tahseen Equbal',
    instructorTitle: 'Course Director & Lead Data Scientist',
    issueDate: 'August 30, 2026',
    grade: 'Distinction',
    overallScore: 99,
    skillsVerified: ['Full-Stack Data Analytics', 'Python & NumPy Engine', 'Pandas Data Wrangling', 'Matplotlib & Seaborn Visuals', 'Advanced Business Excel', 'Power BI Dashboards', 'Industrial Capstone Projects'],
    verificationUrl: 'https://mewacademy.com/verify/MEW-2026-PRO-3043',
    credentialId: 'MEW-2026-PRO-3043',
    certificateIndex: 3,
    badgeTitle: 'Flagship Program',
    covers: 'Python • NumPy • Pandas • Visualization • Excel • Power BI • Projects',
    isFlagship: true,
    verificationHash: '7c42a8b910d543e2f189c67a3b45e219'
  }
];

const INITIAL_CERTIFICATES: Certificate[] = [];
const INITIAL_TRANSACTIONS: PaymentTransaction[] = [];

export const AcademyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Modals (Preserved across reloads using Hash and LocalStorage)
  const [activeView, setActiveView] = useState<'home' | 'courses' | 'course-detail' | 'dashboard' | 'analytics' | 'certificates' | 'instructors' | 'admin' | 'verify-cert'>(() => {
    try {
      const validViews = ['home', 'courses', 'course-detail', 'dashboard', 'analytics', 'certificates', 'instructors', 'admin', 'verify-cert'];
      const hash = window.location.hash.replace('#', '');
      if (hash && validViews.includes(hash)) {
        return hash as any;
      }
      const saved = localStorage.getItem('mew_active_view');
      return (saved && validViews.includes(saved)) ? (saved as any) : 'home';
    } catch {
      return 'home';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mew_active_view', activeView);
      const search = window.location.search || '';
      const currentTarget = `${window.location.pathname}${search}#${activeView}`;
      if (window.location.hash !== `#${activeView}`) {
        window.history.replaceState(null, '', currentTarget);
      }
    } catch {
      // ignore
    }
  }, [activeView]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>('course-data-analytics');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>('les-1-1');

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutCourse, setCheckoutCourse] = useState<Course | null>(null);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot' | 'reset'>('login');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '');
      const hasResetToken = searchParams.get('reset_token') || hashParams.get('reset_token') || searchParams.get('token') || hashParams.get('token');
      return !!hasResetToken;
    } catch {
      return false;
    }
  });

  const openAuthModal = (mode: 'login' | 'signup' | 'forgot' | 'reset' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
    if (mode === 'login' || mode === 'signup') {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.delete('reset_token');
        searchParams.delete('token');
        searchParams.delete('email');
        const newSearch = searchParams.toString() ? `?${searchParams.toString()}` : '';
        window.history.replaceState({}, document.title, window.location.pathname + newSearch + window.location.hash);
      } catch {
        // ignore
      }
    }
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthModalMode('login');
    try {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.delete('reset_token');
      searchParams.delete('token');
      searchParams.delete('email');
      const newSearch = searchParams.toString() ? `?${searchParams.toString()}` : '';
      window.history.replaceState({}, document.title, window.location.pathname + newSearch + window.location.hash);
    } catch {
      // ignore
    }
  };

  // Global URL listener to auto-open modal when reset token is present
  useEffect(() => {
    const handleUrlCheck = () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const hashQuery = window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '';
        const hashParams = new URLSearchParams(hashQuery);
        const hasResetToken = searchParams.get('reset_token') || hashParams.get('reset_token') || searchParams.get('token') || hashParams.get('token');
        if (hasResetToken) {
          setAuthModalMode('reset');
          setIsAuthModalOpen(true);
        }
      } catch {
        // ignore
      }
    };

    handleUrlCheck();
    window.addEventListener('popstate', handleUrlCheck);
    window.addEventListener('hashchange', handleUrlCheck);
    return () => {
      window.removeEventListener('popstate', handleUrlCheck);
      window.removeEventListener('hashchange', handleUrlCheck);
    };
  }, []);
  const [isVideoIntroOpen, setIsVideoIntroOpen] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [activeCertificateModal, setActiveCertificateModal] = useState<Certificate | null>(null);

  // Filters
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Persistence State (starts clean without dummy data)
  const [user, setUser] = useState<StudentProfile>(() => {
    try {
      const token = localStorage.getItem('mew_auth_token');
      const saved = localStorage.getItem('mew_user_v3');
      if (token && saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.avatar || parsed.avatar.includes('photo-1534528741775-53994a69daeb')) {
          parsed.avatar = '/student-avatar.png';
        }
        const ADMIN_EMAILS = ['muzammilahsan07@gmail.com', 'muzammilahsanahsan07@gmail.com', 'mewacademy.ac@gmail.com'];
        if (parsed.role === 'admin' && !ADMIN_EMAILS.includes(parsed.email?.toLowerCase())) {
          parsed.role = 'student';
        }
        return parsed;
      }
      return INITIAL_STUDENT;
    } catch {
      return INITIAL_STUDENT;
    }
  });

  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [pendingCourseIds, setPendingCourseIds] = useState<string[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>(INITIAL_PROGRESS);
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(INITIAL_TRANSACTIONS);
  const [cart, setCart] = useState<Course[]>([]);

  // JWT Auth Token
  const [authToken, setAuthToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('mew_auth_token');
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (authToken) {
      localStorage.setItem('mew_auth_token', authToken);
    } else {
      localStorage.removeItem('mew_auth_token');
    }
  }, [authToken]);

  // Sync active user profile
  useEffect(() => {
    if (user.id) {
      localStorage.setItem('mew_user_v3', JSON.stringify(user));
    } else {
      localStorage.removeItem('mew_user_v3');
    }
  }, [user]);

  // Sync user-specific enrollments, transactions, certificates, and progress
  useEffect(() => {
    if (authToken && user.id && user.role !== 'admin') {
      // 1. Load user-scoped transactions
      try {
        const savedTxns = localStorage.getItem(`mew_txns_${user.id}`);
        setTransactions(savedTxns ? JSON.parse(savedTxns) : []);
      } catch {
        setTransactions([]);
      }

      // 2. Load user-scoped certificates
      try {
        const savedCerts = localStorage.getItem(`mew_certs_${user.id}`);
        setCertificates(savedCerts ? JSON.parse(savedCerts) : []);
      } catch {
        setCertificates([]);
      }

      // 3. Load user-scoped progress
      try {
        const savedProg = localStorage.getItem(`mew_prog_${user.id}`);
        setUserProgress(savedProg ? JSON.parse(savedProg) : {});
      } catch {
        setUserProgress({});
      }

      // 4. Fetch actual student enrollments from database
      fetch('/api/enroll/my-courses', {
        headers: { Authorization: `Bearer ${authToken}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data?.success && Array.isArray(data.enrollments)) {
            const activeIds: string[] = [];
            const pendingIds: string[] = [];
            data.enrollments.forEach((e: any) => {
              if (e.status === 'pending_approval') {
                pendingIds.push(e.courseId);
              } else if (e.status === 'enrolled') {
                activeIds.push(e.courseId);
              }
            });
            setEnrolledCourseIds(activeIds);
            setPendingCourseIds(pendingIds);
            localStorage.setItem(`mew_enrolled_${user.id}`, JSON.stringify(activeIds));
            localStorage.setItem(`mew_pending_${user.id}`, JSON.stringify(pendingIds));
          } else {
            const savedCourses = localStorage.getItem(`mew_enrolled_${user.id}`);
            setEnrolledCourseIds(savedCourses ? JSON.parse(savedCourses) : []);
          }
        })
        .catch(() => {
          const savedCourses = localStorage.getItem(`mew_enrolled_${user.id}`);
          setEnrolledCourseIds(savedCourses ? JSON.parse(savedCourses) : []);
        });
    } else {
      setTransactions([]);
      setEnrolledCourseIds([]);
      setPendingCourseIds([]);
      setCertificates([]);
      setUserProgress({});
    }
  }, [authToken, user.id, user.role]);

  // Save changes per user ID
  useEffect(() => {
    if (user.id && user.role !== 'admin') {
      localStorage.setItem(`mew_enrolled_${user.id}`, JSON.stringify(enrolledCourseIds));
      localStorage.setItem(`mew_pending_${user.id}`, JSON.stringify(pendingCourseIds));
    }
  }, [enrolledCourseIds, pendingCourseIds, user.id, user.role]);

  useEffect(() => {
    if (user.id && user.role !== 'admin') {
      localStorage.setItem(`mew_txns_${user.id}`, JSON.stringify(transactions));
    }
  }, [transactions, user.id, user.role]);

  useEffect(() => {
    if (user.id && user.role !== 'admin') {
      localStorage.setItem(`mew_certs_${user.id}`, JSON.stringify(certificates));
    }
  }, [certificates, user.id, user.role]);

  useEffect(() => {
    if (user.id && user.role !== 'admin') {
      localStorage.setItem(`mew_prog_${user.id}`, JSON.stringify(userProgress));
    }
  }, [userProgress, user.id, user.role]);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const token = localStorage.getItem('mew_auth_token');
      const saved = localStorage.getItem('mew_is_logged_in_v3');
      return !!token && saved === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem('mew_is_logged_in_v3', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  const toggleUserRole = () => {
    setUser(prev => ({
      ...prev,
      role: prev.role === 'student' ? 'admin' : 'student'
    }));
  };

  const login = async (email: string, password?: string, name?: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Login failed.' };
      }
      setAuthToken(data.token);
      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        avatar: data.user.avatar || '/student-avatar.png',
        role: data.user.role || 'student',
        headline: data.user.headline || 'Data Analytics Explorer',
        streakDays: data.user.streakDays || 0,
        totalHoursLearned: data.user.totalHoursLearned || 0,
        xpPoints: data.user.xpPoints || 0,
        joinedDate: data.user.joinedDate || 'August 2026',
      });
      setIsLoggedIn(true);
      setIsAuthModalOpen(false);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      if (checkoutCourse) {
        setIsCheckoutOpen(true);
      }
      return { success: true, message: data.message };
    } catch {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
  };

  const register = async (name: string, email: string, password?: string, phone?: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Registration failed.' };
      }
      setAuthToken(data.token);
      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || phone || '',
        avatar: data.user.avatar || '/student-avatar.png',
        role: data.user.role || 'student',
        headline: data.user.headline || 'Data Analytics Explorer',
        streakDays: data.user.streakDays || 1,
        totalHoursLearned: data.user.totalHoursLearned || 0,
        xpPoints: data.user.xpPoints || 50,
        joinedDate: data.user.joinedDate || 'August 2026',
      });
      setIsLoggedIn(true);
      setIsAuthModalOpen(false);
      confetti({ particleCount: 65, spread: 70, origin: { y: 0.6 } });
      if (checkoutCourse) {
        setIsCheckoutOpen(true);
      }
      return { success: true, message: data.message };
    } catch {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
  };

  const registerSendOtp = async (name: string, email: string, password?: string, phone?: string) => {
    try {
      const res = await fetch('/api/auth/register-send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Failed to send verification email.' };
      }
      return { success: true, requireVerification: true, message: data.message };
    } catch {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
  };

  const registerVerifyOtp = async (email: string, otp: string) => {
    try {
      const res = await fetch('/api/auth/register-verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Verification failed.' };
      }
      setAuthToken(data.token);
      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || '',
        avatar: data.user.avatar || '/student-avatar.png',
        role: data.user.role || 'student',
        headline: data.user.headline || 'Data Analytics Explorer',
        streakDays: data.user.streakDays || 1,
        totalHoursLearned: data.user.totalHoursLearned || 0,
        xpPoints: data.user.xpPoints || 50,
        joinedDate: data.user.joinedDate || 'August 2026',
      });
      setIsLoggedIn(true);
      setIsAuthModalOpen(false);
      confetti({ particleCount: 75, spread: 75, origin: { y: 0.6 } });
      if (checkoutCourse) {
        setIsCheckoutOpen(true);
      }
      return { success: true, message: data.message };
    } catch {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
  };

  const registerResendOtp = async (email: string) => {
    try {
      const res = await fetch('/api/auth/register-resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Failed to resend verification code.' };
      }
      return { success: true, message: data.message };
    } catch {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Failed to send reset email.' };
      }
      return { success: true, message: data.message };
    } catch {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
  };

  const resetPassword = async (email: string, token: string, newPassword: string) => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), token: token.trim(), newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Failed to reset password.' };
      }

      if (data.token && data.user) {
        setAuthToken(data.token);
        setUser(data.user);
        setIsLoggedIn(true);
        setIsAuthModalOpen(false);
        confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
      }

      return { success: true, message: data.message };
    } catch {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setAuthToken(null);
    setUser(INITIAL_STUDENT);
    setCertificates([]);
    setEnrolledCourseIds([]);
    setTransactions([]);
    setUserProgress({});
    localStorage.removeItem('mew_auth_token');
    localStorage.removeItem('mew_user_v3');
    localStorage.removeItem('mew_certificates_v3');
    localStorage.removeItem('mew_enrolled_courses_v3');
    localStorage.removeItem('mew_transactions_v3');
    localStorage.setItem('mew_is_logged_in_v3', 'false');
    setCheckoutCourse(null);
    setIsCheckoutOpen(false);
  };

  const adminLogin = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Admin verification failed.' };
      }

      setAuthToken(data.token);
      setUser(data.user);
      setIsLoggedIn(true);
      setCertificates([]);
      setEnrolledCourseIds([]);
      localStorage.removeItem('mew_certificates_v3');
      localStorage.removeItem('mew_enrolled_courses_v3');
      return { success: true, message: 'Admin access authorized.' };
    } catch {
      return { success: false, message: 'Network error during admin authentication.' };
    }
  };

  const adminChangePassword = async (newPassword: string): Promise<{ success: boolean; message: string }> => {
    if (!authToken) {
      return { success: false, message: 'Admin authentication required.' };
    }
    try {
      const res = await fetch('/api/auth/admin-change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Failed to update password.' };
      }
      return { success: true, message: data.message };
    } catch {
      return { success: false, message: 'Network error while updating admin password.' };
    }
  };

  const loginWithGoogleCredential = async (credential: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Google authentication failed.' };
      }
      setAuthToken(data.token);
      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || '',
        avatar: data.user.avatar || '/student-avatar.png',
        role: data.user.role || 'student',
        headline: data.user.headline || 'Data Analytics Explorer',
        streakDays: data.user.streakDays || 1,
        totalHoursLearned: data.user.totalHoursLearned || 0,
        xpPoints: data.user.xpPoints || 50,
        joinedDate: data.user.joinedDate || 'August 2026',
      });
      setIsLoggedIn(true);
      setIsAuthModalOpen(false);
      confetti({ particleCount: 65, spread: 70, origin: { y: 0.6 } });
      if (checkoutCourse) {
        setIsCheckoutOpen(true);
      }
      return { success: true, message: data.message };
    } catch {
      return { success: false, message: 'Network error. Please check your connection to the server.' };
    }
  };

  const loginWithGoogleAccessToken = async (accessToken: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Google authentication failed.' };
      }
      setAuthToken(data.token);
      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || '',
        avatar: data.user.avatar || '/student-avatar.png',
        role: data.user.role || 'student',
        headline: data.user.headline || 'Data Analytics Explorer',
        streakDays: data.user.streakDays || 1,
        totalHoursLearned: data.user.totalHoursLearned || 0,
        xpPoints: data.user.xpPoints || 50,
        joinedDate: data.user.joinedDate || 'August 2026',
      });
      setIsLoggedIn(true);
      setIsAuthModalOpen(false);
      confetti({ particleCount: 65, spread: 70, origin: { y: 0.6 } });
      if (checkoutCourse) {
        setIsCheckoutOpen(true);
      }
      return { success: true, message: data.message };
    } catch {
      return { success: false, message: 'Network error. Please check your connection to the server.' };
    }
  };

  const loginWithOAuth = async (provider: 'google' | 'github', tokenOrCredential?: string): Promise<{ success: boolean; message?: string }> => {
    if (provider === 'google' && tokenOrCredential) {
      if (tokenOrCredential.includes('.')) {
        return loginWithGoogleCredential(tokenOrCredential);
      } else {
        return loginWithGoogleAccessToken(tokenOrCredential);
      }
    }
    // Fallback simulation for GitHub or demo
    await new Promise(r => setTimeout(r, 400));
    const providerName = provider === 'google' ? 'Google' : 'GitHub';
    setUser({
      id: `usr-${provider}-${Date.now().toString(36)}`,
      name: `Student (${providerName})`,
      email: `student.${provider}@mewacademy.com`,
      avatar: '/student-avatar.png',
      role: 'student',
      headline: 'Data Analytics Explorer',
      streakDays: 1,
      totalHoursLearned: 0,
      xpPoints: 100,
      joinedDate: 'August 2026'
    });
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    if (checkoutCourse) {
      setIsCheckoutOpen(true);
    }
    return { success: true };
  };


  const quickDemoLogin = (role: 'student' | 'instructor') => {
    if (role === 'instructor') {
      setUser({
        id: 'usr-inst-tahseen',
        name: 'Prof. MD Tahseen Equbal',
        email: 'tahseen.equbal@mewacademy.com',
        avatar: '/tahseen-equbal.png',
        role: 'instructor',
        headline: 'Lead Instructor & Data Analytics Specialist',
        streakDays: 45,
        totalHoursLearned: 180,
        xpPoints: 4800,
        joinedDate: 'January 2026'
      });
    } else {
      setUser(INITIAL_STUDENT);
    }
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    if (checkoutCourse) {
      setIsCheckoutOpen(true);
    }
  };

  const isEnrolled = (courseId: string) => enrolledCourseIds.includes(courseId);

  const addToCart = (course: Course) => {
    if (!cart.some(item => item.id === course.id) && !isEnrolled(course.id)) {
      setCart(prev => [...prev, course]);
    }
  };

  const removeFromCart = (courseId: string) => {
    setCart(prev => prev.filter(c => c.id !== courseId));
  };

  const clearCart = () => setCart([]);

  const startCheckout = (course: Course) => {
    setCheckoutCourse(course);
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsCheckoutOpen(true);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }
  };

  const processPayment = async (params: {
    course: Course;
    gateway: 'UPI' | 'Razorpay / UPI' | 'Stripe (Card)' | 'PayPal' | 'NetBanking';
    paymentMethodDetails: string;
    couponCode?: string;
    discountAmount: number;
    finalAmount: number;
  }): Promise<PaymentTransaction> => {
    // Simulate real gateway handshake delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    const orderId = `ORD-MEW-${Math.floor(100000 + Math.random() * 900000)}`;
    const txnId = `TXN-${Date.now().toString().slice(-6)}`;

    const newTxn: PaymentTransaction = {
      id: txnId,
      orderId,
      courseId: params.course.id,
      courseTitle: params.course.title,
      amount: params.finalAmount,
      currency,
      gateway: params.gateway,
      paymentMethodDetails: params.paymentMethodDetails,
      discountApplied: params.discountAmount,
      couponCode: params.couponCode,
      status: 'SUCCESS',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      receiptUrl: '#'
    };

    // Auto enroll student
    setEnrolledCourseIds(prev => Array.from(new Set([...prev, params.course.id])));

    // Initialize blank progress if not present
    setUserProgress(prev => ({
      ...prev,
      [params.course.id]: prev[params.course.id] || {
        courseId: params.course.id,
        enrolledAt: new Date().toISOString(),
        completedLessonIds: [],
        lastAccessedLessonId: params.course.modules[0]?.lessons[0]?.id || '',
        quizScores: {},
        timeSpentSeconds: 0,
        isCompleted: false,
        notes: []
      }
    }));

    setTransactions(prev => [newTxn, ...prev]);
    removeFromCart(params.course.id);
    triggerConfetti();

    return newTxn;
  };

  const isPendingApproval = (courseId: string) => pendingCourseIds.includes(courseId);

  const submitPaymentProof = async (params: {
    course: Course;
    utrNumber: string;
    couponCode?: string;
    discountAmount: number;
    finalAmount: number;
    paymentMethodDetails?: string;
  }): Promise<{ success: boolean; message: string; transaction?: PaymentTransaction }> => {
    try {
      const res = await fetch('/api/enroll/submit-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          courseId: params.course.id,
          courseTitle: params.course.title,
          amount: params.finalAmount,
          utrNumber: params.utrNumber,
          couponCode: params.couponCode,
          discountAmount: params.discountAmount,
          paymentMethodDetails: params.paymentMethodDetails,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Failed to submit payment verification.' };
      }

      setPendingCourseIds(prev => Array.from(new Set([...prev, params.course.id])));
      removeFromCart(params.course.id);
      triggerConfetti();

      const createdTxn: PaymentTransaction = {
        id: data.transaction?.id || `TXN-${Date.now().toString().slice(-6)}`,
        orderId: data.transaction?.orderId || `ORD-${Date.now()}`,
        courseId: params.course.id,
        courseTitle: params.course.title,
        amount: params.finalAmount,
        currency,
        gateway: 'UPI',
        paymentMethodDetails: `UPI (Transaction ID: ${params.utrNumber.trim()})`,
        discountApplied: params.discountAmount,
        couponCode: params.couponCode,
        utrNumber: params.utrNumber,
        status: 'PENDING_APPROVAL',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        receiptUrl: '#',
      };
      setTransactions(prev => [createdTxn, ...prev]);

      return { success: true, message: data.message, transaction: createdTxn };
    } catch {
      return { success: false, message: 'Network error while submitting payment verification.' };
    }
  };

  const fetchPendingPayments = async (): Promise<{ success: boolean; pendingPayments: PendingPayment[] }> => {
    if (!authToken) return { success: false, pendingPayments: [] };
    try {
      const res = await fetch('/api/enroll/admin/pending-payments', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, pendingPayments: [] };
      }
      return { success: true, pendingPayments: data.pendingPayments || [] };
    } catch {
      return { success: false, pendingPayments: [] };
    }
  };

  const approvePendingPayment = async (transactionId: string, userId: string, courseId: string): Promise<{ success: boolean; message: string }> => {
    if (!authToken) return { success: false, message: 'Admin authentication required.' };
    try {
      const res = await fetch('/api/enroll/admin/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ transactionId, userId, courseId }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Failed to approve payment.' };
      }
      return { success: true, message: data.message };
    } catch {
      return { success: false, message: 'Network error during payment approval.' };
    }
  };

  const rejectPendingPayment = async (transactionId: string, userId: string, courseId: string): Promise<{ success: boolean; message: string }> => {
    if (!authToken) return { success: false, message: 'Admin authentication required.' };
    try {
      const res = await fetch('/api/enroll/admin/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ transactionId, userId, courseId }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Failed to reject payment.' };
      }
      return { success: true, message: data.message };
    } catch {
      return { success: false, message: 'Network error during rejection.' };
    }
  };

  const openCourseDetail = (courseId: string) => {
    setSelectedCourseId(courseId);
    setActiveView('course-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCoursePlayer = (courseId: string, lessonId?: string) => {
    const targetCourse = COURSES.find(c => c.id === courseId);
    if (!targetCourse) return;

    setSelectedCourseId(courseId);

    // If not enrolled yet, auto-enroll for seamless experience
    if (!enrolledCourseIds.includes(courseId)) {
      setEnrolledCourseIds(prev => [...prev, courseId]);
    }

    setActiveView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCourseProgress = (courseId: string) => {
    const course = COURSES.find(c => c.id === courseId);
    if (!course) return { percentage: 0, completedCount: 0, totalCount: 0, isCompleted: false };

    const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    const progress = userProgress[courseId];
    const completedCount = progress?.completedLessonIds.length || 0;
    const percentage = totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 0;
    const isCompleted = progress?.isCompleted || (percentage >= 100 && totalLessons > 0);

    return { percentage, completedCount, totalCount: totalLessons, isCompleted };
  };

  const markLessonComplete = (courseId: string, lessonId: string) => {
    const course = COURSES.find(c => c.id === courseId);
    if (!course) return;

    setUserProgress(prev => {
      const current = prev[courseId] || {
        courseId,
        enrolledAt: new Date().toISOString(),
        completedLessonIds: [],
        quizScores: {},
        timeSpentSeconds: 0,
        isCompleted: false,
        notes: []
      };

      const newCompleted = Array.from(new Set([...current.completedLessonIds, lessonId]));
      const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
      const isNowCompleted = newCompleted.length >= totalLessons;

      return {
        ...prev,
        [courseId]: {
          ...current,
          completedLessonIds: newCompleted,
          lastAccessedLessonId: lessonId,
          isCompleted: isNowCompleted,
          completedAt: isNowCompleted && !current.completedAt ? new Date().toISOString() : current.completedAt
        }
      };
    });

    // Reward XP
    setUser(prev => ({
      ...prev,
      xpPoints: prev.xpPoints + 50,
      totalHoursLearned: +(prev.totalHoursLearned + 0.4).toFixed(1)
    }));

    // NOTE: Certificates are NEVER automatically generated!
    // Only the Academy Admin (Muzammil Ahsan) can officially issue verifiable certificates.
  };

  const toggleLessonComplete = (courseId: string, lessonId: string) => {
    const prog = userProgress[courseId];
    const isDone = prog?.completedLessonIds.includes(lessonId);
    if (isDone) {
      setUserProgress(prev => {
        const current = prev[courseId];
        if (!current) return prev;
        return {
          ...prev,
          [courseId]: {
            ...current,
            completedLessonIds: current.completedLessonIds.filter(id => id !== lessonId),
            isCompleted: false
          }
        };
      });
    } else {
      markLessonComplete(courseId, lessonId);
    }
  };

  const submitQuizScore = (courseId: string, lessonId: string, score: number) => {
    setUserProgress(prev => {
      const current = prev[courseId];
      if (!current) return prev;
      return {
        ...prev,
        [courseId]: {
          ...current,
          quizScores: {
            ...current.quizScores,
            [lessonId]: score
          }
        }
      };
    });

    if (score >= 70) {
      markLessonComplete(courseId, lessonId);
      triggerConfetti();
    }
  };

  const generateCertificateForCourse = (courseId: string): Certificate => {
    // Strict RBAC: Only Admin can invoke certificate generation
    if (user.role !== 'admin') {
      throw new Error('Unauthorized. Only administrators can issue certificates.');
    }

    const course = COURSES.find(c => c.id === courseId);
    if (!course) throw new Error('Course not found');

    const existing = certificates.find(c => c.courseId === courseId);
    if (existing) {
      return existing;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const codePrefix = course.category.replace(/\s+/g, '').substring(0, 3).toUpperCase();
    const certNumber = `MEW-2026-${codePrefix}-${randomSuffix}`;

    const newCert: Certificate = {
      id: `cert-${Date.now()}`,
      certificateNumber: certNumber,
      recipientName: user.name,
      recipientEmail: user.email,
      courseId: course.id,
      courseTitle: course.title,
      category: course.category,
      instructorName: course.instructor.name,
      instructorTitle: course.instructor.title,
      issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      grade: 'Distinction',
      overallScore: 98,
      skillsVerified: course.skillsGained,
      verificationUrl: `https://mewacademy.com/verify/${certNumber}`,
      credentialId: certNumber
    };

    setCertificates(prev => [newCert, ...prev]);
    return newCert;
  };

  const fetchCertificates = async () => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/certificates', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.certificates) {
          setCertificates(data.certificates);
        }
      }
    } catch (err) {
      console.error('Failed to sync certificates with server:', err);
    }
  };

  useEffect(() => {
    if (isLoggedIn && authToken) {
      fetchCertificates();
    }
  }, [isLoggedIn, authToken]);

  const issueCertificateAdmin = async (params: {
    studentId?: string;
    studentEmail?: string;
    courseId: string;
    courseTitle?: string;
    category?: string;
    instructorName?: string;
    instructorTitle?: string;
    grade?: string;
    overallScore?: number;
    skillsVerified?: string[];
  }): Promise<{ success: boolean; message: string; certificate?: Certificate }> => {
    if (!authToken) {
      return { success: false, message: 'Authentication required. Please sign in as Admin.' };
    }
    if (user.role !== 'admin') {
      return { success: false, message: 'Unauthorized. Only administrators can issue certificates.' };
    }

    try {
      const res = await fetch('/api/certificates/issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(params)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Failed to issue certificate.' };
      }

      await fetchCertificates();
      return { success: true, message: data.message, certificate: data.certificate };
    } catch {
      return { success: false, message: 'Network error while contacting certificate authority.' };
    }
  };

  const revokeCertificateAdmin = async (certId: string): Promise<{ success: boolean; message: string }> => {
    if (!authToken || user.role !== 'admin') {
      return { success: false, message: 'Unauthorized. Only administrators can revoke certificates.' };
    }

    try {
      const res = await fetch(`/api/certificates/${certId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Failed to revoke certificate.' };
      }

      await fetchCertificates();
      return { success: true, message: data.message };
    } catch {
      return { success: false, message: 'Network error while revoking certificate.' };
    }
  };

  const revokeCertificateBundleAdmin = async (userId: string, courseId: string): Promise<{ success: boolean; message: string }> => {
    if (!authToken || user.role !== 'admin') {
      return { success: false, message: 'Unauthorized. Only administrators can revoke certificates.' };
    }

    try {
      const res = await fetch(`/api/certificates/bundle/${userId}/${courseId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Failed to revoke certificate bundle.' };
      }

      await fetchCertificates();
      return { success: true, message: data.message };
    } catch {
      return { success: false, message: 'Network error while revoking certificate bundle.' };
    }
  };

  const fetchAdminRegistry = async (): Promise<{ success: boolean; students: any[]; enrollments: any[]; certificates: any[] }> => {
    if (!authToken || user.role !== 'admin') {
      return { success: false, students: [], enrollments: [], certificates: [] };
    }

    try {
      const res = await fetch('/api/certificates/admin/students', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          students: data.students || [],
          enrollments: data.enrollments || [],
          certificates: data.certificates || []
        };
      }
      return { success: false, students: [], enrollments: [], certificates: [] };
    } catch {
      return { success: false, students: [], enrollments: [], certificates: [] };
    }
  };

  const verifyCertificateById = (credentialOrId: string): Certificate | null => {
    const clean = credentialOrId.trim().toUpperCase();
    const fromUser = certificates.find(c =>
      c.certificateNumber.toUpperCase() === clean ||
      c.id.toUpperCase() === clean ||
      c.credentialId.toUpperCase() === clean
    );
    if (fromUser) return fromUser;

    return OFFICIAL_VERIFIABLE_REGISTRY.find(c =>
      c.certificateNumber.toUpperCase() === clean ||
      c.id.toUpperCase() === clean ||
      c.credentialId.toUpperCase() === clean
    ) || null;
  };

  const addLessonNote = (courseId: string, lessonId: string, lessonTitle: string, text: string, videoTime?: string) => {
    const newNote: UserNote = {
      id: `note-${Date.now()}`,
      courseId,
      lessonId,
      lessonTitle,
      text,
      timestamp: 'Just now',
      videoTime: videoTime || '02:30'
    };

    setUserProgress(prev => {
      const current = prev[courseId] || {
        courseId,
        enrolledAt: new Date().toISOString(),
        completedLessonIds: [],
        quizScores: {},
        timeSpentSeconds: 0,
        isCompleted: false,
        notes: []
      };

      return {
        ...prev,
        [courseId]: {
          ...current,
          notes: [newNote, ...(current.notes || [])]
        }
      };
    });
  };

  const deleteLessonNote = (courseId: string, noteId: string) => {
    setUserProgress(prev => {
      const current = prev[courseId];
      if (!current) return prev;
      return {
        ...prev,
        [courseId]: {
          ...current,
          notes: (current.notes || []).filter(n => n.id !== noteId)
        }
      };
    });
  };

  const openBrochure = (courseOrId?: Course | string) => {
    let targetCourse: Course | undefined;
    if (typeof courseOrId === 'string') {
      targetCourse = COURSES.find(c => c.id === courseOrId);
    } else if (courseOrId) {
      targetCourse = courseOrId;
    }
    setIsBrochureOpen(true);
  };

  const downloadBrochurePDF = (course?: Course) => {
    const targetCourse = course || COURSES[0];

    // Generate clean printable document & download
    const brochureHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MEW Academy - 1-Month Online EDA Day-by-Day Course Plan</title>
        <style>
          @page { size: A4; margin: 12mm; }
          * { box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
            color: #0f172a; 
            line-height: 1.45; 
            padding: 16px; 
            background: #ffffff; 
            max-width: 960px;
            margin: 0 auto;
          }
          .page-card { margin-bottom: 28px; page-break-after: always; }
          .header-banner { 
            background: linear-gradient(135deg, #071739 0%, #0b2447 50%, #041026 100%); 
            color: #ffffff; 
            padding: 28px; 
            border-radius: 16px; 
            margin-bottom: 20px; 
            border: 1px solid #1e293b;
          }
          .badge-top { 
            display: inline-block; 
            background: #f5a623; 
            color: #0f172a; 
            font-weight: 900; 
            font-size: 11px; 
            padding: 4px 12px; 
            border-radius: 999px; 
            text-transform: uppercase; 
            letter-spacing: 1px;
            margin-bottom: 12px;
          }
          .header-title { font-size: 26px; font-weight: 900; color: #ffffff; margin: 0 0 6px 0; line-height: 1.2; }
          .header-title span { color: #f5a623; }
          .header-sub { font-size: 13px; font-weight: 700; color: #38bdf8; margin-bottom: 14px; }
          .instructor-box { 
            display: inline-flex; 
            align-items: center; 
            gap: 12px; 
            background: rgba(30, 41, 59, 0.9); 
            border: 1px solid rgba(245, 166, 35, 0.5); 
            padding: 10px 16px; 
            border-radius: 12px; 
          }
          .instructor-name { font-weight: 900; color: #fef08a; font-size: 13px; }
          .instructor-role { color: #cbd5e1; font-size: 11px; }
          .highlights-grid { 
            display: grid; 
            grid-template-columns: repeat(3, 1fr); 
            gap: 10px; 
            margin-top: 18px; 
            padding-top: 18px; 
            border-top: 1px solid rgba(255, 255, 255, 0.15); 
          }
          .highlight-item { 
            background: rgba(15, 23, 42, 0.6); 
            border: 1px solid rgba(255, 255, 255, 0.1); 
            padding: 10px; 
            border-radius: 10px; 
            text-align: center; 
          }
          .highlight-item strong { display: block; font-size: 12px; color: #f5a623; }
          .highlight-item span { font-size: 10px; color: #cbd5e1; }
          .time-dist-box { 
            background: #f8fafc; 
            border: 1px solid #e2e8f0; 
            border-radius: 12px; 
            padding: 14px 20px; 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-bottom: 20px; 
            font-size: 12px;
          }
          .week-header { 
            color: #ffffff; 
            padding: 14px 18px; 
            border-radius: 12px 12px 0 0; 
            display: flex; 
            justify-content: space-between; 
            align-items: center;
          }
          .week-header.w1 { background: linear-gradient(135deg, #065f46 0%, #047857 100%); }
          .week-header.w2 { background: linear-gradient(135deg, #0369a1 0%, #0284c7 100%); }
          .week-header.w3 { background: linear-gradient(135deg, #6b21a8 0%, #7e22ce 100%); }
          .week-header.w4 { background: linear-gradient(135deg, #b45309 0%, #d9822b 100%); }
          .day-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; }
          .day-table th { background: #f1f5f9; padding: 8px 10px; text-align: left; border: 1px solid #cbd5e1; font-weight: 800; }
          .day-table td { padding: 8px 10px; border: 1px solid #cbd5e1; vertical-align: top; }
          .day-badge { font-weight: 800; color: #0f172a; white-space: nowrap; }
          .tag-rev { background: #fef3c7; color: #92400e; font-weight: 700; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-bottom: 2px; }
          .tag-theo { background: #e0f2fe; color: #075985; font-weight: 700; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-bottom: 2px; }
          .tag-prac { background: #dcfce7; color: #166534; font-weight: 700; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-bottom: 2px; }
          .outcome-bar { background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; padding: 8px 14px; border-radius: 8px; font-size: 11px; font-weight: 700; margin-bottom: 24px; }
          .bonus-card { background: linear-gradient(135deg, #071739 0%, #0b2447 100%); color: #ffffff; border-radius: 14px; padding: 18px; border: 1px solid #f5a623; margin-bottom: 20px; }
          .datasets-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
          .dataset-card { border: 1px solid #cbd5e1; border-radius: 10px; padding: 10px 14px; background: #f8fafc; font-size: 11px; }
          .footer-section { text-align: center; border-top: 2px solid #e2e8f0; padding-top: 16px; font-size: 11px; color: #64748b; }
        </style>
      </head>
      <body>
        
        <!-- COVER / OVERVIEW BANNER -->
        <div class="header-banner">
          <div class="badge-top">★ FROM BASICS TO INSIGHTS</div>
          <h1 class="header-title">1-MONTH ONLINE <span>EDA (EXPLORATORY DATA ANALYSIS)</span></h1>
          <div class="header-sub">DAY-BY-DAY COURSE PLAN — Learn · Analyze · Visualize · Explore · 1 Hour Live Class Every Day</div>
          
          <div class="instructor-box">
            <div>
              <div class="instructor-name">Prof. MD Tahseen Equbal</div>
              <div class="instructor-role">Course Instructor | Data Analytics &amp; EDA Specialist</div>
            </div>
          </div>

          <div class="highlights-grid">
            <div class="highlight-item"><strong>100% Online</strong><span>Live Interactive Classes</span></div>
            <div class="highlight-item"><strong>1 Month</strong><span>30 Practical Sessions</span></div>
            <div class="highlight-item"><strong>1 Hr / Day</strong><span>Structured Daily Plan</span></div>
            <div class="highlight-item"><strong>Hands-on</strong><span>Real Datasets &amp; Projects</span></div>
            <div class="highlight-item"><strong>Certificate</strong><span>On Course Completion</span></div>
            <div class="highlight-item"><strong>Doubt Support</strong><span>Weekend Sessions</span></div>
          </div>
        </div>

        <div class="time-dist-box">
          <strong style="color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">Every Class — Time Distribution (60 Minutes):</strong>
          <span style="color: #047857;">● Revision: <strong>15 min</strong></span>
          <span style="color: #0284c7;">● Theory (Concept): <strong>~15 min</strong></span>
          <span style="color: #d9822b;">● Practical (Hands-on): <strong>~30 min</strong></span>
        </div>

        <!-- WEEK 1 -->
        <div class="week-header w1">
          <div>
            <strong style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">WEEK 1 · DAYS 1–6</strong>
            <div style="font-size: 15px; font-weight: 900;">Python Basics + EDA Introduction</div>
          </div>
          <div style="font-size: 11px; background: rgba(0,0,0,0.25); padding: 4px 10px; border-radius: 6px;">
            Outcome: Write basic Python code &amp; understand the EDA workflow
          </div>
        </div>
        <table class="day-table">
          <thead>
            <tr>
              <th style="width: 18%;">Day &amp; Topic</th>
              <th style="width: 26%;">Revision (15m)</th>
              <th style="width: 28%;">Theory (15m)</th>
              <th style="width: 28%;">Practical Hands-on (30m)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="day-badge">Day 1</span><br>Python Setup &amp; Variables</td>
              <td><span class="tag-rev">REVISION</span><br>Course overview, why EDA matters, installing Anaconda &amp; Jupyter</td>
              <td><span class="tag-theo">THEORY</span><br>Variables, data types (int, float, str, bool), type casting</td>
              <td><span class="tag-prac">PRACTICAL</span><br>Set up Jupyter; write first notebook; create &amp; print variables</td>
            </tr>
            <tr>
              <td><span class="day-badge">Day 2</span><br>Operators &amp; I/O</td>
              <td><span class="tag-rev">REVISION</span><br>Recap variables &amp; data types with quick quiz</td>
              <td><span class="tag-theo">THEORY</span><br>Arithmetic, comparison, logical operators; input() &amp; print() formatting</td>
              <td><span class="tag-prac">PRACTICAL</span><br>Build a simple calculator; take user input and format output</td>
            </tr>
            <tr>
              <td><span class="day-badge">Day 3</span><br>Conditionals &amp; Loops</td>
              <td><span class="tag-rev">REVISION</span><br>Recap operators &amp; I/O with a coding exercise</td>
              <td><span class="tag-theo">THEORY</span><br>if / elif / else; for &amp; while loops; break &amp; continue</td>
              <td><span class="tag-prac">PRACTICAL</span><br>Number patterns, grade calculator, loop-based practice problems</td>
            </tr>
            <tr>
              <td><span class="day-badge">Day 4</span><br>Lists, Tuples, Dicts, Sets</td>
              <td><span class="tag-rev">REVISION</span><br>Recap loops &amp; conditionals with mini coding task</td>
              <td><span class="tag-theo">THEORY</span><br>Creating &amp; using lists, tuples, dictionaries, sets; common methods</td>
              <td><span class="tag-prac">PRACTICAL</span><br>Build student-marks dictionary; practice indexing &amp; nested lists</td>
            </tr>
            <tr>
              <td><span class="day-badge">Day 5</span><br>Functions &amp; File I/O</td>
              <td><span class="tag-rev">REVISION</span><br>Recap data structures with a quick challenge</td>
              <td><span class="tag-theo">THEORY</span><br>Defining functions, parameters &amp; return; string methods; file reading</td>
              <td><span class="tag-prac">PRACTICAL</span><br>Write reusable functions; clean a text string; read .csv into Python</td>
            </tr>
            <tr>
              <td><span class="day-badge">Day 6</span><br>Introduction to EDA</td>
              <td><span class="tag-rev">REVISION</span><br>Full Week 1 rapid-fire revision quiz</td>
              <td><span class="tag-theo">THEORY</span><br>What is EDA? The EDA workflow (Raw Data → Understand → Clean → Explore → Analyze → Visualize → Report)</td>
              <td><span class="tag-prac">PRACTICAL</span><br>Explore a small sample dataset using only core Python; note insights</td>
            </tr>
          </tbody>
        </table>

        <!-- WEEK 2 -->
        <div class="week-header w2">
          <div>
            <strong style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">WEEK 2 · DAYS 7–12</strong>
            <div style="font-size: 15px; font-weight: 900;">NumPy + Pandas (Data Wrangling)</div>
          </div>
          <div style="font-size: 11px; background: rgba(0,0,0,0.25); padding: 4px 10px; border-radius: 6px;">
            Outcome: Clean, manipulate &amp; prepare data using NumPy &amp; Pandas
          </div>
        </div>
        <table class="day-table">
          <thead>
            <tr>
              <th style="width: 18%;">Day &amp; Topic</th>
              <th style="width: 26%;">Revision (15m)</th>
              <th style="width: 28%;">Theory (15m)</th>
              <th style="width: 28%;">Practical Hands-on (30m)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="day-badge">Day 7</span><br>NumPy Arrays &amp; Slicing</td>
              <td><span class="tag-rev">REVISION</span><br>Recap Week 1 basics (functions, loops, data structures)</td>
              <td><span class="tag-theo">THEORY</span><br>Creating NumPy arrays, shapes/dimensions, indexing &amp; slicing</td>
              <td><span class="tag-prac">PRACTICAL</span><br>Create 1D/2D arrays; practice slicing, reshaping &amp; boolean indexing</td>
            </tr>
            <tr>
              <td><span class="day-badge">Day 8</span><br>NumPy Math &amp; Stats</td>
              <td><span class="tag-rev">REVISION</span><br>Recap arrays &amp; indexing with quick exercise</td>
              <td><span class="tag-theo">THEORY</span><br>mean, median, std, sum, min/max, broadcasting, vectorized ops</td>
              <td><span class="tag-prac">PRACTICAL</span><br>Compute statistics on a numeric dataset using NumPy functions</td>
            </tr>
            <tr>
              <td><span class="day-badge">Day 9</span><br>Pandas Series &amp; DF</td>
              <td><span class="tag-rev">REVISION</span><br>Recap NumPy statistical operations</td>
              <td><span class="tag-theo">THEORY</span><br>Pandas Series vs DataFrame; importing CSV/Excel files</td>
              <td><span class="tag-prac">PRACTICAL</span><br>Import Sales Dataset into Pandas; create DataFrames from scratch</td>
            </tr>
            <tr>
              <td><span class="day-badge">Day 10</span><br>Filtering &amp; Sorting</td>
              <td><span class="tag-rev">REVISION</span><br>Recap importing data &amp; DataFrame basics</td>
              <td><span class="tag-theo">THEORY</span><br>head(), tail(), info(), describe(); column/row selection; filtering</td>
              <td><span class="tag-prac">PRACTICAL</span><br>Explore Sales Dataset structure; filter &amp; sort top-selling products</td>
            </tr>
            <tr>
              <td><span class="day-badge">Day 11</span><br>Missing Data &amp; Types</td>
              <td><span class="tag-rev">REVISION</span><br>Recap selecting &amp; filtering data</td>
              <td><span class="tag-theo">THEORY</span><br>isnull(), fillna(), dropna(); drop_duplicates(); astype()</td>
              <td><span class="tag-prac">PRACTICAL</span><br>Clean Student Dataset: handle missing marks, remove duplicate rows</td>
            </tr>
            <tr>
              <td><span class="day-badge">Day 12</span><br>GroupBy &amp; Mini Project</td>
              <td><span class="tag-rev">REVISION</span><br>Full Week 2 rapid-fire revision quiz</td>
              <td><span class="tag-theo">THEORY</span><br>groupby() &amp; aggregation; merge/join/concat; date &amp; time columns</td>
              <td><span class="tag-prac">PRACTICAL</span><br>Mini Project: Combine &amp; group Sales Dataset by region/date</td>
            </tr>
          </tbody>
        </table>

        <!-- WEEK 3 -->
        <div class="week-header w3">
          <div>
            <strong style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">WEEK 3 · DAYS 13–18</strong>
            <div style="font-size: 15px; font-weight: 900;">Data Visualization (Matplotlib + Seaborn)</div>
          </div>
          <div style="font-size: 11px; background: rgba(0,0,0,0.25); padding: 4px 10px; border-radius: 6px;">
            Outcome: Visualize data beautifully &amp; extract meaningful insights
          </div>
        </div>
        <table class="day-table">
          <thead>
            <tr>
              <th style="width: 18%;">Day &amp; Topic</th>
              <th style="width: 26%;">Revision (15m)</th>
              <th style="width: 28%;">Theory (15m)</th>
              <th style="width: 28%;">Practical Hands-on (30m)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="day-badge">Day 13</span><br>Matplotlib Line &amp; Bar</td>
              <td><span class="tag-rev">REVISION</span><br>Recap Pandas GroupBy &amp; aggregation from Week 2</td>
              <td><span class="tag-theo">THEORY</span><br>Matplotlib figure/axes basics; line plots; bar plots</td>
              <td><span class="tag-prac">PRACTICAL</span><br>Plot monthly sales trend (line) and top products (bar)</td>
            </tr>
            <tr>
              <td><span class="day-badge">Day 14</span><br>Pie, Hist &amp; Scatter</td>
              <td><span class="tag-rev">REVISION</span><br>Recap line &amp; bar plots</td>
              <td><span class="tag-theo">THEORY</span><br>Pie charts for proportions; histograms for distribution; scatter plots</td>
              <td><span class="tag-prac">PRACTICAL</span><br>Visualize customer segments, mark distributions &amp; price vs quantity</td>
            </tr>
            <tr>
              <td><span class="day-badge">Day 15</span><br>Box Plots &amp; Subplots</td>
              <td><span class="tag-rev">REVISION</span><br>Recap pie/histogram/scatter charts</td>
              <td><span class="tag-theo">THEORY</span><br>Box plots for spread &amp; outliers; subplots; titles, labels &amp; legends</td>
              <td><span class="tag-prac">PRACTICAL</span><br>Build a multi-chart dashboard with subplots &amp; clear labels</td>
            </tr>
            <tr>
              <td><span class="day-badge">Day 16</span><br>Seaborn Countplot</td>
              <td><span class="tag-rev">REVISION</span><br>Recap Matplotlib box plots &amp; subplots</td>
              <td><span class="tag-theo">THEORY</span><br>Why Seaborn; styling themes; countplot for categorical frequency</td>
              <td><span class="tag-prac">PRACTICAL</span><br>Count pass/fail students and customer categories using countplot</td>
            </tr>
            <tr>
              <td><span class="day-badge">Day 17</span><br>Heatmaps &amp; Pairplots</td>
              <td><span class="tag-rev">REVISION</span><br>Recap Seaborn countplot</td>
              <td><span class="tag-theo">THEORY</span><br>Boxplot &amp; violinplot; correlation heatmap; pairplot relationships</td>
              <td><span class="tag-prac">PRACTICAL</span><br>Build correlation heatmap &amp; pairplot on E-Commerce Dataset</td>
            </tr>
            <tr>
              <td><span class="day-badge">Day 18</span><br>Outliers &amp; Insights</td>
              <td><span class="tag-rev">REVISION</span><br>Full Week 3 rapid-fire revision quiz</td>
              <td><span class="tag-theo">THEORY</span><br>Reading distributions; interpreting correlation; detecting outliers</td>
              <td><span class="tag-prac">PRACTICAL</span><br>Full visual analysis of one dataset — summarize 3 key insights</td>
            </tr>
          </tbody>
        </table>

        <!-- WEEK 4 -->
        <div class="week-header w4">
          <div>
            <strong style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">WEEK 4 · DAYS 19–30</strong>
            <div style="font-size: 15px; font-weight: 900;">Excel + Complete EDA Project + Power BI Bonus</div>
          </div>
          <div style="font-size: 11px; background: rgba(0,0,0,0.25); padding: 4px 10px; border-radius: 6px;">
            Outcome: Perform EDA using Excel &amp; Python and deliver a complete project
          </div>
        </div>
        <table class="day-table">
          <thead>
            <tr>
              <th style="width: 18%;">Day &amp; Topic</th>
              <th style="width: 26%;">Revision (15m)</th>
              <th style="width: 28%;">Theory (15m)</th>
              <th style="width: 28%;">Practical Hands-on (30m)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="day-badge">Day 19</span><br>Excel Data Cleaning</td>
              <td><span class="tag-rev">REVISION</span><br>Recap Week 3 visualization &amp; insights</td>
              <td><span class="tag-theo">THEORY</span><br>Cleaning raw data in Excel; sort/filter; conditional formatting</td>
              <td><span class="tag-prac">PRACTICAL</span><br>Clean Student Dataset in Excel; highlight top/low performers</td>
            </tr>
            <tr>
              <td><span class="day-badge">Day 20</span><br>Formulas &amp; Pivot Tables</td>
              <td><span class="tag-rev">REVISION</span><br>Recap Excel cleaning &amp; formatting</td>
              <td><span class="tag-theo">THEORY</span><br>SUM, IF, COUNTIF, VLOOKUP; building &amp; reading Pivot Tables</td>
              <td><span class="tag-prac">PRACTICAL</span><br>Summarize Sales Dataset with formulas; build Pivot Tables</td>
            </tr>
            <tr>
              <td><span class="day-badge">Day 21</span><br>Excel Dashboard</td>
              <td><span class="tag-rev">REVISION</span><br>Recap formulas &amp; pivot tables</td>
              <td><span class="tag-theo">THEORY</span><br>Chart types in Excel; combining charts + pivot tables</td>
              <td><span class="tag-prac">PRACTICAL</span><br>Build a one-page Excel dashboard for Sales Dataset</td>
            </tr>
            <tr>
              <td><span class="day-badge">Day 22</span><br>Capstone Project: Pt 1</td>
              <td><span class="tag-rev">REVISION</span><br>Recap full Python + Excel workflow so far</td>
              <td><span class="tag-theo">THEORY</span><br>Project brief: E-Commerce Customer Dataset — problem statement</td>
              <td><span class="tag-prac">PRACTICAL</span><br>Load dataset in Python, understand columns, clean missing data</td>
            </tr>
            <tr>
              <td><span class="day-badge">Day 23</span><br>Capstone Project: Pt 2</td>
              <td><span class="tag-rev">REVISION</span><br>Recap dataset understanding &amp; cleaning</td>
              <td><span class="tag-theo">THEORY</span><br>Structuring EDA report: analysis → visuals → insights → recommendations</td>
              <td><span class="tag-prac">PRACTICAL</span><br>Full EDA: customer segmentation &amp; RFM analysis, document insights</td>
            </tr>
            <tr>
              <td><span class="day-badge">Day 30</span><br>Power BI &amp; Certification</td>
              <td><span class="tag-rev">REVISION</span><br>Recap complete EDA project findings</td>
              <td><span class="tag-theo">THEORY</span><br>Power BI interface, importing data, relationships, DAX measures</td>
              <td><span class="tag-prac">PRACTICAL</span><br>Build Power BI dashboard; final presentation &amp; course certificate</td>
            </tr>
          </tbody>
        </table>

        <!-- BONUS MODULE & DATASETS -->
        <div class="bonus-card">
          <div style="font-size: 11px; text-transform: uppercase; color: #f5a623; font-weight: 800;">★ Bonus Module Included Free</div>
          <h3 style="font-size: 16px; margin: 4px 0 8px 0; color: #ffffff;">Power BI (Dashboard &amp; Reporting)</h3>
          <div style="font-size: 11px; color: #cbd5e1; line-height: 1.6;">
            Power BI Interface • Importing Data • Power Query Basics • Data Cleaning • Relationships Between Tables • Basic DAX Measures • Interactive Visualizations • Filters &amp; Slicers • Dashboard Creation • Publish &amp; Sharing
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <strong style="font-size: 12px; text-transform: uppercase; color: #0f172a; display: block; margin-bottom: 8px;">3 Real-World Datasets Used:</strong>
          <div class="datasets-grid">
            <div class="dataset-card"><strong style="color: #047857;">1. Sales Dataset</strong><br><span style="color: #64748b;">Trends, best-selling products &amp; sales insights</span></div>
            <div class="dataset-card"><strong style="color: #0284c7;">2. Student Dataset</strong><br><span style="color: #64748b;">Performance, subject marks &amp; pass/fail analysis</span></div>
            <div class="dataset-card"><strong style="color: #7e22ce;">3. E-Commerce Dataset</strong><br><span style="color: #64748b;">Customer segmentation &amp; RFM analysis</span></div>
          </div>
        </div>

        <!-- SUMMARY & CONTACT -->
        <div style="background: #071739; color: #ffffff; padding: 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <div>
            <div style="font-size: 10px; color: #f5a623; font-weight: 800; text-transform: uppercase;">1-Month Online Live EDA Masterclass</div>
            <div style="font-size: 20px; font-weight: 900; color: #ffffff;">Special Fee: ₹1,599 <span style="font-size: 12px; color: #94a3b8; text-decoration: line-through;">₹2,999</span></div>
            <div style="font-size: 11px; color: #cbd5e1; margin-top: 4px;">Enroll online: <strong>mewacademy.com</strong> | WhatsApp: <strong>+91 7070806047</strong> | Bhopal, India</div>
          </div>
          <div style="text-align: right; font-size: 11px; color: #38bdf8;">
            <div>Official MEW Certificate</div>
            <div style="color: #fef08a;">Prof. MD Tahseen Equbal</div>
          </div>
        </div>

        <div class="footer-section">
          MEW Academy — Make • Explore • Win. | Official Verified Curriculum Document | mewacademy.ac@gmail.com | Bhopal, India
        </div>

      </body>
      </html>
    `;

    const blob = new Blob([brochureHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MEW_Academy_1-Month_EDA_Day-by-Day_Course_Plan.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Aggregated analytics
  const platformAnalytics: PlatformAnalytics = {
    totalStudents: 5840,
    activeLearners: 1420,
    totalCertificatesIssued: 940,
    courseCompletionRate: 88.4,
    totalRevenueINR: 4892000,
    weeklyLearningHours: [
      { day: 'Mon', hours: 2.4, lessons: 3 },
      { day: 'Tue', hours: 3.8, lessons: 5 },
      { day: 'Wed', hours: 4.2, lessons: 6 },
      { day: 'Thu', hours: 1.9, lessons: 2 },
      { day: 'Fri', hours: 3.5, lessons: 4 },
      { day: 'Sat', hours: 5.6, lessons: 8 },
      { day: 'Sun', hours: 4.1, lessons: 6 }
    ],
    quizPerformanceDistribution: [
      { range: '90-100% (A+)', count: 68 },
      { range: '80-89% (A)', count: 22 },
      { range: '70-79% (B)', count: 8 },
      { range: 'Under 70%', count: 2 }
    ],
    skillMastery: [
      { skill: 'SQL & Database Optimization', masteryPercentage: 92 },
      { skill: 'Python Data Science (Pandas/NumPy)', masteryPercentage: 86 },
      { skill: 'Power BI & Tableau Dashboarding', masteryPercentage: 88 },
      { skill: 'Exploratory Data Analysis', masteryPercentage: 90 },
      { skill: 'Statistical Hypothesis Testing', masteryPercentage: 82 }
    ]
  };

  return (
    <AcademyContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedCourseId,
        setSelectedCourseId,
        selectedLessonId,
        setSelectedLessonId,
        isCheckoutOpen,
        setIsCheckoutOpen,
        checkoutCourse,
        setCheckoutCourse,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal,
        isVideoIntroOpen,
        setIsVideoIntroOpen,
        isBrochureOpen,
        setIsBrochureOpen,
        openBrochure,
        downloadBrochurePDF,
        activeCertificateModal,
        setActiveCertificateModal,
        currency,
        setCurrency,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        isLoggedIn,
        user,
        setUser,
        toggleUserRole,
        login,
        register,
        registerSendOtp,
        registerVerifyOtp,
        registerResendOtp,
        forgotPassword,
        resetPassword,
        logout,
        adminLogin,
        adminChangePassword,
        loginWithOAuth,
        loginWithGoogleCredential,
        loginWithGoogleAccessToken,
        quickDemoLogin,
        authToken,
        courses: COURSES,
        enrolledCourseIds,
        pendingCourseIds,
        isPendingApproval,
        userProgress,
        certificates,
        transactions,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        isEnrolled,
        startCheckout,
        processPayment,
        submitPaymentProof,
        fetchPendingPayments,
        approvePendingPayment,
        rejectPendingPayment,
        openCoursePlayer,
        openCourseDetail,
        markLessonComplete,
        toggleLessonComplete,
        submitQuizScore,
        generateCertificateForCourse,
        verifyCertificateById,
        fetchCertificates,
        issueCertificateAdmin,
        revokeCertificateAdmin,
        revokeCertificateBundleAdmin,
        fetchAdminRegistry,
        addLessonNote,
        deleteLessonNote,
        getCourseProgress,
        triggerConfetti,
        platformAnalytics
      }}
    >
      {children}
    </AcademyContext.Provider>
  );
};

export const useAcademy = () => {
  const context = useContext(AcademyContext);
  if (!context) {
    throw new Error('useAcademy must be used within an AcademyProvider');
  }
  return context;
};
