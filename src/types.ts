export interface Instructor {
  id: string;
  name: string;
  title: string;
  experience: string;
  company: string;
  avatar: string;
  bio: string;
  linkedin: string;
  twitter: string;
  rating: number;
  studentsCount: number;
  coursesCount: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface LessonResource {
  name: string;
  type: 'pdf' | 'code' | 'dataset' | 'link';
  size?: string;
  url: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  durationSeconds: number;
  videoUrl?: string;
  previewUrl?: string;
  summary: string;
  isPreview?: boolean;
  contentMarkdown?: string;
  resources?: LessonResource[];
  quiz?: QuizQuestion[];
  codingTask?: {
    title: string;
    instructions: string;
    starterCode: string;
    solutionCode: string;
    hints: string[];
  };
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface CourseReview {
  id: string;
  userName: string;
  userRole: string;
  rating: number;
  date: string;
  comment: string;
  avatar: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  tag?: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  priceINR: number;
  originalPriceINR: number;
  priceUSD: number;
  originalPriceUSD: number;
  rating: number;
  reviewsCount: number;
  level: string;
  durationHours: number;
  totalLessons: number;
  totalProjects: number;
  certificateIncluded: boolean;
  lifetimeAccess: boolean;
  thumbnail: string;
  instructor: Instructor;
  features: string[];
  skillsGained: string[];
  prerequisites: string[];
  modules: CourseModule[];
  reviews: CourseReview[];
  faqs: { question: string; answer: string }[];
}

export interface UserNote {
  id: string;
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  text: string;
  timestamp: string;
  videoTime?: string;
}

export interface UserProgress {
  courseId: string;
  enrolledAt: string;
  completedLessonIds: string[];
  lastAccessedLessonId?: string;
  quizScores: Record<string, number>; // lessonId -> percentage score
  timeSpentSeconds: number;
  isCompleted: boolean;
  completedAt?: string;
  certificateId?: string;
  notes: UserNote[];
}

export interface Certificate {
  id: string;
  certificateNumber: string; // e.g. MEW-2026-DA-8942
  recipientName: string;
  recipientEmail: string;
  courseId: string;
  courseTitle: string;
  category: string;
  instructorName: string;
  instructorTitle: string;
  issueDate: string;
  grade: 'Distinction' | 'High Honors' | 'Excellence' | 'Passed';
  overallScore: number;
  skillsVerified: string[];
  verificationUrl: string;
  credentialId: string;
  certificateIndex?: number; // 1 to 5
  badgeTitle?: string;
  covers?: string;
  isFlagship?: boolean;
  verificationHash?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'student' | 'instructor' | 'admin';
  headline: string;
  streakDays: number;
  totalHoursLearned: number;
  xpPoints: number;
  joinedDate: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  currency: 'INR' | 'USD';
  gateway: 'UPI' | 'Razorpay / UPI' | 'Stripe (Card)' | 'PayPal' | 'NetBanking';
  paymentMethodDetails: string;
  discountApplied: number;
  couponCode?: string;
  utrNumber?: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'PENDING_APPROVAL';
  date: string;
  receiptUrl: string;
}

export interface PendingPayment {
  transactionId: string;
  orderId: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  currency: string;
  utrNumber: string;
  couponCode?: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studentAvatar: string;
  createdAt: string;
}

export interface PlatformAnalytics {
  totalStudents: number;
  activeLearners: number;
  totalCertificatesIssued: number;
  courseCompletionRate: number;
  totalRevenueINR: number;
  weeklyLearningHours: { day: string; hours: number; lessons: number }[];
  quizPerformanceDistribution: { range: string; count: number }[];
  skillMastery: { skill: string; masteryPercentage: number }[];
}
