import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { prisma } from '@/lib/prisma';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Layout from '../components/dashboard/Layout';
import { CVTemplate } from '../components/dashboard/CVTemplate';
import { Loader2, Download, Edit, PlusCircle, Save, FileText, Sparkles } from 'lucide-react';
import { useRouter } from 'next/router';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";


type CVData = {
  name: string;
  jobTitle: string;
  professionalSummary: string;
  employmentHistory: Array<{
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: string;
  additionalDetails: string;
  portfolioLink?: string;
  gmailLink?: string;
  githubLink?: string;
  projects?: Array<{
    projectName: string;
    description: string;
    stacks: string;
    link: string;
  }>;
};



export default function CVPage({ cv: initialCv }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [cv, setCv] = useState(initialCv);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const router = useRouter();
  const cvRef = useRef<HTMLDivElement>(null); 


  const handlePrint = async () => {
    if (!cvRef.current) return;
    setIsDownloading(true);
    const element = cvRef.current;
    const originalHeight = element.style.height;
    element.style.height = `${element.scrollHeight}px`;

    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      window.scrollTo(0, 0);
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        height: element.scrollHeight,
        windowHeight: element.scrollHeight
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      const cvRect = element.getBoundingClientRect();

      const ensureHttps = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:')) {
          return url;
        }
        return `https://${url}`;
      }

      const addLink = (elementId: string, url: string) => {
        const linkElement = document.getElementById(elementId);
        if (linkElement) {
          const rect = linkElement.getBoundingClientRect();
          const x = ((rect.left - cvRect.left) / cvRect.width) * pdfWidth;
          const y = ((rect.top - cvRect.top) / cvRect.height) * pdfHeight;
          const w = (rect.width / cvRect.width) * pdfWidth;
          const h = (rect.height / cvRect.height) * pdfHeight;
          pdf.link(x, y, w, h, { url: ensureHttps(url) });
        }
      };

      if (cv.portfolioLink) {
        addLink('portfolio-link', cv.portfolioLink);
      }
      if (cv.gmailLink) {
        addLink('gmail-link', `mailto:${cv.gmailLink}`);
      }
      if (cv.githubLink) {
        addLink('github-link', cv.githubLink);
      }
      cv.projects?.forEach((project: { link: string }, index: number) => {
        if (project.link) {
          addLink(`project-link-${index}`, project.link);
        }
      });

      pdf.save(`${cv.name}_CV.pdf`);
    } catch (error) {
      console.error('PDF ERROR:', error);
    } finally {
      element.style.height = originalHeight;
      setIsDownloading(false);
    }
  };


  useEffect(() => {
    if (!initialCv) {
      setIsEditing(true);
    }
  }, [initialCv]);

  const handleGenerateNewCV = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/cv', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to generate CV');
      }
      router.replace(router.asPath); // Refresh page to get new CV
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };



  const handleSave = async () => {
    if (!cv) return;
    setIsSaving(true);
    try {
      const { id, ...content } = cv;
      const response = await fetch(`/api/cv/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
        console.error('Failed to save CV. Status:', response.status, 'Response:', errorData);
        throw new Error(`Failed to save CV. Status: ${response.status}`);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error in handleSave:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDataChange = (newData: CVData) => {
    setCv((prev: (CVData & { id: string }) | null) => (prev ? { ...prev, ...newData } : null));
  };

  if (!cv) {
    return (
      <Layout>
        <Head>
          <title>CV Profile - PrepKitty</title>
        </Head>
        <div className="space-y-12 md:space-y-16">
          <section className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-slate-200" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">CV Profile</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none mb-4">
              Build your <br />
              <span className="italic text-blue-600 underline decoration-blue-100 underline-offset-4">CV.</span>
            </h1>
            <p className="text-slate-500 font-medium italic text-lg">Create a clean CV from your profile details.</p>
          </section>

          <section className="rounded-[3rem] border border-dotted border-slate-200 bg-slate-50 p-8 text-center md:p-16">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white text-blue-600 shadow-sm">
              <FileText size={34} />
            </div>
            <h2 className="mb-4 text-3xl font-black tracking-tighter text-slate-900 italic">No CV yet</h2>
            <p className="mx-auto mb-8 max-w-md text-slate-500 font-medium italic">
              Generate your first CV using the profile information you already added.
            </p>
            <button
              onClick={handleGenerateNewCV}
              className="mx-auto flex items-center justify-center gap-3 rounded-full bg-slate-900 px-8 py-5 font-black text-white shadow-2xl shadow-slate-900/10 transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-50"
              disabled={isGenerating}
            >
              {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <PlusCircle size={20} />}
              {isGenerating ? 'Generating...' : 'Generate CV'}
            </button>
          </section>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>CV Profile - PrepKitty</title>
      </Head>
      <div className="space-y-12 md:space-y-16">
        <section className="relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-slate-200" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">CV Profile</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none mb-4">
                Your CV, <br />
                <span className="italic text-blue-600 underline decoration-blue-100 underline-offset-4">ready to polish.</span>
              </h1>
              <p className="text-slate-500 font-medium italic text-lg">Edit, preview, and download your professional CV.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-3 rounded-full border border-slate-100 bg-white px-8 py-5 font-black text-slate-900 shadow-sm transition-all hover:border-blue-100 hover:bg-blue-50 active:scale-95 disabled:opacity-50"
                disabled={isDownloading}
              >
                {isDownloading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                {isDownloading ? 'Preparing...' : 'Download'}
              </button>

              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="flex items-center justify-center gap-3 rounded-full bg-slate-900 px-8 py-5 font-black text-white shadow-2xl shadow-slate-900/10 transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-50"
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-3 rounded-full bg-slate-900 px-8 py-5 font-black text-white shadow-2xl shadow-slate-900/10 transition-all hover:bg-slate-800 active:scale-95"
                >
                  <Edit size={20} />
                  Edit CV
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[1fr_280px] xl:items-start">
          <div className="rounded-[3rem] border border-slate-100 bg-slate-50 p-3 shadow-xl shadow-blue-500/5 md:p-8">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 italic">CV Preview</h2>
                <p className="mt-2 text-sm font-medium text-slate-400 italic">
                  {isEditing ? 'Editing mode is on.' : 'Preview mode is on.'}
                </p>
              </div>
              <span className={`w-fit rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest ${
                isEditing ? 'bg-blue-50 text-blue-600' : 'bg-white text-slate-400'
              }`}>
                {isEditing ? 'Editing' : 'Preview'}
              </span>
            </div>

            <div className="overflow-x-auto rounded-[2rem]">
              <div ref={cvRef} className="min-w-[720px] md:min-w-0">
                <CVTemplate data={cv} isEditing={isEditing} onDataChange={handleDataChange} />
              </div>
            </div>
          </div>

          <aside className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm xl:sticky xl:top-8">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Sparkles size={22} />
            </div>
            <h3 className="mb-3 text-lg font-black tracking-tight text-slate-900 italic">Quick tips</h3>
            <div className="space-y-4 text-sm font-medium leading-relaxed text-slate-500 italic">
              <p>Keep your summary short and focused.</p>
              <p>Use clear project results, not only tool names.</p>
              <p>Download after saving your latest edits.</p>
            </div>
          </aside>
        </section>
      </div>
    </Layout>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session?.user?.id) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const userWithProfile = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { practiceProfile: true },
  });

  if (!userWithProfile?.practiceProfile) {
    return {
      redirect: {
        destination: '/onboarding',
        permanent: false,
      },
    };
  }
  
  const { name } = userWithProfile;
  const { jobTitle, professionalSummary, employmentHistory, skills, additionalDetails, portfolioLink, gmailLink, githubLink, projects } = userWithProfile.practiceProfile;
  const parsedEmploymentHistory = employmentHistory ? JSON.parse(employmentHistory as string) : [];
  const parsedProjects = projects ? JSON.parse(projects as string) : [];

  const cvData = {
    id: userWithProfile.id, // Using user id as a stand-in for a real CV id
    name: name || '',
    jobTitle: jobTitle || '',
    professionalSummary: professionalSummary || '',
    employmentHistory: parsedEmploymentHistory,
    skills: skills || '',
    additionalDetails: additionalDetails || '',
    portfolioLink: portfolioLink || '',
    gmailLink: gmailLink || '',
    githubLink: githubLink || '',
    projects: parsedProjects,
  };

  return {
    props: {
      cv: JSON.parse(JSON.stringify(cvData)),
    },
  };
};
