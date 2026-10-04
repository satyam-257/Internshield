import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DemoSelector } from './components/DemoSelector';
import { InvestigationInput } from './components/InvestigationInput';
import { ProgressStage } from './components/ProgressStage';
import type { StageItem } from './components/ProgressStage';
import { InvestigationReportView } from './components/InvestigationReportView';
import { LocalAISection } from './components/LocalAISection';
import { HowItWorksModal } from './components/HowItWorksModal';
import { Footer } from './components/Footer';
import type { InvestigationReport, DemoExample } from './types';

const INITIAL_STAGES: StageItem[] = [
  { id: 'extract', label: 'Extracting structured internship details', status: 'pending' },
  { id: 'payment', label: 'Checking applicant payment & fee requests', status: 'pending' },
  { id: 'recruiter', label: 'Inspecting recruiter email and domain consistency', status: 'pending' },
  { id: 'claims', label: 'Looking for urgency tactics and direct-selection claims', status: 'pending' },
  { id: 'ai', label: 'Running local open-weight AI analysis via Ollama', status: 'pending' },
  { id: 'report', label: 'Synthesizing explainable investigation report', status: 'pending' }
];

export const App: React.FC = () => {
  // Input State
  const [activeTab, setActiveTab] = useState<'text' | 'url'>('text');
  const [inputText, setInputText] = useState('');
  const [inputUrl, setInputUrl] = useState('');

  // Flow State
  const [isLoading, setIsLoading] = useState(false);
  const [stages, setStages] = useState<StageItem[]>(INITIAL_STAGES);
  const [report, setReport] = useState<InvestigationReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals & Metadata
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [demoExamples, setDemoExamples] = useState<DemoExample[]>([]);
  const [ollamaStatus, setOllamaStatus] = useState({
    connected: false,
    model: 'Checking...'
  });

  // Fetch initial health and demo examples
  useEffect(() => {
    // 1. Check Backend Health
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setOllamaStatus({
          connected: data.ollama_available,
          model: data.active_model
        });
      })
      .catch(() => {
        fetch('http://127.0.0.1:8000/api/health')
          .then(res => res.json())
          .then(data => {
            setOllamaStatus({
              connected: data.ollama_available,
              model: data.active_model
            });
          })
          .catch(() => {
            setOllamaStatus({
              connected: false,
              model: 'Rule Engine Active'
            });
          });
      });

    // 2. Load Demo Examples
    fetch('/api/demo-examples')
      .then(res => res.json())
      .then(data => {
        if (data.examples) {
          setDemoExamples(data.examples);
        }
      })
      .catch(() => {
        setDemoExamples([
          {
            id: 'suspicious',
            title: 'High Risk Demo (NexaByte)',
            badge: 'High Risk Expected',
            badgeColor: 'red',
            description: 'Upfront registration fee, free Gmail contact, no interview, urgency claims, outsized compensation.',
            text: `Data Science Internship at NexaByte Technologies
We are selecting students for our remote Data Science Internship Program. Earn ₹35,000 per month while working 2 hours per day. NO INTERVIEW REQUIRED. You have been shortlisted directly. Only 10 seats remaining. To confirm your internship seat, submit a refundable registration fee of ₹1,499. Payment must be completed today. Contact: nexabyte.recruitment@gmail.com`
          },
          {
            id: 'legitimate',
            title: 'Low Risk Demo (Acme Systems)',
            badge: 'Low Risk Expected',
            badgeColor: 'green',
            description: 'Verified corporate email domain, multi-stage technical interview, realistic compensation, no fees.',
            text: `Software Engineer Intern - Cloud Systems at Acme Software Technologies Inc.
We are looking for a summer Software Engineer Intern to join our distributed infrastructure team.
Location: Bengaluru (Hybrid: 3 days in office, 2 days remote).
Stipend: ₹45,000 per month.
Requirements: Currently enrolled in a B.Tech / M.Tech in Computer Science or related field. Experience with Python, Go, or Java.
Interview Process:
1. Online technical coding assessment
2. Technical interview with Senior Systems Engineer
3. Culture & Team fit discussion
No application fees or deposits are ever requested from applicants.
Apply through our official careers portal or email our university recruiting team at: university-recruiting@acmesoftware.io`
          },
          {
            id: 'ambiguous',
            title: 'Needs Verification Demo (NovaPulse Labs)',
            badge: 'Needs Verification',
            badgeColor: 'yellow',
            description: 'Early stage team with Gmail contact, reasonable stipend, no fees, but warrants domain verification.',
            text: `Product Design Intern at NovaPulse Labs
NovaPulse Labs is an early-stage student-founded robotics startup based in Pune.
We are looking for a passionate Product Design Intern to assist with 3D enclosure modeling and user testing.
Duration: 3 months (Remote).
Stipend: ₹12,000 per month.
Requirements: Basic Figma/CAD familiarity, eagerness to learn.
Evaluation: Portfolio review followed by a 30-minute Google Meet conversation.
Note: As our website is currently undergoing a redesign, please email your resume and portfolio directly to: novapulselabs.hiring@gmail.com. We never ask for any money or deposit.`
          }
        ]);
      });
  }, []);

  const handleSelectExample = (example: DemoExample, autoSubmit: boolean = false) => {
    setActiveTab('text');
    setInputText(example.text);
    setErrorMessage(null);
    setReport(null);

    if (autoSubmit) {
      setTimeout(() => {
        runInvestigation(example.text, undefined);
      }, 100);
    } else {
      const el = document.getElementById('check-internship');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const runInvestigation = async (overrideText?: string, overrideUrl?: string) => {
    const textToSend = overrideText !== undefined ? overrideText : inputText;
    const urlToSend = overrideUrl !== undefined ? overrideUrl : inputUrl;

    if (activeTab === 'text' && !textToSend.trim()) {
      setErrorMessage('Please paste an internship or job description to investigate.');
      return;
    }
    if (activeTab === 'url' && !urlToSend.trim()) {
      setErrorMessage('Please enter an internship URL to analyze.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setReport(null);

    setStages([
      { id: 'extract', label: 'Extracting structured internship details', status: 'in_progress' },
      { id: 'payment', label: 'Checking applicant payment & fee requests', status: 'pending' },
      { id: 'recruiter', label: 'Inspecting recruiter email and domain consistency', status: 'pending' },
      { id: 'claims', label: 'Looking for urgency tactics and direct-selection claims', status: 'pending' },
      { id: 'ai', label: 'Running local open-weight AI analysis via Ollama', status: 'pending' },
      { id: 'report', label: 'Synthesizing explainable investigation report', status: 'pending' }
    ]);

    const stepTimers: any[] = [];

    stepTimers.push(setTimeout(() => {
      setStages(prev => prev.map((s, idx) => idx === 0 ? { ...s, status: 'completed' } : idx === 1 ? { ...s, status: 'in_progress' } : s));
    }, 400));

    stepTimers.push(setTimeout(() => {
      setStages(prev => prev.map((s, idx) => idx <= 1 ? { ...s, status: 'completed' } : idx === 2 ? { ...s, status: 'in_progress' } : s));
    }, 800));

    stepTimers.push(setTimeout(() => {
      setStages(prev => prev.map((s, idx) => idx <= 2 ? { ...s, status: 'completed' } : idx === 3 ? { ...s, status: 'in_progress' } : s));
    }, 1200));

    stepTimers.push(setTimeout(() => {
      setStages(prev => prev.map((s, idx) => idx <= 3 ? { ...s, status: 'completed' } : idx === 4 ? { ...s, status: 'in_progress' } : s));
    }, 1600));

    try {
      const payload = activeTab === 'text'
        ? { text: textToSend }
        : { url: urlToSend };

      let response: Response;
      try {
        response = await fetch('/api/investigate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch {
        response = await fetch('http://127.0.0.1:8000/api/investigate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server returned error (${response.status})`);
      }

      const reportData: InvestigationReport = await response.json();

      setStages(prev => prev.map(s => ({ ...s, status: 'completed' })));

      setTimeout(() => {
        setReport(reportData);
        setIsLoading(false);

        setTimeout(() => {
          const reportEl = document.getElementById('investigation-report');
          if (reportEl) {
            reportEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }, 500);

    } catch (err: any) {
      stepTimers.forEach(clearTimeout);
      setIsLoading(false);
      setErrorMessage(err.message || 'An unexpected error occurred during analysis.');
      setStages(INITIAL_STAGES);
    }
  };

  const handleReset = () => {
    setInputText('');
    setInputUrl('');
    setReport(null);
    setErrorMessage(null);
    setStages(INITIAL_STAGES);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <Navbar
        ollamaStatus={ollamaStatus}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onScrollToInput={() => {
          const el = document.getElementById('check-internship');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onScrollToAboutAI={() => {
          const el = document.getElementById('about-open-ai');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Hero Section */}
        <Hero
          onCheckClick={() => {
            const el = document.getElementById('check-internship');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Demo Selector */}
        <div className="pt-10">
          <DemoSelector
            examples={demoExamples}
            onSelectExample={handleSelectExample}
            isLoading={isLoading}
          />
        </div>

        {/* Main Input Form */}
        <InvestigationInput
          text={inputText}
          url={inputUrl}
          activeTab={activeTab}
          onTextChange={setInputText}
          onUrlChange={setInputUrl}
          onTabChange={setActiveTab}
          onSubmit={() => runInvestigation()}
          onReset={handleReset}
          isLoading={isLoading}
          errorMessage={errorMessage || undefined}
        />

        {/* Staged Loading Progress */}
        {isLoading && (
          <ProgressStage stages={stages} />
        )}

        {/* Investigation Report Display */}
        {report && !isLoading && (
          <div className="pt-12">
            <InvestigationReportView
              report={report}
              onReset={handleReset}
            />
          </div>
        )}

        {/* Open-Source AI Section */}
        <LocalAISection />

      </main>

      {/* How It Works Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default App;
