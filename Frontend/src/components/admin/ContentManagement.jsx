import React, { useState } from 'react';
import CreatePost from './content/CreatePost';
import ABTestingResult from './content/ABTestingResult';
import { PenTool, BarChart3, Plus } from 'lucide-react';

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('create');

  const tabs = [
    { id: 'create', label: 'Create Post', icon: Plus },
    { id: 'results', label: 'A/B Test Results', icon: BarChart3 }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management</h1>
        <p className="text-gray-600">Create engaging content and analyze A/B testing results</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {activeTab === 'create' && <CreatePost />}
        {activeTab === 'results' && <ABTestingResult />}
      </div>
    </div>
  );
};

export default ContentManagement;