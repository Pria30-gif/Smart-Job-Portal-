import React from 'react';

const TemplateModern = ({ data }) => {
  return (
    <div className="font-sans text-gray-800">
      {/* Header */}
      <div className="text-center border-b-2 border-blue-600 pb-4 mb-6">
        <h1 className="text-4xl font-bold text-blue-800">{data.fullName}</h1>
        <p className="text-md text-gray-600 mt-2">
          {data.email} | {data.phoneNumber} | {data.address}
        </p>
      </div>

      {/* Summary */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-blue-700 border-b border-gray-300 pb-2 mb-3">Professional Summary</h2>
        <p className="text-gray-700">{data.summary}</p>
      </section>

      {/* Experience */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-blue-700 border-b border-gray-300 pb-2 mb-3">Work Experience</h2>
        {data.experience.map(exp => (
          <div key={exp.id} className="mb-4">
            <h3 className="text-lg font-semibold">{exp.title} - <span className="font-normal text-gray-700">{exp.company}</span></h3>
            <p className="text-sm text-gray-500">{exp.date} | {exp.location}</p>
            <p className="mt-1 text-gray-700">{exp.description}</p>
          </div>
        ))}
      </section>

      {/* Education */}
      <section className="mb-6">
         <h2 className="text-xl font-bold text-blue-700 border-b border-gray-300 pb-2 mb-3">Education</h2>
         {data.education.map(edu => (
             <div key={edu.id}>
                <h3 className="text-lg font-semibold">{edu.degree}</h3>
                <p className="text-gray-700">{edu.institution} - {edu.date}</p>
             </div>
         ))}
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-xl font-bold text-blue-700 border-b border-gray-300 pb-2 mb-3">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map(skill => (
            <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{skill}</span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TemplateModern;

