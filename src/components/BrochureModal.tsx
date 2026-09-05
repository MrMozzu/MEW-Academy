import React, { useState, useRef } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Download, 
  Printer, 
  Sparkles, 
  GraduationCap, 
  Calendar, 
  Clock, 
  Layers, 
  Award, 
  CheckCircle2, 
  Database, 
  ArrowRight,
  FileText,
  ShieldCheck,
  Code2,
  Terminal,
  BarChart3,
  FileSpreadsheet,
  Users,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { MewLogo } from './MewLogo';

export const BrochureModal: React.FC = () => {
  const { 
    isBrochureOpen, 
    setIsBrochureOpen, 
    courses, 
    startCheckout, 
    downloadBrochurePDF 
  } = useAcademy();

  const [activeWeekTab, setActiveWeekTab] = useState<'all' | 'w1' | 'w2' | 'w3' | 'w4' | 'summary'>('all');
  const brochureRef = useRef<HTMLDivElement>(null);
  const featuredCourse = courses[0];

  if (!isBrochureOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    downloadBrochurePDF(featuredCourse);
  };

  const daysWeek1 = [
    {
      day: 'Day 1',
      title: 'Python Environment Setup + Variables & Data Types',
      time: '60 min',
      revision: 'Course overview, why EDA matters, installing Anaconda & Jupyter Notebook',
      theory: 'Variables, data types (int, float, str, bool), type casting',
      practical: 'Set up Jupyter; write first notebook; create & print variables of each type'
    },
    {
      day: 'Day 2',
      title: 'Operators + Input / Output',
      time: '60 min',
      revision: 'Recap variables & data types with quick quiz',
      theory: 'Arithmetic, comparison, logical operators; input() & print() formatting',
      practical: 'Build a simple calculator; take user input and format output'
    },
    {
      day: 'Day 3',
      title: 'Conditional Statements + Loops',
      time: '60 min',
      revision: 'Recap operators & I/O with a coding exercise',
      theory: 'if / elif / else; for & while loops; break & continue',
      practical: 'Number patterns, grade calculator, loop-based practice problems'
    },
    {
      day: 'Day 4',
      title: 'Lists, Tuples, Dictionaries & Sets',
      time: '60 min',
      revision: 'Recap loops & conditionals with mini coding task',
      theory: 'Creating & using lists, tuples, dictionaries, sets; common methods',
      practical: 'Build a student-marks dictionary; practice indexing, slicing & nested lists'
    },
    {
      day: 'Day 5',
      title: 'Functions + String Operations + File Handling',
      time: '60 min',
      revision: 'Recap data structures with a quick challenge',
      theory: 'Defining functions, parameters & return; string methods; reading/writing files',
      practical: 'Write reusable functions; clean a text string; read a .txt/.csv file into Python'
    },
    {
      day: 'Day 6',
      title: 'Introduction to EDA + Practice on Small Datasets',
      time: '60 min',
      revision: 'Full Week 1 rapid-fire revision quiz',
      theory: 'What is EDA? Why EDA matters; the EDA workflow (Raw Data → Understand → Clean → Explore → Analyze → Visualize → Find Insights → Report)',
      practical: 'Explore a small sample dataset using only core Python; note first observations'
    }
  ];

  const daysWeek2 = [
    {
      day: 'Day 7',
      title: 'NumPy Arrays + Indexing & Slicing',
      time: '60 min',
      revision: 'Recap Week 1 basics (functions, loops, data structures)',
      theory: 'Creating NumPy arrays, array shapes/dimensions, indexing & slicing',
      practical: 'Create 1D/2D arrays; practice slicing, reshaping and boolean indexing'
    },
    {
      day: 'Day 8',
      title: 'Mathematical & Statistical Operations (NumPy)',
      time: '60 min',
      revision: 'Recap arrays & indexing with quick exercise',
      theory: 'mean, median, std, sum, min/max, broadcasting, vectorized operations',
      practical: 'Compute statistics on a numeric dataset using NumPy functions'
    },
    {
      day: 'Day 9',
      title: 'Pandas Series & DataFrame + Importing Data',
      time: '60 min',
      revision: 'Recap NumPy statistical operations',
      theory: 'Pandas Series vs DataFrame; importing CSV/Excel files',
      practical: 'Import the Sales Dataset into Pandas; create Series & DataFrames from scratch'
    },
    {
      day: 'Day 10',
      title: 'head/tail/info/describe + Selecting, Filtering & Sorting',
      time: '60 min',
      revision: 'Recap importing data & DataFrame basics',
      theory: 'head(), tail(), info(), describe(); column/row selection; filtering conditions; sorting',
      practical: 'Explore Sales Dataset structure; filter & sort top-selling products'
    },
    {
      day: 'Day 11',
      title: 'Handling Missing Values + Removing Duplicates + Data Type Conversion',
      time: '60 min',
      revision: 'Recap selecting & filtering data',
      theory: 'isnull(), fillna(), dropna(); drop_duplicates(); astype() conversions',
      practical: 'Clean the Student Dataset — handle missing marks, remove duplicate rows, fix column types'
    },
    {
      day: 'Day 12',
      title: 'GroupBy & Aggregation + Merge/Join/Concat + Date & Time + Mini Project',
      time: '60 min',
      revision: 'Full Week 2 rapid-fire revision quiz',
      theory: 'groupby() & aggregation; merge, join & concat; working with date/time columns',
      practical: 'Mini Project: Combine & group the Sales Dataset by region/date to find trends'
    }
  ];

  const daysWeek3 = [
    {
      day: 'Day 13',
      title: 'Matplotlib Basics + Line Plot + Bar Plot',
      time: '60 min',
      revision: 'Recap Pandas GroupBy & aggregation from Week 2',
      theory: 'Matplotlib figure/axes basics; line plots; bar plots',
      practical: 'Plot monthly sales trend (line) and best-selling products (bar) from Sales Dataset'
    },
    {
      day: 'Day 14',
      title: 'Pie Chart + Histogram + Scatter Plot',
      time: '60 min',
      revision: 'Recap line & bar plots',
      theory: 'Pie charts for proportions; histograms for distribution; scatter plots for relationships',
      practical: 'Visualize customer segments (pie), marks distribution (histogram), price vs quantity (scatter)'
    },
    {
      day: 'Day 15',
      title: 'Box Plot + Subplots + Labels, Titles & Legends',
      time: '60 min',
      revision: 'Recap pie/histogram/scatter charts',
      theory: 'Box plots for spread & outliers; multiple subplots in one figure; proper labeling',
      practical: 'Build a multi-chart dashboard (subplots) with clear titles, axis labels & legends'
    },
    {
      day: 'Day 16',
      title: 'Seaborn Basics + Countplot',
      time: '60 min',
      revision: 'Recap Matplotlib box plots & subplots',
      theory: 'Why Seaborn; styling themes; countplot for categorical frequency',
      practical: 'Count pass/fail students or customer categories using Seaborn countplot'
    },
    {
      day: 'Day 17',
      title: 'Boxplot & Violinplot + Heatmap + Pairplot (Seaborn)',
      time: '60 min',
      revision: 'Recap Seaborn countplot',
      theory: 'Boxplot & violinplot for comparison; heatmap for correlation; pairplot for relationships',
      practical: 'Build a correlation heatmap & pairplot on the E-Commerce Customer Dataset'
    },
    {
      day: 'Day 18',
      title: 'Distribution, Correlation & Outlier Analysis + Find Patterns & Insights',
      time: '60 min',
      revision: 'Full Week 3 rapid-fire revision quiz',
      theory: 'Reading distributions; interpreting correlation; detecting outliers; spotting patterns',
      practical: 'Full visual analysis of one dataset — summarize 3 key insights found'
    }
  ];

  const daysWeek4 = [
    {
      day: 'Day 19',
      title: 'Excel: Data Cleaning + Sorting & Filtering + Conditional Formatting',
      time: '60 min',
      revision: 'Recap Week 3 visualization & insight-finding',
      theory: 'Cleaning raw data in Excel; sort & filter tools; conditional formatting rules',
      practical: 'Clean the Student Dataset in Excel; highlight top/low performers with formatting'
    },
    {
      day: 'Day 20',
      title: 'Excel: Formulas & Functions + Pivot Tables',
      time: '60 min',
      revision: 'Recap Excel cleaning & formatting',
      theory: 'SUM, IF, COUNTIF, VLOOKUP; building & reading Pivot Tables',
      practical: 'Summarize Sales Dataset with formulas; build a Pivot Table by region/product'
    },
    {
      day: 'Day 21',
      title: 'Excel: Charts & Graphs + Basic Dashboard',
      time: '60 min',
      revision: 'Recap formulas & pivot tables',
      theory: 'Chart types in Excel; combining charts + pivot tables into a dashboard',
      practical: 'Build a one-page Excel dashboard for the Sales Dataset'
    },
    {
      day: 'Day 22',
      title: 'Complete EDA Project — Part 1: Understand Dataset + Data Cleaning',
      time: '60 min',
      revision: 'Recap full Python + Excel workflow so far',
      theory: 'Project brief: E-Commerce Customer Dataset — problem statement & goals',
      practical: 'Load dataset in Python, understand columns, clean missing/duplicate data'
    },
    {
      day: 'Day 23',
      title: 'Complete EDA Project — Part 2: Analysis, Visualization & Insights',
      time: '60 min',
      revision: 'Recap project dataset understanding & cleaning',
      theory: 'Structuring an EDA report: analysis → visuals → insights → recommendations',
      practical: 'Perform full EDA (customer segmentation, RFM analysis), visualize & document 3–5 key insights'
    },
    {
      day: 'Day 30',
      title: 'Bonus: Power BI Dashboard + Final Presentation & Certification',
      time: '60 min',
      revision: 'Recap complete EDA project findings',
      theory: 'Power BI interface, importing & cleaning data, relationships, basic DAX measures',
      practical: 'Build an interactive Power BI dashboard; present final project report; course wrap-up & certificate'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsBrochureOpen(false)}
          className="fixed inset-0 bg-black/60"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl max-h-[94vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-10 my-auto"
        >
          {/* Top Control Bar */}
          <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-[#f5a623] border border-amber-400/30">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">Official Curriculum Plan (PDF Overview)</div>
                <div className="text-sm sm:text-base font-black text-white">1-Month Online EDA Day-by-Day Course Plan</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className="px-3.5 py-1.5 bg-[#f5a623] hover:bg-[#e0961b] text-slate-950 text-xs sm:text-sm font-black rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Download formatted brochure file"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download PDF Brochure</span>
                <span className="sm:hidden">Download</span>
              </motion.button>

              <button
                onClick={handlePrint}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
                title="Print brochure"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>

              <button
                onClick={() => setIsBrochureOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Brochure Body */}
          <div ref={brochureRef} className="overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#f8fafc] text-slate-900 space-y-6 print:p-0 print:bg-white">
            
            {/* Header Poster Banner (From Page 1 of PDF) */}
            <div className="bg-gradient-to-br from-[#071739] via-[#0b2447] to-[#041026] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#f5a623]/15 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-700/80">
                <div className="flex items-center gap-4">
                  <MewLogo size="md" theme="on-dark" />
                </div>

                {/* Instructor card */}
                <div className="flex items-center gap-3 bg-slate-800/90 border border-amber-400/50 px-4 py-2.5 rounded-2xl">
                  <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-amber-400 flex-shrink-0 bg-slate-900">
                    <img 
                      src="/tahseen-equbal.png" 
                      alt="Prof. MD Tahseen Equbal" 
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Course Instructor</div>
                    <div className="text-sm font-black text-amber-300">Prof. MD Tahseen Equbal</div>
                    <div className="text-[11px] text-slate-300">Data Analytics &amp; EDA Specialist</div>
                  </div>
                </div>
              </div>

              {/* Title & Tagline */}
              <div className="mt-6 text-center space-y-2">
                <span className="px-4 py-1 rounded-full bg-[#f5a623] text-slate-950 font-black text-xs uppercase tracking-wider inline-block">
                  ★ FROM BASICS TO INSIGHTS
                </span>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                  <span className="text-[#f5a623]">1-MONTH ONLINE EDA</span>
                  <span className="block text-white text-xl sm:text-3xl mt-1">DAY-BY-DAY COURSE PLAN</span>
                </h1>
                <div className="text-sm sm:text-base font-bold text-sky-400 tracking-wide">
                  Learn · Analyze · Visualize · Explore · 1 Hour Live Class Every Day
                </div>
              </div>

              {/* 6 Key Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mt-6 pt-6 border-t border-slate-700/80 text-center">
                <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700/80">
                  <div className="text-[11px] font-bold text-sky-300">100% Online</div>
                  <div className="text-[10px] text-slate-300">Live Interactive Classes</div>
                </div>
                <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700/80">
                  <div className="text-[11px] font-bold text-amber-300">1 Month</div>
                  <div className="text-[10px] text-slate-300">30 Practical Sessions</div>
                </div>
                <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700/80">
                  <div className="text-[11px] font-bold text-emerald-300">1 Hr / Day</div>
                  <div className="text-[10px] text-slate-300">Structured Daily Plan</div>
                </div>
                <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700/80">
                  <div className="text-[11px] font-bold text-purple-300">Hands-on</div>
                  <div className="text-[10px] text-slate-300">Real Datasets &amp; Projects</div>
                </div>
                <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700/80">
                  <div className="text-[11px] font-bold text-[#f5a623]">Certificate</div>
                  <div className="text-[10px] text-slate-300">On Course Completion</div>
                </div>
                <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700/80">
                  <div className="text-[11px] font-bold text-rose-300">Doubt Support</div>
                  <div className="text-[10px] text-slate-300">Weekend Sessions</div>
                </div>
              </div>

              {/* Time Distribution Banner */}
              <div className="mt-5 bg-white text-slate-900 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div className="font-extrabold text-xs sm:text-sm uppercase tracking-wide text-slate-900">
                  Every Class — Time Distribution (60 Minutes)
                </div>
                <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-bold">
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span>Revision: <strong>15 min</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sky-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                    <span>Theory: <strong>~15 min</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span>Practical: <strong>~30 min</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs for Week Breakdown */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
              <button
                onClick={() => setActiveWeekTab('all')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeWeekTab === 'all' ? 'bg-[#d9822b] text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                All 4 Weeks (Complete Plan)
              </button>
              <button
                onClick={() => setActiveWeekTab('w1')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeWeekTab === 'w1' ? 'bg-[#d9822b] text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Week 1: Python Basics
              </button>
              <button
                onClick={() => setActiveWeekTab('w2')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeWeekTab === 'w2' ? 'bg-[#d9822b] text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Week 2: NumPy + Pandas
              </button>
              <button
                onClick={() => setActiveWeekTab('w3')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeWeekTab === 'w3' ? 'bg-[#d9822b] text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Week 3: Visualization
              </button>
              <button
                onClick={() => setActiveWeekTab('w4')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeWeekTab === 'w4' ? 'bg-[#d9822b] text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Week 4: Excel + Capstone
              </button>
              <button
                onClick={() => setActiveWeekTab('summary')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeWeekTab === 'summary' ? 'bg-[#d9822b] text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Course Summary &amp; Bonus
              </button>
            </div>

            {/* DAY-BY-DAY CURRICULUM ACCORDIONS / CARDS */}
            <div className="space-y-6">

              {/* WEEK 1 */}
              {(activeWeekTab === 'all' || activeWeekTab === 'w1') && (
                <div className="bg-white rounded-2xl border border-emerald-200/90 shadow-xs overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                        WEEK 1 · DAYS 1–6
                      </span>
                      <h3 className="text-lg sm:text-xl font-black mt-1">
                        Python Basics + EDA Introduction
                      </h3>
                    </div>
                    <div className="text-xs bg-emerald-950/60 border border-emerald-400/30 px-3 py-1.5 rounded-xl font-semibold text-emerald-200">
                      Outcome: Write basic Python code &amp; understand the EDA workflow
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 space-y-3.5">
                    {daysWeek1.map((item, idx) => (
                      <div key={idx} className="bg-[#f8fafc] rounded-xl p-3.5 sm:p-4 border border-slate-200/90 grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
                        <div className="lg:col-span-4 flex items-start gap-2.5">
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-900 font-mono font-bold text-xs rounded-lg flex-shrink-0">
                            {item.day}
                          </span>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">{item.title}</h4>
                            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-emerald-600" /> {item.time}
                            </span>
                          </div>
                        </div>
                        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                          <div className="bg-amber-50/70 p-2 rounded-lg border border-amber-100/80">
                            <span className="text-[10px] font-bold text-amber-800 uppercase block mb-0.5">Revision (15m)</span>
                            <span className="text-slate-700">{item.revision}</span>
                          </div>
                          <div className="bg-sky-50/70 p-2 rounded-lg border border-sky-100/80">
                            <span className="text-[10px] font-bold text-sky-800 uppercase block mb-0.5">Theory (15m)</span>
                            <span className="text-slate-700">{item.theory}</span>
                          </div>
                          <div className="bg-emerald-50/70 p-2 rounded-lg border border-emerald-100/80">
                            <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-0.5">Practical (30m)</span>
                            <span className="text-slate-700 font-medium">{item.practical}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* WEEK 2 */}
              {(activeWeekTab === 'all' || activeWeekTab === 'w2') && (
                <div className="bg-white rounded-2xl border border-sky-200/90 shadow-xs overflow-hidden">
                  <div className="bg-gradient-to-r from-sky-800 to-sky-700 text-white p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                        WEEK 2 · DAYS 7–12
                      </span>
                      <h3 className="text-lg sm:text-xl font-black mt-1">
                        NumPy + Pandas (Data Wrangling)
                      </h3>
                    </div>
                    <div className="text-xs bg-sky-950/60 border border-sky-400/30 px-3 py-1.5 rounded-xl font-semibold text-sky-200">
                      Outcome: Clean, manipulate &amp; prepare data using NumPy &amp; Pandas
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 space-y-3.5">
                    {daysWeek2.map((item, idx) => (
                      <div key={idx} className="bg-[#f8fafc] rounded-xl p-3.5 sm:p-4 border border-slate-200/90 grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
                        <div className="lg:col-span-4 flex items-start gap-2.5">
                          <span className="px-2 py-1 bg-sky-100 text-sky-900 font-mono font-bold text-xs rounded-lg flex-shrink-0">
                            {item.day}
                          </span>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">{item.title}</h4>
                            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-sky-600" /> {item.time}
                            </span>
                          </div>
                        </div>
                        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                          <div className="bg-amber-50/70 p-2 rounded-lg border border-amber-100/80">
                            <span className="text-[10px] font-bold text-amber-800 uppercase block mb-0.5">Revision (15m)</span>
                            <span className="text-slate-700">{item.revision}</span>
                          </div>
                          <div className="bg-sky-50/70 p-2 rounded-lg border border-sky-100/80">
                            <span className="text-[10px] font-bold text-sky-800 uppercase block mb-0.5">Theory (15m)</span>
                            <span className="text-slate-700">{item.theory}</span>
                          </div>
                          <div className="bg-emerald-50/70 p-2 rounded-lg border border-emerald-100/80">
                            <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-0.5">Practical (30m)</span>
                            <span className="text-slate-700 font-medium">{item.practical}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* WEEK 3 */}
              {(activeWeekTab === 'all' || activeWeekTab === 'w3') && (
                <div className="bg-white rounded-2xl border border-purple-200/90 shadow-xs overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-800 to-purple-700 text-white p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                        WEEK 3 · DAYS 13–18
                      </span>
                      <h3 className="text-lg sm:text-xl font-black mt-1">
                        Data Visualization (Matplotlib + Seaborn)
                      </h3>
                    </div>
                    <div className="text-xs bg-purple-950/60 border border-purple-400/30 px-3 py-1.5 rounded-xl font-semibold text-purple-200">
                      Outcome: Visualize data beautifully &amp; extract meaningful insights
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 space-y-3.5">
                    {daysWeek3.map((item, idx) => (
                      <div key={idx} className="bg-[#f8fafc] rounded-xl p-3.5 sm:p-4 border border-slate-200/90 grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
                        <div className="lg:col-span-4 flex items-start gap-2.5">
                          <span className="px-2 py-1 bg-purple-100 text-purple-900 font-mono font-bold text-xs rounded-lg flex-shrink-0">
                            {item.day}
                          </span>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">{item.title}</h4>
                            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-purple-600" /> {item.time}
                            </span>
                          </div>
                        </div>
                        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                          <div className="bg-amber-50/70 p-2 rounded-lg border border-amber-100/80">
                            <span className="text-[10px] font-bold text-amber-800 uppercase block mb-0.5">Revision (15m)</span>
                            <span className="text-slate-700">{item.revision}</span>
                          </div>
                          <div className="bg-sky-50/70 p-2 rounded-lg border border-sky-100/80">
                            <span className="text-[10px] font-bold text-sky-800 uppercase block mb-0.5">Theory (15m)</span>
                            <span className="text-slate-700">{item.theory}</span>
                          </div>
                          <div className="bg-emerald-50/70 p-2 rounded-lg border border-emerald-100/80">
                            <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-0.5">Practical (30m)</span>
                            <span className="text-slate-700 font-medium">{item.practical}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* WEEK 4 */}
              {(activeWeekTab === 'all' || activeWeekTab === 'w4') && (
                <div className="bg-white rounded-2xl border border-amber-300/90 shadow-xs overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-600 to-[#d9822b] text-white p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                        WEEK 4 · DAYS 19–30
                      </span>
                      <h3 className="text-lg sm:text-xl font-black mt-1">
                        Excel + Complete EDA Project + Power BI Bonus
                      </h3>
                    </div>
                    <div className="text-xs bg-amber-950/60 border border-amber-300/30 px-3 py-1.5 rounded-xl font-semibold text-amber-100">
                      Outcome: Perform EDA using Excel &amp; Python and deliver a complete project
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 space-y-3.5">
                    {daysWeek4.map((item, idx) => (
                      <div key={idx} className="bg-[#f8fafc] rounded-xl p-3.5 sm:p-4 border border-slate-200/90 grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
                        <div className="lg:col-span-4 flex items-start gap-2.5">
                          <span className="px-2 py-1 bg-amber-100 text-amber-900 font-mono font-bold text-xs rounded-lg flex-shrink-0">
                            {item.day}
                          </span>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">{item.title}</h4>
                            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-amber-600" /> {item.time}
                            </span>
                          </div>
                        </div>
                        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                          <div className="bg-amber-50/70 p-2 rounded-lg border border-amber-100/80">
                            <span className="text-[10px] font-bold text-amber-800 uppercase block mb-0.5">Revision (15m)</span>
                            <span className="text-slate-700">{item.revision}</span>
                          </div>
                          <div className="bg-sky-50/70 p-2 rounded-lg border border-sky-100/80">
                            <span className="text-[10px] font-bold text-sky-800 uppercase block mb-0.5">Theory (15m)</span>
                            <span className="text-slate-700">{item.theory}</span>
                          </div>
                          <div className="bg-emerald-50/70 p-2 rounded-lg border border-emerald-100/80">
                            <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-0.5">Practical (30m)</span>
                            <span className="text-slate-700 font-medium">{item.practical}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* COURSE SUMMARY & ENROLLMENT (From Page 6 of PDF) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Who Can Join & Prerequisites */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Who Can Join?
                  </h4>
                  <ul className="grid grid-cols-2 gap-1.5 text-xs text-slate-700 font-medium">
                    <li className="flex items-center gap-1.5">✓ Students (any stream)</li>
                    <li className="flex items-center gap-1.5">✓ Beginners in Data Analytics</li>
                    <li className="flex items-center gap-1.5">✓ Professionals wanting to upskill</li>
                    <li className="flex items-center gap-1.5">✓ Anyone interested in Data Analysis</li>
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Prerequisites
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-700 font-medium">
                    <li className="flex items-center gap-1.5">✓ Basic computer knowledge</li>
                    <li className="flex items-center gap-1.5">✓ No prior coding experience required</li>
                    <li className="flex items-center gap-1.5">✓ Willingness to learn</li>
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Datasets Used in Course:
                  </h4>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-lg font-bold">1. Sales Dataset</span>
                    <span className="bg-sky-50 text-sky-800 border border-sky-200 px-2.5 py-0.5 rounded-lg font-bold">2. Student Dataset</span>
                    <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-0.5 rounded-lg font-bold">3. E-Commerce Dataset</span>
                  </div>
                </div>
              </div>

              {/* Bonus Module: Power BI & What You Get */}
              <div className="bg-gradient-to-br from-[#071739] to-[#0b2447] text-white rounded-2xl p-5 border border-amber-400/30 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-[#f5a623] text-slate-950 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full">
                      BONUS MODULE
                    </span>
                    <span className="text-xs text-amber-300 font-bold">Included Free</span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">
                    Power BI (Dashboard &amp; Reporting)
                  </h4>
                  <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-300">
                    <div>• Power BI Interface</div>
                    <div>• Power Query Basics</div>
                    <div>• Data Cleaning</div>
                    <div>• Table Relationships</div>
                    <div>• Basic DAX Measures</div>
                    <div>• Interactive Visuals</div>
                    <div>• Filters &amp; Slicers</div>
                    <div>• Dashboard Publish</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-700">
                  <div className="text-xs text-amber-300 font-bold uppercase mb-1">
                    EDA Workflow (The Thinking Process):
                  </div>
                  <div className="text-xs text-slate-300 font-medium">
                    Raw Data → Understand → Clean → Explore → Analyze → Visualize → Find Insights → Report
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Final Action */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-black text-slate-900">
                  Ready to Start Your 1-Month EDA Journey?
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Join live interactive classes guided directly by Prof. MD Tahseen Equbal.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleDownload}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
                >
                  <Download className="w-4 h-4 text-[#d9822b]" />
                  <span>Download PDF Plan</span>
                </button>
                <button
                  onClick={() => {
                    setIsBrochureOpen(false);
                    startCheckout(featuredCourse);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#d9822b] hover:bg-[#b7681c] text-white font-black text-xs sm:text-sm rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Enroll for ₹{featuredCourse.priceINR}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
