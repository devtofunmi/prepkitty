
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { Loader2, Upload, User, Briefcase, Award, ArrowRight, Plus, X as RemoveIcon, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomSelect from '../components/dashboard/practice/CustomSelect';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface SubField {
  value: string;
  label: string;
}

const jobFields: { value: string; label: string; subfields?: SubField[] }[] = [
  {
    value: 'engineering', label: 'Engineering', subfields: [
      { value: 'software', label: 'Software' },
      { value: 'mechanical', label: 'Mechanical' },
      { value: 'electrical', label: 'Electrical' },
      { value: 'civil', label: 'Civil' },
      { value: 'chemical', label: 'Chemical' },
    ]
  },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'product', label: 'Product' },
  { value: 'design', label: 'Design' },
  { value: 'finance', label: 'Finance' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'other', label: 'Other' },
];

interface OnboardingData {
  jobTitle: string;
  professionalSummary: string;
  name: string;
  employmentHistory: { role: string; startDate: string; endDate: string }[];
  skills: string;
  additionalDetails: string;
  jobField: string;
  subField: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    jobTitle: '',
    professionalSummary: '',
    name: '',
    employmentHistory: [{ role: '', startDate: '', endDate: '' }],
    skills: '',
    additionalDetails: '',
    jobField: '',
    subField: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      if (session?.user?.onboardingCompleted) {
        router.push('/dashboard');
      } else if (!onboardingData.name) {
        setOnboardingData(prevData => ({ ...prevData, name: session.user?.name || '' }));
      }
    }
  }, [status, router, session, onboardingData.name]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setCvFile(file);
      handleCvUpload(file);
    }
  };

  const handleCvUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('cv', file);

    try {
      const response = await fetch('/api/cv-upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        const employmentHistory = data.experiences?.map((exp: { jobTitle: string; startDate: string; endDate: string; }) => ({
          role: exp.jobTitle,
          startDate: exp.startDate,
          endDate: exp.endDate,
        }));

        let jobField = '';
        let subField = '';
        let jobTitle = '';

        if (data.experiences && data.experiences.length > 0) {
          const mostRecentExperience = data.experiences[0];
          jobTitle = mostRecentExperience.jobTitle;
          const category = mostRecentExperience.jobCategory;

          const mainFieldMatch = jobFields.find(f => f.label.toLowerCase() === category.toLowerCase());
          if (mainFieldMatch) {
            jobField = mainFieldMatch.value;
          } else {
            for (const mainField of jobFields) {
              if (mainField.subfields) {
                const subFieldMatch = mainField.subfields.find(sf => sf.label.toLowerCase() === category.toLowerCase());
                if (subFieldMatch) {
                  jobField = mainField.value;
                  subField = subFieldMatch.value;
                  break;
                }
              }
            }
          }
          if (!jobField && jobTitle) {
            jobField = 'other';
          }
        }

        setOnboardingData(prevData => ({
          ...prevData,
          name: data.name || prevData.name,
          professionalSummary: data.professionalSummary || prevData.professionalSummary,
          skills: data.skills || prevData.skills,
          employmentHistory: employmentHistory && employmentHistory.length > 0 ? employmentHistory : prevData.employmentHistory,
          jobField: jobField || prevData.jobField,
          subField: subField || prevData.subField,
          jobTitle: jobTitle || prevData.jobTitle,
        }));

        toast.success('CV data extracted successfully!');
      } else {
        const errorData = await response.json();
        console.error('CV Upload Error details:', errorData);
        toast.error(`Failed to extract data: ${errorData.error || 'Check console for details'}`);
      }
    } catch (error) {
      console.error('CV upload error:', error);
      toast.error('An error occurred while uploading the CV.');
    }
    setIsUploading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOnboardingData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleJobFieldChange = (value: string) => {
    const selectedField = jobFields.find(field => field.value === value);
    const jobTitle = selectedField && !selectedField.subfields ? selectedField.label : '';
    setOnboardingData(prevData => ({
      ...prevData,
      jobField: value,
      subField: '',
      jobTitle: value === 'other' ? '' : jobTitle,
    }));
  };

  const handleSubFieldChange = (value: string) => {
    const selectedField = jobFields.find(field => field.value === onboardingData.jobField);
    const selectedSubField = selectedField?.subfields?.find(sf => sf.value === value);
    const jobTitle = selectedField && selectedSubField ? `${selectedSubField.label} ${selectedField.label}` : '';
    setOnboardingData(prevData => ({
      ...prevData,
      subField: value,
      jobTitle,
    }));
  };

  const handleEmploymentHistoryChange = (index: number, field: string, value: string) => {
    const newEmploymentHistory = [...onboardingData.employmentHistory];
    newEmploymentHistory[index] = { ...newEmploymentHistory[index], [field]: value };
    setOnboardingData(prevData => ({ ...prevData, employmentHistory: newEmploymentHistory }));
  };

  const addEmploymentField = () => {
    if (onboardingData.employmentHistory.length < 3) {
      setOnboardingData(prevData => ({ ...prevData, employmentHistory: [...prevData.employmentHistory, { role: '', startDate: '', endDate: '' }] }));
    }
  };

  const removeEmploymentField = (index: number) => {
    const newEmploymentHistory = [...onboardingData.employmentHistory];
    newEmploymentHistory.splice(index, 1);
    setOnboardingData(prevData => ({ ...prevData, employmentHistory: newEmploymentHistory }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(onboardingData),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Something went wrong. Please try again.');
        console.error('Onboarding error:', errorData);
      }
    } catch (e) {
      console.error('Onboarding error:', e);
      toast.error('An unexpected error occurred. Please try again later.');
    }
    setIsLoading(false);
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="h-screen flex font-sans bg-white overflow-hidden">
      <Head>
        <title>Onboarding - PrepKitty</title>
      </Head>

      {/* LEFT SIDE: FIXED PREPKITTY BRAND */}
      <div className="hidden lg:flex w-[35%] bg-black relative flex-col justify-between p-16 text-white border-r border-white/5 h-full shrink-0">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <Link href="/"><Image src="/prepkitty_logo.png" alt="PrepKitty" width={160} height={45} /></Link>
        </div>

        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.85] mb-12">
            Prepare for your <br />
            <span className="text-blue-500 italic underline decoration-blue-500/30 underline-offset-8">next move.</span>
          </h1>

          <div className="space-y-10">
            {[
              { title: "CV Analysis", desc: "Automatic pre-fill for maximum speed." },
              { title: "Custom Paths", desc: "Practice questions built for your specific role." }
            ].map((item, i) => (
              <div key={i} className="flex gap-5 items-start">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h4 className="font-black text-lg mb-1">{item.title}</h4>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10" />
      </div>

      {/* RIGHT SIDE: SCROLLABLE ONBOARDING FORM */}
      <div className="flex-1 bg-slate-50 lg:bg-white overflow-y-auto relative h-full">
        <div className="min-h-full flex items-center justify-center p-8 md:p-20">
          <div className="w-full max-w-[700px] relative z-10">

            {/* Header for Mobile/Title */}
            <div className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-px bg-slate-200" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Account Setup</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
                Tell us <br />
                <span className="italic text-blue-600 underline decoration-blue-200 underline-offset-4">everything.</span>
              </h2>
              <p className="text-slate-500 font-medium italic text-lg leading-relaxed">
                Your background determines the technical depth of your practice sessions.
              </p>
            </div>

            {/* CV Upload Fast-Track */}
            <div className="mb-20 group">
              <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-blue-500/5">
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex flex-col md:flex-row items-center gap-10">
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl shadow-blue-500/5 shrink-0 group-hover:scale-110 transition-transform">
                    {isUploading ? <Loader2 className="animate-spin text-blue-600" size={32} /> : <Upload className="text-blue-600" size={32} />}
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Fast-track with your CV.</h3>
                    <p className="text-slate-500 font-medium italic text-sm mb-6">Upload your resume to automatically pre-fill this form.</p>
                    <label className="inline-flex w-full md:w-auto items-center justify-center px-8 py-4 rounded-full bg-blue-600 text-white font-black hover:bg-blue-700 transition-all cursor-pointer shadow-xl shadow-blue-600/20 active:scale-95 text-sm">
                      <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
                      <span className="truncate max-w-[200px] md:max-w-none">
                        {cvFile ? cvFile.name : 'Choose Resume (.pdf, .docx)'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 mb-20 opacity-20">
              <div className="flex-1 h-px bg-slate-300" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 italic">Manual Profile</span>
              <div className="flex-1 h-px bg-slate-300" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-20">

              {/* Step 1: Profile */}
              <div className="space-y-10">
                <div className="flex items-center gap-3">
                  <User size={18} className="text-blue-500" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 italic">Personal Context</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="w-full px-8 py-5 rounded-[2rem] bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-medium transition-all"
                      placeholder="Your Name"
                      value={onboardingData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Primary Industry</label>
                    <CustomSelect
                      options={jobFields.map(field => ({ value: field.value, label: field.label }))}
                      value={onboardingData.jobField}
                      onChange={handleJobFieldChange}
                      placeholder="Select industry..."
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {onboardingData.jobField === 'engineering' && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                      <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Specialized Discipline</label>
                      <CustomSelect
                        options={jobFields.find(field => field.value === 'engineering')?.subfields || []}
                        value={onboardingData.subField}
                        onChange={handleSubFieldChange}
                        placeholder="Select discipline..."
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {(onboardingData.jobField === 'other' || !onboardingData.jobField) && (
                  <div className="space-y-3">
                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Current/Target Role</label>
                    <input
                      type="text"
                      name="jobTitle"
                      className="w-full px-8 py-5 rounded-[2rem] bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-medium transition-all"
                      placeholder="E.g. Senior Software Engineer"
                      value={onboardingData.jobTitle}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}
              </div>

              {/* Step 2: Experience */}
              <div className="space-y-10">
                <div className="flex items-center gap-3">
                  <Award size={18} className="text-blue-500" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 italic">Professional History</h4>
                </div>

                <div className="space-y-3">
                  <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Professional Summary</label>
                  <textarea
                    name="professionalSummary"
                    rows={4}
                    className="w-full px-8 py-6 rounded-[2rem] bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-medium transition-all leading-relaxed"
                    placeholder="Briefly describe your career achievements..."
                    value={onboardingData.professionalSummary}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-5">
                  <div className="flex justify-between items-center px-1">
                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Past Roles</label>
                    <span className="text-[10px] text-slate-300 font-black tracking-widest uppercase italic">Up to 3 entries</span>
                  </div>

                  <div className="space-y-4">
                    {onboardingData.employmentHistory.map((history, index) => (
                      <div key={index} className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 relative group">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <input
                              type="text"
                              className="w-full px-6 py-4 rounded-full bg-white border border-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-medium transition-all"
                              placeholder="Job Title"
                              value={history.role}
                              onChange={(e) => handleEmploymentHistoryChange(index, 'role', e.target.value)}
                            />
                          </div>
                          <input
                            type="text"
                            onFocus={(e) => (e.target.type = 'date')}
                            onBlur={(e) => (e.target.type = 'text')}
                            className="px-6 py-4 rounded-full bg-white border border-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-medium transition-all text-sm text-slate-500"
                            placeholder="Start Date"
                            value={history.startDate}
                            onChange={(e) => handleEmploymentHistoryChange(index, 'startDate', e.target.value)}
                          />
                          <input
                            type="text"
                            onFocus={(e) => (e.target.type = 'date')}
                            onBlur={(e) => (e.target.type = 'text')}
                            className="px-6 py-4 rounded-full bg-white border border-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-medium transition-all text-sm text-slate-500"
                            placeholder="End Date"
                            value={history.endDate}
                            onChange={(e) => handleEmploymentHistoryChange(index, 'endDate', e.target.value)}
                          />
                        </div>
                        {onboardingData.employmentHistory.length > 1 && (
                          <button type="button" onClick={() => removeEmploymentField(index)} className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white shadow-lg border border-slate-100 text-slate-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center"><RemoveIcon size={14} /></button>
                        )}
                      </div>
                    ))}
                    {onboardingData.employmentHistory.length < 3 && (
                      <button type="button" onClick={addEmploymentField} className="w-full py-4 rounded-full border-2 border-dashed border-slate-200 text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                        <Plus size={14} /> Add Experience
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 3: Meta */}
              <div className="space-y-10">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-blue-500" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 italic">Self Evaluation</h4>
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Hard & Soft Skills</label>
                    <input
                      type="text"
                      name="skills"
                      className="w-full px-8 py-5 rounded-[2rem] bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-medium transition-all"
                      placeholder="E.g. Strategy, AWS, High Performance Computing"
                      value={onboardingData.skills}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Detailed Introduction</label>
                    <textarea
                      name="additionalDetails"
                      rows={6}
                      className="w-full px-8 py-6 rounded-[2rem] bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-medium transition-all leading-relaxed"
                      placeholder="Tell us about yourself and your unique career ambitions..."
                      value={onboardingData.additionalDetails}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submission */}
              <div className="pt-10">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-[2rem] transition-all shadow-2xl shadow-blue-600/20 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-4 text-lg group"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>Finalize Profile <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" /></>
                  )}
                </button>
                <p className="text-slate-400 text-xs font-medium text-center mt-8 italic px-10">
                  Your data is securely processed to generate a custom interview playbook.
                  You can update these details later in your settings.
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Fixed "Back" reference for tablet/mobile overlay might be needed, but logic is onboarding */}
      </div>

      <ToastContainer position="bottom-center" />
    </div>
  );
}