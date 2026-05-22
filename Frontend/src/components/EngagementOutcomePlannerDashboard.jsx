import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const EngagementOutcomePlannerDashboard = () => {
    const { user } = useSelector(store => store.auth);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !user._id) {
                setError('User not logged in');
                setLoading(false);
                return;
            }
            try {
                // Placeholder - using dummy data for now
                // const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5011'}/api/engagement-outcomes/${user._id}`);
                // setData(response.data.outcomes);
                setData([
                    { description: 'Improved candidate engagement by 20% through personalized follow-ups.' },
                    { description: 'Scheduled 15 interviews leading to 5 successful hires.' },
                    { description: 'Enhanced job posting visibility with targeted keywords.' },
                ]);
            } catch (err) {
                setError('No engagement outcomes available yet.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const openPlannerApp = () => {
        // Placeholder - replace with actual URL or functionality
        window.open('http://localhost:8503', '_blank'); // Assuming a different port for planner
    };

    if (loading) return <div className="text-center mt-10">Loading engagement outcomes...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
    if (!data) return <div className="text-center mt-10">No engagement outcomes available.</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
            <h1 className="text-3xl font-bold text-center mb-6">Engagement Outcome Planner Dashboard Overview</h1>
            <div className="text-center mb-4">
                <button
                    onClick={openPlannerApp}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
                >
                    Open Engagement Outcome Planner
                </button>
            </div>
            <p className="text-center text-gray-600 mb-4">User ID: {user._id}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Placeholder content - replace with actual data rendering */}
                {data && data.map((item, index) => (
                    <div key={index} className="bg-gray-100 p-4 rounded-lg shadow">
                        <h3 className="font-semibold">Outcome {index + 1}</h3>
                        <p>{item.description || 'Placeholder description'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EngagementOutcomePlannerDashboard;