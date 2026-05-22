import React from 'react';

const TemplateCreative = ({ data }) => {
  return (
    <div className="flex font-sans">
      {/* Left Sidebar */}
      <div className="w-1/3 bg-gray-800 text-white p-6">
        <h1 className="text-3xl font-bold">{data.fullName}</h1>
        <div className="mt-6">
            <h2 className="text-lg font-semibold uppercase text-gray-400">Contact</h2>
            <div className="mt-2 text-sm space-y-1">
                <p>{data.phoneNumber}</p>
                <p>{data.email}</p>
                <p>{data.address}</p>
            </div>
        </div>
         <div className="mt-6">
            <h2 className="text-lg font-semibold uppercase text-gray-400">Education</h2>
            {data.education.map(edu => (
                 <div key={edu.id} className="mt-2 text-sm">
                    <h3 className="font-bold">{edu.degree}</h3>
                    <p>{edu.institution}</p>
                    <p className="text-gray-300">{edu.date}</p>
                </div>
            ))}
        </div>
        <div className="mt-6">
            <h2 className="text-lg font-semibold uppercase text-gray-400">Skills</h2>
            <ul className="list-disc list-inside mt-2 text-sm">
                {data.skills.map(skill => <li key={skill}>{skill}</li>)}
            </ul>
        </div>
      </div>
      {/* Right Content */}
      <div className="w-2/3 p-6">
         <section className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Summary</h2>
            <p className="mt-2 text-gray-700">{data.summary}</p>
        </section>
         <section>
            <h2 className="text-2xl font-bold text-gray-800">Experience</h2>
            {data.experience.map(exp => (
                 <div key={exp.id} className="mt-4">
                    <h3 className="text-xl font-semibold">{exp.title}</h3>
                    <p className="text-gray-600">{exp.company} | {exp.date}</p>
                    <p className="mt-1 text-gray-700">{exp.description}</p>
                </div>
            ))}
        </section>
      </div>
    </div>
  );
};

export default TemplateCreative;

