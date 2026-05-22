import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, clearFilters } from '@/redux/jobSlice';

const FilterJobs = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((store) => store.job);

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Filter Jobs</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Locations</option>
            <option value="Delhi">Delhi</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Kolhapur">Kolhapur</option>
            <option value="Pune">Pune</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Chennai">Chennai</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        {/* Technology Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Technology</label>
          <select
            value={filters.technology}
            onChange={(e) => handleFilterChange('technology', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Technologies</option>
            <option value="Mern">Mern</option>
            <option value="React">React</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="Fullstack">Fullstack</option>
            <option value="Node">Node</option>
            <option value="Python">Python</option>
            <option value="Java">Java</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="mobile">Mobile</option>
            <option value="desktop">Desktop</option>
          </select>
        </div>

        {/* Experience Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
          <select
            value={filters.experience}
            onChange={(e) => handleFilterChange('experience', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Experience Levels</option>
            <option value="0-3 years">0-3 years</option>
            <option value="3-5 years">3-5 years</option>
            <option value="5-7 years">5-7 years</option>
            <option value="7+ years">7+ years</option>
          </select>
        </div>

        {/* Salary Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
          <select
            value={filters.salary}
            onChange={(e) => handleFilterChange('salary', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Salary Ranges</option>
            <option value="0-50k">0-50k</option>
            <option value="50k-100k">50k-100k</option>
            <option value="100k-200k">100k-200k</option>
            <option value="200k+">200k+</option>
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="mt-4">
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default FilterJobs;
