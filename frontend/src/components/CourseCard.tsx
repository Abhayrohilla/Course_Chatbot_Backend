import React from 'react';

interface Course {
    'Course Name'?: string;
    'Department'?: string;
    'Skills'?: string;
    'Industry Domain'?: string;
    'Course type'?: string;
    'Course Pathway'?: string;
    'Course Level'?: string;
    'Job role to skill'?: string;
    'job role to skill'?: string;
}

interface CourseCardProps {
    course: Course;
    matchType?: string;
}

function CourseCard({ course }: CourseCardProps) {
    const courseName = course['Course Name'] || 'Unknown Course';
    const department = course['Department'] || '';
    const skills = course['Skills'] || '';
    const industryDomain = course['Industry Domain'] || '';
    const courseType = course['Course type'] || '';
    const coursePathway = course['Course Pathway'] || '';
    const courseLevel = course['Course Level'] || '';
    const jobRole = course['Job role to skill'] || course['job role to skill'] || '';

    const domains = industryDomain ? industryDomain.split(',').map(d => d.trim()).filter(d => d && d.toLowerCase() !== 'nan').slice(0, 3) : [];
    const skillsList = skills ? skills.split(',').map(s => s.trim()).filter(s => s && s.toLowerCase() !== 'nan').slice(0, 4) : [];

    const getLevelConfig = (level: string) => {
        const l = (level || '').toLowerCase();
        if (l.includes('beginner') || l.includes('basic')) return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' };
        if (l.includes('advanced')) return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' };
        if (l.includes('intermediate')) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' };
        return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-100' };
    };

    const levelStyle = getLevelConfig(courseLevel);

    return (
        <div className="flex-none w-[260px] md:w-[320px] bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-600/5 transition-all duration-300 flex flex-col gap-4 group">
            <div className="flex justify-between items-start gap-3">
                <h3 className="text-sm md:text-base font-bold text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors">{courseName}</h3>
                {courseLevel && (
                    <span className={`px-2 py-0.5 rounded text-[10px] md:text-xs font-bold border uppercase tracking-wider ${levelStyle.bg} ${levelStyle.text} ${levelStyle.border}`}>
                        {courseLevel}
                    </span>
                )}
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
                {department && (
                    <span className="flex items-center gap-1.5">
                        <span className="grayscale group-hover:grayscale-0 transition-all">🏛️</span>
                        {department}
                    </span>
                )}
                {courseType && (
                    <span className="flex items-center gap-1.5">
                        <span className="grayscale group-hover:grayscale-0 transition-all">📋</span>
                        {courseType}
                    </span>
                )}
            </div>

            {coursePathway && (
                <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {coursePathway}
                </p>
            )}

            <div className="space-y-3 mt-auto">
                {domains.length > 0 && (
                    <div className="space-y-1.5">
                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">DOMAINS</span>
                        <div className="flex flex-wrap gap-1.5">
                            {domains.map((domain, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] md:text-xs border border-blue-100">
                                    {domain}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {skillsList.length > 0 && (
                    <div className="space-y-1.5">
                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">SKILLS</span>
                        <div className="flex flex-wrap gap-1.5">
                            {skillsList.map((skill, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] md:text-xs border border-slate-200">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {jobRole && jobRole.toLowerCase() !== 'nan' && (
                <div className="pt-3 border-t border-slate-50">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">JOB ROLES</span>
                    <p className="text-[11px] md:text-xs font-medium text-slate-700 leading-snug">{jobRole}</p>
                </div>
            )}
        </div>
    );
}

export default CourseCard;
