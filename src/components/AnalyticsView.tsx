import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Award, 
  CheckCircle, 
  Users, 
  DollarSign, 
  Flame, 
  ArrowUpRight, 
  Brain, 
  Calendar,
  Layers,
  ShieldCheck,
  Percent
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { 
    user, 
    platformAnalytics, 
    courses, 
    userProgress, 
    certificates, 
    currency 
  } = useAcademy();

  const [activeTab, setActiveTab] = useState<'student' | 'admin'>(user.role === 'admin' ? 'admin' : 'student');

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block">
              Interactive Analytics Engine
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Performance Analytics & Mastery Reports
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive telemetry on study hours, quiz mastery rates, and completion velocity.
            </p>
          </div>

          {/* Perspective Switcher */}
          <div className="flex items-center bg-slate-200 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('student')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'student'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Student Analytics
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Academy Admin Metrics</span>
            </button>
          </div>
        </div>

        {activeTab === 'student' ? (
          /* Student Analytics View */
          <div className="space-y-8">
            {/* 4 Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Weekly Study Hours</span>
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-3xl font-black text-slate-900">25.5 hrs</div>
                <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+18% compared to last week</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Quiz Accuracy</span>
                  <Brain className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-3xl font-black text-slate-900">96.4%</div>
                <div className="text-xs text-emerald-600 font-semibold mt-1">
                  Top 5% of Academy cohorts
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Active Streak</span>
                  <Flame className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-3xl font-black text-slate-900">{user.streakDays} Days</div>
                <div className="text-xs text-amber-600 font-semibold mt-1">
                  🔥 Consistent daily study
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Est. Graduation</span>
                  <Calendar className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-black text-slate-900">12 Days</div>
                <div className="text-xs text-slate-500 font-semibold mt-1">
                  At current 3.2 hrs/day pace
                </div>
              </div>
            </div>

            {/* Visual Study Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left 7 Cols: Weekly Study Time Chart (Interactive Bar visual) */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Weekly Study Hours & Daily Velocity
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Monitored active video playback and code sandbox runtime
                    </p>
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                    This Week
                  </span>
                </div>

                {/* SVG/CSS Interactive Bar Visual */}
                <div className="pt-4">
                  <div className="h-60 flex items-end justify-between gap-3 sm:gap-6 px-2 border-b border-slate-100 pb-2">
                    {platformAnalytics.weeklyLearningHours.map((item, i) => {
                      const maxH = 6; // scale
                      const pct = Math.min(100, Math.round((item.hours / maxH) * 100));
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                          {/* Tooltip on hover */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2 rounded font-mono pointer-events-none mb-1 text-center whitespace-nowrap">
                            {item.hours}h • {item.lessons} lessons
                          </div>
                          {/* Bar */}
                          <div
                            className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-xl group-hover:from-blue-700 group-hover:to-indigo-600 transition-all duration-300 shadow-sm"
                            style={{ height: `${pct}%` }}
                          ></div>
                          <span className="text-xs font-bold text-slate-600 group-hover:text-blue-600">
                            {item.day}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-3">
                    <span>0 hrs/day</span>
                    <span>3.0 hrs/day avg</span>
                    <span>6.0 hrs/day peak</span>
                  </div>
                </div>
              </div>

              {/* Right 5 Cols: Skill Mastery Radar & Assessment breakdown */}
              <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Skill Competency Breakdown
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Calculated from quizzes, coding labs, and project capstones
                  </p>
                </div>

                <div className="space-y-4">
                  {platformAnalytics.skillMastery.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-800">
                        <span>{item.skill}</span>
                        <span className="text-blue-600 font-mono">{item.masteryPercentage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${item.masteryPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <p className="text-xs text-emerald-900 font-medium">
                    You have achieved high proficiency in <strong>SQL</strong> and <strong>Power BI</strong>. Ready to claim verified credential!
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Academy Admin & Instructor Analytics Portal */
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="bg-purple-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="text-xs font-bold text-purple-200 uppercase tracking-wider mb-1">
                  Executive Admin & Instructor Control View
                </div>
                <h2 className="text-2xl sm:text-3xl font-black">
                  Academy Enrollment, Revenue & Completion Telemetry
                </h2>
                <p className="text-xs text-purple-200 mt-1 max-w-xl">
                  Real-time metrics for total active students, gateway transactions, course drop-off rates, and certificate verification audits.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
                <div className="text-2xl font-black">$58.7K</div>
                <div className="text-xs text-purple-200">Total Net Platform Revenue</div>
              </div>
            </div>

            {/* 4 Admin Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-400 uppercase">Total Enrolled Students</div>
                <div className="text-3xl font-black text-slate-900 mt-2">
                  {platformAnalytics.totalStudents.toLocaleString()}
                </div>
                <div className="text-xs text-emerald-600 font-semibold mt-1">
                  +142 this month
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-400 uppercase">Active Monthly Learners</div>
                <div className="text-3xl font-black text-slate-900 mt-2">
                  {platformAnalytics.activeLearners.toLocaleString()}
                </div>
                <div className="text-xs text-blue-600 font-semibold mt-1">
                  78.2% retention rate
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-400 uppercase">Certificates Issued</div>
                <div className="text-3xl font-black text-slate-900 mt-2">
                  {platformAnalytics.totalCertificatesIssued.toLocaleString()}
                </div>
                <div className="text-xs text-amber-600 font-semibold mt-1">
                  100% cryptographic verify
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-400 uppercase">Overall Completion Rate</div>
                <div className="text-3xl font-black text-slate-900 mt-2">
                  {platformAnalytics.courseCompletionRate}%
                </div>
                <div className="text-xs text-emerald-600 font-semibold mt-1">
                  +3.4x industry average
                </div>
              </div>
            </div>

            {/* Course Performance Table */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Course Performance & Revenue Breakdown
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                    <tr>
                      <th className="pb-3">Course Title</th>
                      <th className="pb-3">Instructor</th>
                      <th className="pb-3">Students</th>
                      <th className="pb-3">Rating</th>
                      <th className="pb-3">Avg Completion</th>
                      <th className="pb-3 text-right">Gross Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {courses.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="py-3.5 font-bold text-slate-900 flex items-center gap-2">
                          <img src={c.thumbnail} alt={c.title} className="w-8 h-8 rounded-lg object-cover" />
                          <span className="line-clamp-1">{c.title}</span>
                        </td>
                        <td className="py-3.5">{c.instructor.name}</td>
                        <td className="py-3.5">{c.instructor.studentsCount.toLocaleString()}</td>
                        <td className="py-3.5 font-bold text-amber-500">⭐ {c.rating}</td>
                        <td className="py-3.5">
                          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                            89%
                          </span>
                        </td>
                        <td className="py-3.5 text-right font-bold text-slate-900">
                          ${((c.priceUSD * c.instructor.studentsCount) / 1000).toFixed(1)}K
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
