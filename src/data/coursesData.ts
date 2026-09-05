import { Course } from '../types';
import { INSTRUCTORS } from './instructorsData';

export const COURSES: Course[] = [
  {
    id: 'course-data-analytics',
    title: '1-Month Online EDA (Exploratory Data Analysis) Complete Course Plan',
    slug: '1-month-online-eda-exploratory-data-analysis',
    tag: 'BESTSELLER • 100% ONLINE LIVE',
    category: 'Exploratory Data Analysis (EDA)',
    shortDescription: 'From Basics to Insights – Learn. Analyze. Visualize. Explore. Turn Data into Decisions with Prof. MD Tahseen Equbal.',
    fullDescription: 'Master end-to-end Exploratory Data Analysis (EDA) in this intensive 1-Month live program led by Prof. MD Tahseen Equbal. Journey from Python basics, NumPy, and Pandas data wrangling to deep Matplotlib & Seaborn visualization, Advanced Excel data cleaning, real-world portfolio capstones, and a Bonus Power BI Dashboard module. Designed with 100% live classes, hands-on datasets, doubt solving, and verifiable MEW Academy certification.',
    priceINR: 1599,
    originalPriceINR: 2999,
    priceUSD: 19,
    originalPriceUSD: 39,
    rating: 4.95,
    reviewsCount: 342,
    level: 'Beginner to Intermediate',
    durationHours: 70,
    totalLessons: 32,
    totalProjects: 6,
    certificateIncluded: true,
    lifetimeAccess: true,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    instructor: INSTRUCTORS[0], // Prof. MD Tahseen Equbal
    features: [
      '100% Online Live Classes & Recordings',
      'Duration: 1 Month with Flexible Timings & Weekend Support',
      'Hands-on Projects with 3 Real-World Datasets',
      'Certificate of Completion with Instant Verification',
      'Dedicated Doubt Solving & Mentorship Support',
      'Bonus Module: Power BI Dashboard & Reporting',
      'Placement & Career Guidance with Resume Support'
    ],
    skillsGained: [
      'Python Basics & Jupyter Notebooks',
      'NumPy Vectorized Ops & Pandas Wrangling',
      'Matplotlib & Seaborn Visual Storytelling',
      'Excel Data Cleaning, Pivot Tables & VLOOKUP',
      'Exploratory Data Analysis (EDA) Workflow',
      'Outlier Detection & Correlation Analysis',
      'Bonus Power BI Interactive Dashboards & DAX'
    ],
    prerequisites: [
      'Basic Computer Knowledge',
      'No Prior Coding Experience Required',
      'Willingness to Learn & Practice'
    ],
    modules: [
      {
        id: 'mod-1',
        title: 'Week 1: Python Basics + EDA Introduction',
        description: 'Set up your analytics environment, master Python syntax, and understand the fundamental EDA thinking process.',
        lessons: [
          {
            id: 'les-1-1',
            title: '1.1 Python Environment Setup (Anaconda, Jupyter Notebook)',
            duration: '20 min',
            durationSeconds: 1200,
            summary: 'Installing Anaconda distribution, navigating Jupyter Notebook shortcuts, and configuring virtual environments for data analysis.',
            isPreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            resources: [
              { name: 'Anaconda & Jupyter Setup Cheatsheet PDF', type: 'pdf', size: '1.8 MB', url: '#' },
              { name: 'Week 1 Starter Python Notebook (.ipynb)', type: 'link', url: '#' }
            ],
            quiz: [
              {
                id: 'q1-1',
                question: 'Which tool is most commonly used in industry for interactive EDA with Python?',
                options: ['Jupyter Notebook / Google Colab', 'MS Notepad', 'Command Prompt', 'Photoshop'],
                correctAnswerIndex: 0,
                explanation: 'Jupyter Notebook allows inline code execution, data visualization, and rich markdown documentation.'
              }
            ]
          },
          {
            id: 'les-1-2',
            title: '1.2 Variables, Data Types, Operators & I/O Operations',
            duration: '25 min',
            durationSeconds: 1500,
            summary: 'Numbers, strings, booleans, type casting, arithmetic, logical & comparison operators in Python.',
            isPreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
          },
          {
            id: 'les-1-3',
            title: '1.3 Control Flow: Conditional Statements (if/elif/else) & Loops',
            duration: '30 min',
            durationSeconds: 1800,
            summary: 'Iterating over datasets with for and while loops, break/continue statements, and nested logic.',
            isPreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
          },
          {
            id: 'les-1-4',
            title: '1.4 Python Data Structures: Lists, Tuples, Dictionaries, Sets & Functions',
            duration: '35 min',
            durationSeconds: 2100,
            summary: 'Deep dive into mutable vs immutable types, dictionary lookups, list comprehensions, lambda functions, and modular code writing.',
            isPreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
          },
          {
            id: 'les-1-5',
            title: '1.5 String Operations, File Handling & Introduction to EDA Workflow',
            duration: '30 min',
            durationSeconds: 1800,
            summary: 'Reading text files and CSVs, string formatting, and practicing initial EDA on small starter datasets.',
            isPreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Week 2: NumPy + Pandas for Data Wrangling',
        description: 'Clean, manipulate, filter, aggregate, and prepare structured tabular data with industry-standard Python libraries.',
        lessons: [
          {
            id: 'les-2-1',
            title: '2.1 NumPy Arrays, Indexing, Slicing & Statistical Operations',
            duration: '30 min',
            durationSeconds: 1800,
            summary: '1D/2D arrays, broadcasting, vectorized math, mean, median, standard deviation, and matrix operations.',
            isPreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4'
          },
          {
            id: 'les-2-2',
            title: '2.2 Pandas Series & DataFrame, Importing CSV & Excel Datasets',
            duration: '35 min',
            durationSeconds: 2100,
            summary: 'Creating dataframes, loading CSV/Excel/JSON files, inspecting structure with head(), tail(), info(), describe(), and shape.',
            isPreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'
          },
          {
            id: 'les-2-3',
            title: '2.3 Selecting, Filtering, Sorting Data & Handling Missing Values',
            duration: '40 min',
            durationSeconds: 2400,
            summary: 'Loc vs iloc, boolean masking, fillna(), dropna(), interpolating missing records, and removing duplicate rows.',
            isPreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
          },
          {
            id: 'les-2-4',
            title: '2.4 Data Type Conversions, GroupBy & Aggregations, Merging & DateTime Ops',
            duration: '45 min',
            durationSeconds: 2700,
            summary: 'Multi-column GroupBy, pivot tables, pd.merge(), pd.concat(), parsing datetime features, and Week 2 Mini-Project.',
            isPreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4'
          }
        ]
      },
      {
        id: 'mod-3',
        title: 'Week 3: Data Visualization (Matplotlib + Seaborn)',
        description: 'Visualize data beautifully, uncover hidden correlations, detect outliers, and extract meaningful business insights.',
        lessons: [
          {
            id: 'les-3-1',
            title: '3.1 Matplotlib Foundations: Line, Bar, Pie, Histogram, Scatter & Box Plots',
            duration: '35 min',
            durationSeconds: 2100,
            summary: 'Customizing figures, axes, colors, labels, titles, legends, and multi-chart subplots for reports.',
            isPreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
          },
          {
            id: 'les-3-2',
            title: '3.2 Seaborn Statistical Plots: Countplot, Boxplot & Violinplot',
            duration: '30 min',
            durationSeconds: 1800,
            summary: 'Categorical distribution plots, visual five-number summaries, and detecting skewed distributions.',
            isPreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
          },
          {
            id: 'les-3-3',
            title: '3.3 Advanced EDA: Heatmaps, Pairplots, Correlation & Outlier Analysis',
            duration: '40 min',
            durationSeconds: 2400,
            summary: 'Pearson/Spearman correlation matrices, multi-variable pairplots, IQR outlier identification, and finding key business patterns.',
            isPreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4'
          }
        ]
      },
      {
        id: 'mod-4',
        title: 'Week 4: Excel + Complete EDA Capstone Project',
        description: 'Combine Excel spreadsheet mastery with Python EDA workflow to build and deliver a complete real-world portfolio project.',
        lessons: [
          {
            id: 'les-4-1',
            title: '4.1 Part A: Excel for Data Analysis (Formulas, Pivot Tables, Dashboards)',
            duration: '45 min',
            durationSeconds: 2700,
            summary: 'Data cleaning in Excel, conditional formatting, SUM, IF, COUNTIF, VLOOKUP/XLOOKUP, Pivot Tables, charts, and executive KPI dashboard.',
            isPreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
          },
          {
            id: 'les-4-2',
            title: '4.2 Part B: Complete EDA Project (Understand ➔ Clean ➔ Analyze ➔ Insights)',
            duration: '60 min',
            durationSeconds: 3600,
            summary: 'Full-cycle EDA on real-world datasets (Sales, Student, and E-Commerce): finding insights, structuring executive presentations, and final report delivery.',
            isPreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
          }
        ]
      },
      {
        id: 'mod-5',
        title: 'Bonus Module: Power BI (Dashboard & Reporting)',
        description: 'Build interactive dashboards and executive reports for real-world enterprise data.',
        lessons: [
          {
            id: 'les-5-1',
            title: '5.1 Power BI Interface, Power Query Data Cleaning & Model Relationships',
            duration: '35 min',
            durationSeconds: 2100,
            summary: 'Connecting data sources, transforming in Power Query, building Star/Snowflake relationships between tables.',
            isPreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
          },
          {
            id: 'les-5-2',
            title: '5.2 Basic DAX Measures, Interactive Visualizations, Slicers & Publishing',
            duration: '40 min',
            durationSeconds: 2400,
            summary: 'Creating custom calculated measures, interactive slicers, drill-through cards, dashboard layout design, and publishing online.',
            isPreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
          }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        userName: 'Aarav Patel',
        userRole: 'Data Analyst Intern @ TechCorp',
        rating: 5,
        date: '1 week ago',
        comment: 'Prof. MD Tahseen Equbal teaches EDA like no one else! The 4-week structure with Python, Pandas, and the bonus Power BI dashboard took me from absolute zero coding to building full portfolio projects.',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
      },
      {
        id: 'rev-2',
        userName: 'Priya Sundaram',
        userRole: 'Business Analyst @ Infosys',
        rating: 5,
        date: '2 weeks ago',
        comment: 'The 3 datasets (Sales, Student, and E-Commerce) gave me real talking points in my interviews. The certificate verification was seamless.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'
      }
    ],
    faqs: [
      {
        question: 'Is this EDA course suitable for complete beginners with no coding background?',
        answer: 'Yes, 100%! The course begins with Week 1 Python basics from scratch (variables, loops, Jupyter setup) before moving step-by-step into Pandas, visualization, and projects.'
      },
      {
        question: 'Are the classes live or pre-recorded?',
        answer: 'All sessions are 100% Online Live Classes with Prof. MD Tahseen Equbal, featuring interactive live Q&A, weekend doubt sessions, and lifetime recording access.'
      },
      {
        question: 'What datasets will I work on during the course?',
        answer: 'You will work on 3 real-world datasets: 1. Sales Dataset (Trends & Best Selling Products), 2. Student Dataset (Performance & Pass/Fail Analysis), and 3. E-Commerce / Customer Dataset (Customer Segmentation & RFM Analysis).'
      },
      {
        question: 'How do I receive the verified MEW Academy certificate?',
        answer: 'Upon completing the Week 4 EDA capstone project, you receive an official verifiable digital Certificate of Completion signed by Prof. MD Tahseen Equbal, featuring a scannable QR code and unique credential ID.'
      }
    ]
  }
];
