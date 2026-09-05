import React, { useState } from 'react';
import { Certificate } from '../types';
import { MewLogo } from './MewLogo';
import { 
  X, 
  Printer, 
  Download, 
  Share2, 
  CheckCircle2, 
  Award, 
  ShieldCheck, 
  Copy, 
  ExternalLink,
  QrCode
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  const { user } = useAcademy();
  const [copied, setCopied] = useState(false);

  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(certificate.verificationUrl || `https://mewacademy.com/verify/${certificate.certificateNumber}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareLinkedIn = () => {
    const text = `Proud to announce that I have successfully completed "${certificate.courseTitle}" from MEW Academy! Credential ID: ${certificate.certificateNumber}`;
    const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Modal Action Header (Excluded from Print) */}
        <div className="no-print bg-slate-950 text-white px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
          <div className="flex items-center gap-2 min-w-0">
            <Award className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <span className="font-bold text-xs sm:text-sm truncate">Official Verifiable Certificate</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <button
              onClick={handlePrint}
              className="px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] sm:text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              <span className="hidden xs:inline">Print / PDF</span>
            </button>

            <button
              onClick={handleShareLinkedIn}
              className="px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-[11px] sm:text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">LinkedIn</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Render Area Container with smooth horizontal scroll for mobile */}
        <div className="overflow-x-auto">
          <div 
            id="certificate-print-area"
            className="min-w-[580px] sm:min-w-0 p-5 sm:p-10 md:p-12 bg-gradient-to-br from-amber-50/50 via-white to-amber-100/30 relative select-none"
          >
            {/* Certificate Inner Ornamental Border */}
            <div className="border-[4px] sm:border-[6px] border-double border-amber-900/30 rounded-2xl p-5 sm:p-8 md:p-10 relative bg-white/95 backdrop-blur-sm shadow-inner text-center">
              
              {/* Corner flourishes */}
              <div className="absolute top-2 left-2 w-6 sm:w-8 h-6 sm:h-8 border-t-2 border-l-2 border-amber-800"></div>
              <div className="absolute top-2 right-2 w-6 sm:w-8 h-6 sm:h-8 border-t-2 border-r-2 border-amber-800"></div>
              <div className="absolute bottom-2 left-2 w-6 sm:w-8 h-6 sm:h-8 border-b-2 border-l-2 border-amber-800"></div>
              <div className="absolute bottom-2 right-2 w-6 sm:w-8 h-6 sm:h-8 border-b-2 border-r-2 border-amber-800"></div>

              {/* Top Logo & Academy Header with Official MEW Logo */}
              <div className="space-y-2 mb-4 sm:mb-6 flex flex-col items-center justify-center">
                <MewLogo variant="horizontal" size="md" theme="light" showMotto={true} />
                <p className="text-[9px] sm:text-[10px] tracking-[0.25em] text-slate-500 font-bold uppercase mt-1">
                  INSTITUTE OF APPLIED TECHNOLOGY & DATA SCIENCES
                </p>
              </div>

              {/* Certificate Title & Series Identifier */}
              <div className="my-3 sm:my-5">
                {certificate.certificateIndex && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 border shadow-xs"
                    style={{
                      backgroundColor: certificate.isFlagship ? '#fef3c7' : '#f0f9ff',
                      color: certificate.isFlagship ? '#92400e' : '#0369a1',
                      borderColor: certificate.isFlagship ? '#f59e0b' : '#38bdf8'
                    }}
                  >
                    <span>🏆 Certificate {certificate.certificateIndex} of 3</span>
                    <span>•</span>
                    <span>{certificate.badgeTitle || (certificate.isFlagship ? 'Flagship Credential' : 'Specialized Track')}</span>
                  </div>
                )}

                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-slate-900 tracking-wide uppercase">
                  {certificate.isFlagship ? 'Professional Certificate in Data Analytics' : 'Certificate of Completion'}
                </h2>
                <p className="text-[11px] sm:text-xs text-amber-800 font-bold tracking-wider uppercase mt-1">
                  THIS IS PROUDLY CONFERRED UPON
                </p>
              </div>

              {/* Student Name */}
              <div className="my-3 sm:my-4 pb-2 border-b-2 border-amber-500/40 inline-block min-w-[240px] sm:min-w-[280px]">
                <span className="text-2xl sm:text-3xl md:text-4xl font-serif italic font-bold text-slate-950">
                  {certificate.recipientName}
                </span>
              </div>

              {/* Completion Description */}
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed my-2 sm:my-3">
                for successfully completing the rigorous curriculum, hands-on masterclass requirements, and industrial projects for <br />
                <strong className="text-slate-900 font-bold text-sm sm:text-base font-serif block mt-1">
                  "{certificate.courseTitle}"
                </strong>
                {certificate.covers && (
                  <span className="inline-block mt-1 text-[11px] font-semibold text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
                    Covers: {certificate.covers}
                  </span>
                )}
              </p>

              <div className="my-2">
                <span className="font-bold text-xs text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  Graduated with {certificate.grade} ({certificate.overallScore}% Grade)
                </span>
              </div>

              {/* Skills Verified Pills */}
              <div className="flex flex-wrap justify-center gap-1.5 max-w-lg mx-auto my-3 sm:my-4">
                {(certificate.skillsVerified || []).map((skill, i) => (
                  <span key={i} className="text-[9px] sm:text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 sm:px-2.5 py-0.5 rounded-full border border-slate-200">
                    ✓ {skill}
                  </span>
                ))}
              </div>

              {/* Bottom Signatures & Seal Grid */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 sm:pt-8 mt-4 sm:mt-6 border-t border-slate-200/80 items-end">
                {/* Left: Issue Date */}
                <div className="text-left space-y-1">
                  <div className="text-[11px] sm:text-xs font-bold text-slate-900">{certificate.issueDate}</div>
                  <div className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-wider">Date of Issue</div>
                </div>

                {/* Center: Gold Foil Stamp */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 p-1 shadow-lg shadow-amber-500/30 flex items-center justify-center text-slate-950 text-center">
                    <div className="w-full h-full rounded-full border-2 border-dashed border-amber-900/40 flex flex-col items-center justify-center">
                      <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-amber-950" />
                      <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-tighter text-amber-950">VERIFIED</span>
                    </div>
                  </div>
                </div>

                {/* Right: Instructor Signature */}
                <div className="text-right space-y-1">
                  <div className="font-serif italic font-bold text-sm sm:text-base md:text-lg text-slate-900 truncate">
                    {certificate.instructorName}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-wider truncate">
                    {certificate.instructorTitle}
                  </div>
                </div>
              </div>

              {/* Credential Number & Verification Hash Footer */}
              <div className="mt-4 sm:mt-6 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[9px] sm:text-[10px] text-slate-400 font-mono gap-1.5 sm:gap-2">
                <span>Credential ID: <strong className="text-slate-700">{certificate.certificateNumber}</strong></span>
                <span>Verification Hash: {(certificate.verificationHash || '8f92b7c4a1e95632d847b201f65c9183').slice(0, 16)}...</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar Controls (Excluded from Print) */}
        <div className="no-print p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 font-medium text-[11px] sm:text-xs">
            <ShieldCheck className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>Cryptographically sealed & verifiable on MEW Ledger</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopyLink}
              className="flex-1 sm:flex-none px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-[11px] sm:text-xs"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors cursor-pointer text-[11px] sm:text-xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
