// client/src/components/profile/CertificationCard.jsx

import React from 'react';
import { Award } from 'lucide-react'; // An icon for achievements

const CertificationCard = ({ certification }) => {
  return (
    <div className="flex gap-4 p-4 mb-4 border-l-4 border-gray-300">
      {/* Icon */}
      <div className="mt-1">
        <Award className="h-8 w-8 text-gray-500" />
      </div>

      {/* Details */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800">{certification.title || 'Certification Title'}</h3>
        <p className="mt-1 text-sm text-gray-500">{certification.description}</p>
      </div>
    </div>
  );
};

export default CertificationCard;