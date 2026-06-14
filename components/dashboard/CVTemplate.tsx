import React, { useState } from 'react';

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

const monthOptions = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 65 }, (_, index) => String(currentYear + 5 - index));

const parseMonthYear = (value: string) => {
  if (!value) {
    return { month: '', year: '', isPresent: false };
  }

  if (value.toLowerCase() === 'present') {
    return { month: '', year: '', isPresent: true };
  }

  const isoMatch = value.match(/^(\d{4})-(\d{2})/);
  if (isoMatch) {
    return {
      month: monthOptions[Math.max(0, Number(isoMatch[2]) - 1)] || '',
      year: isoMatch[1],
      isPresent: false,
    };
  }

  const year = value.match(/\b(19|20)\d{2}\b/)?.[0] || '';
  const lowerValue = value.toLowerCase();
  const month = monthOptions.find((item) => lowerValue.includes(item.toLowerCase())) || '';

  return { month, year, isPresent: false };
};

const formatMonthYear = (month: string, year: string) => {
  if (month && year) return `${month} ${year}`;
  if (year) return year;
  return '';
};

const DateDropdown: React.FC<{
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}> = ({ label, value, placeholder, options, onChange, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        type="button"
        aria-label={label}
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => setIsOpen((current) => !current)}
        className={`flex h-12 w-full items-center justify-between rounded-2xl border px-4 text-left text-sm font-black transition ${
          disabled
            ? 'cursor-not-allowed border-slate-100 bg-slate-100 text-slate-300'
            : isOpen
              ? 'border-blue-300 bg-white text-slate-900 ring-4 ring-blue-50'
              : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-white'
        }`}
      >
        <span className={value ? 'text-slate-900' : 'text-slate-400'}>{value || placeholder}</span>
        <span className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>v</span>
      </button>

      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl shadow-slate-900/10">
          <div className="max-h-56 overflow-y-auto p-2">
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
              className="w-full rounded-xl px-3 py-2 text-left text-sm font-bold text-slate-400 hover:bg-slate-50"
            >
              {placeholder}
            </button>
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full rounded-xl px-3 py-2 text-left text-sm font-bold transition ${
                  value === option ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MonthYearField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  allowPresent?: boolean;
}> = ({ label, value, onChange, allowPresent = false }) => {
  const parsed = parseMonthYear(value);

  const updateDate = (nextMonth: string, nextYear: string) => {
    onChange(formatMonthYear(nextMonth, nextYear));
  };

  return (
    <div className="min-w-0">
      <div className="mb-2 flex min-h-7 items-center justify-between gap-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
        {allowPresent ? (
          <button
            type="button"
            onClick={() => onChange(parsed.isPresent ? '' : 'Present')}
            className={`rounded-full px-3 py-1 text-[10px] font-black ${
              parsed.isPresent ? 'bg-blue-600 text-white' : 'bg-white text-slate-400'
            }`}
          >
            Current
          </button>
        ) : (
          <span className="invisible rounded-full px-3 py-1 text-[10px] font-black">Current</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <DateDropdown
          label={`${label} month`}
          value={parsed.isPresent ? '' : parsed.month}
          placeholder="Month"
          options={monthOptions}
          onChange={(nextMonth) => updateDate(nextMonth, parsed.year)}
          disabled={parsed.isPresent}
        />
        <DateDropdown
          label={`${label} year`}
          value={parsed.isPresent ? '' : parsed.year}
          placeholder="Year"
          options={yearOptions}
          onChange={(nextYear) => updateDate(parsed.month, nextYear)}
          disabled={parsed.isPresent}
        />
      </div>
    </div>
  );
};

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
    <div className="mx-auto w-full max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-5 font-sans text-slate-900 shadow-sm sm:p-8 md:p-10">
      <header className="border-b border-slate-200 pb-8">
        {isEditing ? (
          <input
            type="text"
            value={data.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-2xl font-black tracking-tight text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50 sm:text-3xl"
            placeholder="Your name"
          />
        ) : (
          <h1 className="break-words text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{data.name}</h1>
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
          <p className="mt-3 break-words text-lg font-black text-blue-600 sm:text-xl">{data.jobTitle}</p>
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
                    <div className="grid grid-cols-1 gap-3 md:col-span-2 md:grid-cols-2">
                      <MonthYearField
                        label="Start date"
                        value={job.startDate}
                        onChange={(value) => handleHistoryChange(index, 'startDate', value)}
                      />
                      <MonthYearField
                        label="End date"
                        value={job.endDate}
                        onChange={(value) => handleHistoryChange(index, 'endDate', value)}
                        allowPresent
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
                    {(job.startDate || job.endDate) && (
                      <p className="text-sm font-bold text-slate-400">
                        {job.startDate || 'Start'} - {job.endDate || 'Now'}
                      </p>
                    )}
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
