import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, Label } from 'recharts';

// --- Configuration (for the form dropdowns) ---
const roleOptions = ["Software Engineer", "Data Analyst", "Project Manager", "UI/UX Designer"];
const locationOptions = ["Tier 1", "Tier 2", "Tier 3"];
const educationOptions = ["Bachelor's Degree", "Master's Degree", "PhD"];

// --- Calculation Engine (JavaScript-based) ---
const calculateSalary = (data) => {
  const BASE_SALARIES = { "Software Engineer": 700000, "Data Analyst": 600000, "Project Manager": 900000, "UI/UX Designer": 550000 };
  const EXPERIENCE_MULTIPLIERS = { fresher: 1.0, junior: 1.25, mid: 1.6, senior: 2.2 };
  const LOCATION_MULTIPLIERS = { "Tier 1": 1.2, "Tier 2": 1.0, "Tier 3": 0.85 };
  const DEGREE_BONUSES = { "Bachelor's Degree": 50000, "Master's Degree": 150000, "PhD": 300000 };

  let expLevel;
  if (data.isFresher || data.experience <= 0) expLevel = "fresher";
  else if (data.experience <= 3) expLevel = "junior";
  else if (data.experience <= 7) expLevel = "mid";
  else expLevel = "senior";

  const baseSalary = BASE_SALARIES[data.jobTitle] || 600000;
  const expAdjusted = baseSalary * EXPERIENCE_MULTIPLIERS[expLevel];
  const locAdjusted = expAdjusted * LOCATION_MULTIPLIERS[data.locationTier];
  const finalSalary = locAdjusted + (DEGREE_BONUSES[data.degree] || 0);

  const breakdown = { "Base Salary": baseSalary, "Experience": expAdjusted - baseSalary, "Location": locAdjusted - expAdjusted, "Education": DEGREE_BONUSES[data.degree] || 0 };
  const lowerBound = finalSalary * 0.85;
  const upperBound = finalSalary * 1.15;

  return {
    finalSalary: Math.round(finalSalary / 1000) * 1000,
    breakdown: Object.fromEntries(Object.entries(breakdown).map(([k, v]) => [k, Math.round(v)])),
    salaryRange: [Math.round(lowerBound), Math.round(upperBound)],
    summary: `For a ${data.jobTitle} in a ${data.locationTier} city, salaries typically range from ₹${Math.round(lowerBound).toLocaleString("en-IN")} to ₹${Math.round(upperBound).toLocaleString("en-IN")}.`
  };
};

export default function SalaryCalculator() {
  const [isFresher, setIsFresher] = useState(false);
  const [formData, setFormData] = useState({ experience: "1", jobTitle: "Software Engineer", locationTier: "Tier 1", degree: "Bachelor's Degree" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFresherChange = (e) => setIsFresher(e.target.checked);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const payload = { ...formData, isFresher, experience: isFresher ? 0 : formData.experience };
    setTimeout(() => {
      setResult(calculateSalary(payload));
      setLoading(false);
    }, 700);
  };

  // --- Data for the charts ---
  const breakdownChartData = result ? Object.entries(result.breakdown).map(([name, value], index) => ({ name, value, fill: ['#60a5fa', '#34d399', '#fbbf24', '#f87171'][index % 4] })) : [];
  const rangeChartData = result ? [{ name: 'Salary', range: result.salaryRange }] : [];

  return (
    <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl flex flex-col lg:flex-row overflow-hidden">
        {/* Left Column: The Form */}
        <div className="p-8 lg:p-10 w-full lg:w-1/2">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Salary Calculator</h2>
          <p className="text-slate-500 mb-8">Get a transparent salary estimation.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center"><input type="checkbox" id="fresher" checked={isFresher} onChange={handleFresherChange} className="h-4 w-4 rounded border-gray-300"/> <label htmlFor="fresher" className="ml-2 block text-sm font-medium text-gray-700">I am a Fresher</label></div>
            <div><label className="text-sm font-semibold text-slate-600">Years of Experience</label><input type="number" name="experience" value={isFresher ? "0" : formData.experience} onChange={handleChange} min="0" disabled={isFresher} className="mt-1 w-full p-2 border rounded-md" required /></div>
            <div><label className="text-sm font-semibold text-slate-600">Job Title</label><select name="jobTitle" value={formData.jobTitle} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md">{roleOptions.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}</select></div>
            <div><label className="text-sm font-semibold text-slate-600">Location Tier</label><select name="locationTier" value={formData.locationTier} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md">{locationOptions.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}</select></div>
            <div><label className="text-sm font-semibold text-slate-600">Highest Degree</label><select name="degree" value={formData.degree} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md">{educationOptions.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}</select></div>
            <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 font-bold py-3 px-4 rounded-lg" disabled={loading}>{loading ? "Calculating..." : "Calculate Salary"}</button>
          </form>
        </div>

        {/* Right Column: The Results */}
        <div className="w-full lg:w-1/2 bg-slate-800 text-white p-8 lg:p-10 flex flex-col justify-center">
            {loading && <div className="text-center">Calculating...</div>}
            
            {!loading && result && (
              <div>
                <p className="text-lg text-slate-300">Estimated Annual Salary</p>
                <p className="text-5xl font-extrabold text-white mt-1">₹ {result.finalSalary.toLocaleString("en-IN")}</p>
                
                {/* --- NEW: Market Comparison Chart --- */}
                <h4 className="font-bold mt-8 mb-2 border-b border-slate-600 pb-2">Market Comparison</h4>
                <div className="w-full h-24 text-xs">
                  <ResponsiveContainer>
                    <BarChart data={rangeChartData} layout="vertical" margin={{ top: 20, right: 30, left: 30, bottom: 5 }}>
                      <XAxis type="number" domain={['dataMin - 100000', 'dataMax + 100000']} hide />
                      <YAxis type="category" dataKey="name" hide />
                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}/>
                      <Bar dataKey="range" background={{ fill: '#334155' }} fill="#4f46e5" radius={[6, 6, 6, 6]}/>
                      <ReferenceLine x={result.finalSalary} stroke="#a78bfa" strokeWidth={2} strokeDasharray="3 3">
                        <Label value="Your Estimate" position="top" fill="#a78bfa" fontSize={12} />
                      </ReferenceLine>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-slate-400 mt-4">{result.summary}</p>
                
                {/* --- Original Breakdown Chart --- */}
                <h4 className="font-bold mt-6 mb-4 border-b border-slate-600 pb-2">Calculation Breakdown</h4>
                <div className="w-full h-40">
                  <ResponsiveContainer>
                      <BarChart data={breakdownChartData} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
                          <XAxis type="number" hide />
                          <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={80} />
                          <Tooltip cursor={{fill: 'rgba(255, 255, 255, 0.1)'}} contentStyle={{ backgroundColor: '#334155', border: 'none', borderRadius: '8px' }}/>
                          <Bar dataKey="value" background={{ fill: '#475569' }} radius={[4, 4, 4, 4]}>
                            {breakdownChartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} />))}
                          </Bar>
                      </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            
            {!loading && !result && (
              <div className="text-center">
                <h3 className="text-2xl font-bold">Your Estimate</h3>
                <p className="text-slate-300 mt-2">Results and a detailed calculation will appear here.</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}