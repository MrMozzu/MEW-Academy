import React, { useState } from 'react';
import { useAcademy, OFFICIAL_VERIFIABLE_REGISTRY } from '../context/AcademyContext';
import { 
  Award, 
  ShieldCheck, 
  Search, 
  CheckCircle, 
  ExternalLink, 
  Download, 
  Share2, 
  Sparkles,
  AlertCircle,
  FileText,
  Copy,
  Check,
  GraduationCap,
  BookOpen
} from 'lucide-react';
import { Certificate } from '../types';

export const CertificatesView: React.FC = () => {
  const { certificates, setActiveCertificateModal, verifyCertificateById, setActiveView } = useAcademy();
  const [verifyInput, setVerifyInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<{ searched: boolean; cert: Certificate | null }>({
    searched: false,
    cert: null
  });

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyInput.trim()) return;
    const found = verifyCertificateById(verifyInput);
    setVerificationResult({
      searched: true,
      cert: found
    });
  };

  const handleQuickVerify = (id: string) => {
    setVerifyInput(id);
    const found = verifyCertificateById(id);
    setVerificationResult({
      searched: true,
      cert: found
    });
  };

  const handleCopyLink = (cert: Certificate) => {
    navigator.clipboard.writeText(cert.verificationUrl);
    setCopiedId(cert.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const sampleTestCerts = certificates.length > 0 ? certificates : OFFICIAL_VERIFIABLE_REGISTRY;

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header with 3-in-1 Architecture Badge */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100/90 border border-amber-300 px-3.5 py-1.5 rounded-full shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>3 Industry Certificates from 1 Single Course</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Industry Accredited Credentials &amp; Verification
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            MEW Academy awards <strong>3 distinct verifiable credentials</strong> for our flagship program — validating modular mastery in Python Data Analytics, Data Visualization &amp; Business Intelligence, and the comprehensive Flagship Professional Certificate.
          </p>
        </div>

        {/* 3-Certificate Structure Highlight Grid */}
        <div className="bg-gradient-to-br from-[#071739] via-[#0b2447] to-[#041026] text-white p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-700/80">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold">🏆 OFFICIAL ACCREDITATION FRAMEWORK</span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                Recommended 3-Certificate Pathway
              </h2>
            </div>
            <div className="text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 font-semibold">
              Course Director: <span className="text-amber-300 font-bold">Prof. MD Tahseen Equbal</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cert 1 */}
            <div className="bg-slate-900/80 border border-slate-700/90 rounded-2xl p-5 flex flex-col justify-between hover:border-sky-400/60 transition-all space-y-3">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-sky-300 bg-sky-950 px-2.5 py-1 rounded border border-sky-800">
                  Certificate 1
                </span>
                <h3 className="text-base font-bold text-white">Certificate in Python for Data Analytics</h3>
                <p className="text-xs text-slate-300 font-mono">
                  <strong className="text-slate-400 font-sans">Covers:</strong> Python • NumPy • Pandas
                </p>
              </div>
              <div className="pt-3 border-t border-slate-800 text-xs text-slate-400">
                Core Data Wrangling &amp; Vectorized Computation
              </div>
            </div>

            {/* Cert 2 */}
            <div className="bg-slate-900/80 border border-slate-700/90 rounded-2xl p-5 flex flex-col justify-between hover:border-purple-400/60 transition-all space-y-3">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-purple-300 bg-purple-950 px-2.5 py-1 rounded border border-purple-800">
                  Certificate 2
                </span>
                <h3 className="text-base font-bold text-white">Certificate in Data Visualization &amp; BI</h3>
                <p className="text-xs text-slate-300 font-mono">
                  <strong className="text-slate-400 font-sans">Covers:</strong> Matplotlib • Seaborn • Excel • Power BI
                </p>
              </div>
              <div className="pt-3 border-t border-slate-800 text-xs text-slate-400">
                Visual Analytics, Dashboards &amp; Storytelling
              </div>
            </div>

            {/* Cert 3 (Flagship) */}
            <div className="bg-gradient-to-b from-amber-950/80 to-slate-900 border-2 border-amber-400 rounded-2xl p-5 flex flex-col justify-between shadow-lg shadow-amber-950/40 relative space-y-3">
              <div className="absolute -top-2.5 right-3 bg-amber-400 text-slate-950 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-tight">
                FLAGSHIP 🏆
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-amber-300 bg-amber-950 px-2.5 py-1 rounded border border-amber-700">
                  Certificate 3 • Flagship
                </span>
                <h3 className="text-base font-black text-amber-300">Professional Certificate in Data Analytics</h3>
                <p className="text-xs text-amber-100 font-mono">
                  <strong className="text-amber-400/80 font-sans">Covers:</strong> Python • NumPy • Pandas • Visualization • Excel • Power BI • Projects
                </p>
              </div>
              <div className="pt-3 border-t border-amber-800/60 text-xs text-amber-200/90 font-bold">
                Full-Stack Program Credential &amp; Capstone
              </div>
            </div>
          </div>
        </div>

        {/* Public Live Verification Portal Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <h2>Live Certificate Verification Engine</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
            Employers, recruiters, and academic institutions can verify any MEW Academy credential instantly. Enter any credential ID below or click one of the sample test chips.
          </p>

          {/* Quick test chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-slate-500">Sample Registry IDs:</span>
            {sampleTestCerts.map(c => (
              <button
                key={c.id}
                onClick={() => handleQuickVerify(c.certificateNumber)}
                className="text-[11px] font-mono font-bold bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              >
                {c.certificateNumber} ({c.badgeTitle || 'Cert'})
              </button>
            ))}
          </div>

          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-2 pt-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={verifyInput}
                onChange={e => setVerifyInput(e.target.value)}
                placeholder="e.g. MEW-2026-PY-1041, MEW-2026-PRO-3043..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Verify Credential
            </button>
          </form>

          {/* Verification Feedback Result */}
          {verificationResult.searched && (
            <div className="pt-3">
              {verificationResult.cert ? (
                <div className="p-5 bg-emerald-50 border border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-200">
                  <div className="flex items-start gap-3.5">
                    <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-emerald-950">
                          Authentic &amp; Active Credential Verified
                        </span>
                        {verificationResult.cert.isFlagship && (
                          <span className="text-[10px] font-black uppercase bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full">
                            Flagship 🏆
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-emerald-800 mt-1">
                        Issued to <strong>{verificationResult.cert.recipientName}</strong> for <em>"{verificationResult.cert.courseTitle}"</em>.
                      </div>
                      {verificationResult.cert.covers && (
                        <div className="text-[11px] text-emerald-900 font-semibold mt-0.5">
                          Covers: {verificationResult.cert.covers}
                        </div>
                      )}
                      <div className="text-[11px] font-mono text-emerald-700 mt-1">
                        Grade: {verificationResult.cert.grade} ({verificationResult.cert.overallScore}%) • ID: {verificationResult.cert.certificateNumber} • Hash: {(verificationResult.cert.verificationHash || '').slice(0, 12)}...
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveCertificateModal(verificationResult.cert)}
                    className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl whitespace-nowrap shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>View &amp; Print Certificate</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-900 text-xs">
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                  <span>
                    No active credential found for "{verifyInput}". Please verify the ID format (e.g. MEW-2026-PY-1041).
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Your Earned Certificates List */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Your Earned Certificates ({certificates.length} Awarded)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every certificate includes high-resolution print rendering, unique verification ID, and LinkedIn credential sharing.
              </p>
            </div>
            <button
              onClick={() => setActiveView('dashboard')}
              className="text-xs font-bold text-amber-700 hover:underline bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 cursor-pointer"
            >
              ← Back to Student Dashboard
            </button>
          </div>

          {certificates.length === 0 ? (
            <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-xs">
              <Award className="w-14 h-14 text-slate-300 mx-auto" />
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-lg font-bold text-slate-800">No certificates in your wallet yet</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Enroll in our 1-Month EDA Masterclass, complete the modules and hands-on capstones to automatically unlock your 3 verified industry credentials.
                </p>
              </div>
              <button
                onClick={() => setActiveView('home')}
                className="px-6 py-3 bg-[#d9822b] hover:bg-[#c87624] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore EDA Masterclass</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {certificates.map(cert => (
                <div
                  key={cert.id}
                  className={`bg-white rounded-3xl border transition-all flex flex-col justify-between p-6 shadow-sm hover:shadow-xl ${
                    cert.isFlagship 
                      ? 'border-amber-400 ring-2 ring-amber-400/20 bg-gradient-to-br from-white via-amber-50/20 to-white' 
                      : 'border-slate-200/90 hover:border-amber-300'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top Bar with Badge & Verified Status */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border shadow-2xs ${
                          cert.isFlagship
                            ? 'bg-amber-400 text-slate-950 border-amber-500'
                            : 'bg-sky-50 text-sky-800 border-sky-200'
                        }`}>
                          {cert.certificateIndex ? `Certificate ${cert.certificateIndex} of 3` : 'Accredited'}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                          {cert.certificateNumber}
                        </span>
                      </div>

                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                        {cert.courseTitle}
                      </h3>
                      {cert.covers && (
                        <div className="mt-1.5 inline-block text-xs font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                          <strong>Covers:</strong> {cert.covers}
                        </div>
                      )}
                      <p className="text-xs text-slate-500 mt-2">
                        Conferred upon <strong className="text-slate-800">{cert.recipientName}</strong> • Issued on <span className="font-semibold text-slate-700">{cert.issueDate}</span>
                      </p>
                      <p className="text-xs text-slate-500">
                        Instructor: <span className="font-semibold text-slate-700">{cert.instructorName}</span> ({cert.instructorTitle})
                      </p>
                    </div>

                    {/* Verified Skills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cert.skillsVerified.map((s, i) => (
                        <span key={i} className="text-[11px] bg-slate-50 text-slate-700 font-medium px-2.5 py-0.5 rounded-md border border-slate-200/70">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer with Grade and Actions */}
                  <div className="pt-5 mt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      {cert.grade} ({cert.overallScore}%)
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyLink(cert)}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                        title="Copy Verification Link"
                      >
                        {copiedId === cert.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline">{copiedId === cert.id ? 'Copied' : 'Share'}</span>
                      </button>

                      <button
                        onClick={() => setActiveCertificateModal(cert)}
                        className={`px-4 py-2 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                          cert.isFlagship 
                            ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-slate-950 font-black'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>View &amp; Print</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
