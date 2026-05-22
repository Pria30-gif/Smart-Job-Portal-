// client/src/components/profile/ProjectCard.jsx

import React from 'react';
import { Lightbulb } from 'lucide-react'; // A great icon for projects

const ProjectCard = ({ project }) => {
  return (
    <div className="flex gap-4 p-4 mb-4 border-l-4 border-gray-300">
      {/* Icon */}
      <div className="mt-1">
        <Lightbulb className="h-8 w-8 text-gray-500" />
      </div>

      {/* Details */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800">{project.title || 'Project Title'}</h3>
        <p className="text-sm font-medium text-blue-600 bg-blue-100 py-1 px-2 rounded-full inline-block my-2">
          {project.technologies || 'Technologies Used'}
        </p>
        <p className="mt-1 text-sm text-gray-500">{project.description}</p>
      </div>
    </div>
  );
};

export default ProjectCard;