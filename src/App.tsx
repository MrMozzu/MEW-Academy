import React from 'react';
import { AcademyProvider, useAcademy } from './context/AcademyContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturedCourseSection } from './components/FeaturedCourseSection';
import { InstructorsSection } from './components/InstructorsSection';
import { WhyChooseSection } from './components/WhyChooseSection';
import { LearningJourneySection } from './components/LearningJourneySection';
import { ContactSection } from './components/ContactSection';
import { CourseCatalog } from './components/CourseCatalog';
import { CourseDetailView } from './components/CourseDetailView';
import { DashboardView } from './components/DashboardView';
import { AnalyticsView } from './components/AnalyticsView';
import { CertificatesView } from './components/CertificatesView';
import { AdminCertificatePortal } from './components/AdminCertificatePortal';
import { Footer } from './components/Footer';
import { CheckoutModal } from './components/CheckoutModal';
import { CertificateModal } from './components/CertificateModal';
import { BrochureModal } from './components/BrochureModal';
import { AuthModal } from './components/AuthModal';

const MainAppContent: React.FC = () => {
  const { activeView, activeCertificateModal, setActiveCertificateModal } = useAcademy();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-[#d9822b] selection:text-white">
      {/* Universal Navigation Header with Mobile Website Menu */}
      <Navbar />

      {/* Dynamic View Controller */}
      <main className="flex-1">
        {activeView === 'home' && (
          <div>
            <HeroSection />
            <FeaturedCourseSection />
            <InstructorsSection />
            <WhyChooseSection />
            <LearningJourneySection />
            <ContactSection />
          </div>
        )}

        {activeView === 'courses' && <CourseCatalog />}
        {activeView === 'course-detail' && <CourseDetailView />}
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'analytics' && <AnalyticsView />}
        {activeView === 'certificates' && <CertificatesView />}
        {activeView === 'admin' && <AdminCertificatePortal />}
      </main>

      {/* Universal Footer */}
      <Footer />

      {/* Global Modals */}
      <CheckoutModal />
      <CertificateModal
        certificate={activeCertificateModal}
        onClose={() => setActiveCertificateModal(null)}
      />
      <BrochureModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AcademyProvider>
      <MainAppContent />
    </AcademyProvider>
  );
}
