import React from 'react';

const TemplateClassic = ({ data }) => {
  return (
    <div className="font-serif">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-wider">{data.fullName}</h1>
        <p className="text-sm text-gray-600 mt-1">
          {data.address} | {data.phoneNumber} | {data.email}
        </p>
      </div>
      <div className="border-t-2 border-black pt-4">
        <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-3">Summary</h2>
            <p className="text-gray-800">{data.summary}</p>
        </section>
        <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-3">Experience</h2>
            {data.experience.map(exp => (
                <div key={exp.id} className="mb-4">
                    <h3 className="font-bold">{exp.title}, <span className="font-normal italic">{exp.company}</span></h3>
                    <p className="text-sm text-gray-600">{exp.location} ({exp.date})</p>
                    <p className="mt-1 text-gray-800">{exp.description}</p>
                </div>
            ))}
        </section>
         <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-3">Education</h2>
            {data.education.map(edu => (
                <div key={edu.id}>
                    <h3 className="font-bold">{edu.degree}</h3>
                    <p>{edu.institution} - {edu.date}</p>
                </div>
            ))}
        </section>
        <section>
             <h2 className="text-lg font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-3">Skills</h2>
             <p>{data.skills.join(' • ')}</p>
        </section>
      </div>
    </div>
  );
};

export default TemplateClassic;

