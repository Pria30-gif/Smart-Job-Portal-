import React from 'react';
import amreshsir from './amreshsir.jpg'; // Import the local image
import ankit from './Ankit.jpg';
import ritik from './ritik.jpg';
import gaurav from './gaurav.jpg';

const Creator = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center w-full">
          {/* Image Section */}
          <div className="flex justify-center">
            <img src={amreshsir} alt="Amresh Sir" className="h-80 object-cover rounded-lg shadow-md" />
          </div>
          {/* Text Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">ProjectGuide Archana Kotangle</h2>
            <p className="text-gray-600 mb-2">Our Project Guide Archana Kotangle maam has been an inspiring guide and mentor throughout the course of this project. She provided continuous guidance, valuable feedback, and constant encouragement, ensuring that the development of the Smart Job Portal stayed on the right track. With her vast academic knowledge and practical insights, she helped us refine our ideas, overcome challenges, and adopt effective problem-solving approaches. Her dedication, patience, and supportive nature created a motivating environment for us to learn and grow. Her expertise and mentorship have played a crucial role in shaping this project into a practical, user-focused platform that meets real-world needs.</p>
            
          </div>
        </div>
      </div>
      
      <hr className="w-full border-gray-300 my-6" />
      
      <div className="text-center p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Developers and Designers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Developer 2 - Ritik Shrivastava */}
          <a href="#" className="block text-center">
            <img src={ritik} alt="Priya Bugade" className="mx-auto rounded-lg shadow-md" />
            <h3 className="text-lg font-semibold text-gray-700 mt-2">Priya Bugade</h3>
            <p className="text-gray-600 text-sm">Registration No: 21110125043</p>
            <p className="text-gray-600 text-sm">Software Developer</p>
          </a>
          {/* Developer 3 - Gaurav Kumar */}
          <a href="#" className="block text-center">
            <img src={gaurav} alt="Arya Dalvi" className="mx-auto rounded-lg shadow-md" />
            <h3 className="text-lg font-semibold text-gray-700 mt-2">Arya Dalvi</h3>
            <p className="text-gray-600 text-sm">Registration No: 21110125023</p>
            <p className="text-gray-600 text-sm">UI/UX Designer</p>
          </a>
          {/* Developer 1 - A P */}
          <a href="https://ankitpathak.vercel.app/" target="_blank" rel="noopener noreferrer" className="block text-center">
            <img src={ankit} alt="Pratik Gharat" className="mx-auto rounded-lg shadow-md" />
            <h3 className="text-lg font-semibold text-gray-700 mt-2">Pratik Gharat</h3>
            <p className="text-gray-600 text-sm">Registration No: 21110125035</p>
            <p className="text-gray-600 text-sm">Documentation</p>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Creator;
