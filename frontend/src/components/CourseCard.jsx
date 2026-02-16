import './CourseCard.css';

function CourseCard({ course }) {
    // Parse actual course data from Excel
    const courseName = course['Course Name'] || 'Unknown Course';
    const department = course['Department'] || '';
    const skills = course['Skills'] || '';
    const industryDomain = course['Industry Domain'] || '';
    const courseType = course['Course type'] || '';
    const coursePathway = course['Course Pathway'] || '';
    const courseLevel = course['Course Level'] || '';
    const jobRole = course['Job role to skill'] || course['job role to skill'] || '';

    // Parse domains and skills into arrays
    const domains = industryDomain ? industryDomain.split(',').map(d => d.trim()).filter(d => d && d.toLowerCase() !== 'nan').slice(0, 3) : [];
    const skillsList = skills ? skills.split(',').map(s => s.trim()).filter(s => s && s.toLowerCase() !== 'nan').slice(0, 4) : [];

    // Get level badge color
    const getLevelColor = (level) => {
        const l = (level || '').toLowerCase();
        if (l.includes('beginner') || l.includes('basic')) return 'level-beginner';
        if (l.includes('advanced')) return 'level-advanced';
        if (l.includes('intermediate')) return 'level-intermediate';
        return 'level-default';
    };

    return (
        <div className="course-card-new">
            {/* Header: Title */}
            <div className="card-header">
                <h3 className="course-title">{courseName}</h3>
                {courseLevel && (
                    <span className={`level-badge ${getLevelColor(courseLevel)}`}>
                        {courseLevel}
                    </span>
                )}
            </div>

            {/* Department & Type */}
            <div className="course-info">
                {department && (
                    <span className="info-item">
                        <span className="info-icon">🏛️</span>
                        {department}
                    </span>
                )}
                {courseType && (
                    <span className="info-item">
                        <span className="info-icon">📋</span>
                        {courseType}
                    </span>
                )}
            </div>

            {/* Course Pathway */}
            {coursePathway && (
                <p className="course-pathway">
                    {coursePathway}
                </p>
            )}

            {/* Domains */}
            {domains.length > 0 && (
                <div className="course-section">
                    <span className="section-label">DOMAINS</span>
                    <div className="tags-container">
                        {domains.map((domain, idx) => (
                            <span key={idx} className="tag domain-tag">{domain}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            {skillsList.length > 0 && (
                <div className="course-section">
                    <span className="section-label">SKILLS</span>
                    <div className="tags-container">
                        {skillsList.map((skill, idx) => (
                            <span key={idx} className="tag skill-tag">{skill}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Job Role */}
            {jobRole && jobRole.toLowerCase() !== 'nan' && (
                <div className="course-section">
                    <span className="section-label">JOB ROLES</span>
                    <p className="job-role-text">{jobRole}</p>
                </div>
            )}
        </div>
    );
}

export default CourseCard;
