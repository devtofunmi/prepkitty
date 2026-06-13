import React from 'react';

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

type CVTemplateProps = {
  data: CVData;
  isEditing?: boolean;
  onDataChange?: (newData: CVData) => void;
};

const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50';

const textareaClass = `${inputClass} min-h-[120px] resize-y leading-relaxed`;

export const CVTemplate: React.FC<CVTemplateProps> = ({
  data,
  isEditing = false,
  onDataChange = () => {},
}) => {
  const handleInputChange = (field: keyof CVData, value: CVData[keyof CVData]) => {
    onDataChange({ ...data, [field]: value });
  };

  const handleHistoryChange = (index: number, field: string, value: string) => {
    const newHistory = [...(data.employmentHistory || [])];
    newHistory[index] = { ...newHistory[index], [field]: value };
    handleInputChange('employmentHistory', newHistory);
  };

  const addHistoryEntry = () => {
    const newHistory = [
      ...(data.employmentHistory || []),
      { jobTitle: '', company: '', location: '', startDate: '', endDate: '', description: '' },
    ];
    handleInputChange('employmentHistory', newHistory);
  };

  const removeHistoryEntry = (index: number) => {
    const newHistory = (data.employmentHistory || []).filter((_, i) => i !== index);
    handleInputChange('employmentHistory', newHistory);
  };

  const handleProjectChange = (index: number, field: string, value: string) => {
    const newProjects = [...(data.projects || [])];
    newProjects[index] = { ...newProjects[index], [field]: value };
    handleInputChange('projects', newProjects);
  };

  const addProjectEntry = () => {
    const newProjects = [
      ...(data.projects || []),
      { projectName: '', description: '', stacks: '', link: '' },
    ];
    handleInputChange('projects', newProjects);
  };

  const removeProjectEntry = (index: number) => {
    const newProjects = (data.projects || []).filter((_, i) => i !== index);
    handleInputChange('projects', newProjects);
  };

  return (
    <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-8 font-sans text-slate-900 shadow-sm md:p-10">
      <header className="border-b border-slate-200 pb-8">
        {isEditing ? (
          <input
            type="text"
            value={data.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-3xl font-black tracking-tight text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50"
            placeholder="Your name"
          />
        ) : (
          <h1 className="text-4xl font-black tracking-tight text-slate-950">{data.name}</h1>
        )}

        {isEditing ? (
          <input
            type="text"
            value={data.jobTitle}
            onChange={(e) => handleInputChange('jobTitle', e.target.value)}
            className={`${inputClass} mt-4 text-base`}
            placeholder="Job title"
          />
        ) : (
          <p className="mt-3 text-xl font-black text-blue-600">{data.jobTitle}</p>
        )}

        {isEditing ? (
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              { field: 'portfolioLink', label: 'Portfolio link' },
              { field: 'gmailLink', label: 'Email address' },
              { field: 'githubLink', label: 'GitHub link' },
            ].map((item) => (
              <input
                key={item.field}
                type="text"
                placeholder={item.label}
                value={(data[item.field as keyof CVData] as string) ?? ''}
                onChange={(e) => handleInputChange(item.field as keyof CVData, e.target.value)}
                className={inputClass}
              />
            ))}
          </div>
        ) : (
          <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold">
            {data.portfolioLink && (
              <a
                id="portfolio-link"
                href={data.portfolioLink.startsWith('http') ? data.portfolioLink : `https://${data.portfolioLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-blue-50 px-4 py-2 text-blue-600"
              >
                Portfolio
              </a>
            )}
            {data.gmailLink && (
              <a id="gmail-link" href={`mailto:${data.gmailLink}`} className="rounded-full bg-blue-50 px-4 py-2 text-blue-600">
                Email
              </a>
            )}
            {data.githubLink && (
              <a
                id="github-link"
                href={data.githubLink.startsWith('http') ? data.githubLink : `https://${data.githubLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-blue-50 px-4 py-2 text-blue-600"
              >
                GitHub
              </a>
            )}
          </div>
        )}
      </header>

      <Section title="Summary">
        {isEditing ? (
          <textarea
            value={data.professionalSummary}
            onChange={(e) => handleInputChange('professionalSummary', e.target.value)}
            className={textareaClass}
            rows={4}
            placeholder="Write a short professional summary"
          />
        ) : (
          <p className="leading-relaxed text-slate-700">{data.professionalSummary}</p>
        )}
      </Section>

      <Section title="Experience">
        <div className="space-y-6">
          {(data.employmentHistory || []).map((job, index) => (
            <article key={index} className="relative rounded-2xl border border-slate-100 bg-white p-5">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Job title"
                      value={job.jobTitle}
                      onChange={(e) => handleHistoryChange(index, 'jobTitle', e.target.value)}
                      className={inputClass}
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={job.company}
                      onChange={(e) => handleHistoryChange(index, 'company', e.target.value)}
                      className={inputClass}
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={job.location}
                      onChange={(e) => handleHistoryChange(index, 'location', e.target.value)}
                      className={inputClass}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        className={inputClass}
                        type="date"
                        value={job.startDate}
                        onChange={(e) => handleHistoryChange(index, 'startDate', e.target.value)}
                      />
                      <input
                        className={inputClass}
                        type="date"
                        value={job.endDate}
                        onChange={(e) => handleHistoryChange(index, 'endDate', e.target.value)}
                      />
                    </div>
                  </div>

                  <textarea
                    className={`${textareaClass} mt-3`}
                    placeholder="Describe what you did and what changed because of your work"
                    value={job.description}
                    onChange={(e) => handleHistoryChange(index, 'description', e.target.value)}
                    rows={3}
                  />

                  <button
                    type="button"
                    onClick={() => removeHistoryEntry(index)}
                    className="mt-3 text-sm font-black text-red-500 hover:text-red-600"
                  >
                    Remove experience
                  </button>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-lg font-black text-slate-950">{job.company}</h3>
                      <p className="font-bold text-slate-700">{job.jobTitle}</p>
                    </div>
                    <p className="text-sm font-bold text-slate-400">
                      {job.startDate} - {job.endDate}
                    </p>
                  </div>
                  {job.location && <p className="mt-1 text-sm font-medium text-slate-400">{job.location}</p>}
                  <p className="mt-4 leading-relaxed text-slate-700">{job.description}</p>
                </>
              )}
            </article>
          ))}
        </div>

        {isEditing && (
          <button type="button" className="mt-5 rounded-full bg-blue-50 px-5 py-3 text-sm font-black text-blue-600" onClick={addHistoryEntry}>
            + Add experience
          </button>
        )}
      </Section>

      {(data.projects?.length || isEditing) && (
        <Section title="Projects">
          <div className="space-y-6">
            {(data.projects || []).map((project, index) => (
              <article key={index} className="rounded-2xl border border-slate-100 bg-white p-5">
                {isEditing ? (
                  <>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <input
                        type="text"
                        placeholder="Project name"
                        value={project.projectName}
                        onChange={(e) => handleProjectChange(index, 'projectName', e.target.value)}
                        className={inputClass}
                      />
                      <input
                        type="text"
                        placeholder="Project link"
                        value={project.link}
                        onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                        className={inputClass}
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Tech stack"
                      value={project.stacks}
                      onChange={(e) => handleProjectChange(index, 'stacks', e.target.value)}
                      className={`${inputClass} mt-3`}
                    />

                    <textarea
                      placeholder="Describe the project"
                      value={project.description}
                      onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                      className={`${textareaClass} mt-3`}
                      rows={3}
                    />

                    <button
                      type="button"
                      onClick={() => removeProjectEntry(index)}
                      className="mt-3 text-sm font-black text-red-500 hover:text-red-600"
                    >
                      Remove project
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <h3 className="text-lg font-black text-slate-950">{project.projectName}</h3>
                      {project.link && (
                        <a
                          id={`project-link-${index}`}
                          href={project.link.startsWith('http') ? project.link : `https://${project.link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-black text-blue-600"
                        >
                          View Project
                        </a>
                      )}
                    </div>
                    <p className="mt-3 leading-relaxed text-slate-700">{project.description}</p>
                    {project.stacks && (
                      <p className="mt-3 text-sm font-bold text-slate-500">
                        <span className="text-slate-900">Stack:</span> {project.stacks}
                      </p>
                    )}
                  </>
                )}
              </article>
            ))}
          </div>

          {isEditing && (
            <button type="button" className="mt-5 rounded-full bg-blue-50 px-5 py-3 text-sm font-black text-blue-600" onClick={addProjectEntry}>
              + Add project
            </button>
          )}
        </Section>
      )}

      <Section title="Skills">
        {isEditing ? (
          <textarea
            value={data.skills}
            onChange={(e) => handleInputChange('skills', e.target.value)}
            className={textareaClass}
            rows={3}
            placeholder="List your most relevant skills"
          />
        ) : (
          <p className="leading-relaxed text-slate-700">{data.skills}</p>
        )}
      </Section>

      <Section title="Additional Details">
        {isEditing ? (
          <textarea
            value={data.additionalDetails}
            onChange={(e) => handleInputChange('additionalDetails', e.target.value)}
            className={textareaClass}
            rows={3}
            placeholder="Add certifications, languages, awards, or other details"
          />
        ) : (
          <p className="leading-relaxed text-slate-700">{data.additionalDetails}</p>
        )}
      </Section>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section className="border-b border-slate-100 py-8 last:border-b-0 last:pb-0">
    <h2 className="mb-5 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">
      {title}
    </h2>
    {children}
  </section>
);
