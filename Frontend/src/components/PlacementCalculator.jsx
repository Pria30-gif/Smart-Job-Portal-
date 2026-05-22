import React, { useState } from "react";

// --- Configuration (for the form dropdowns) ---
const skillsOptions = ["Java", "Python", "C++", "JavaScript", "SQL", "Machine Learning", "Data Analysis"];
const extraCurricularOptions = ["Sports", "Music", "Debate", "Volunteering", "None"];

// --- Prediction Logic (simple heuristic) ---
const predictPlacement = (data) => {
  let score = 0;

  // Academic score contribution (out of 100)
  score += data.academicScore * 0.4;

  // Projects contribution
  score += Math.min(data.projects, 5) * 5;

  // Internships contribution
  score += Math.min(data.internships, 3) * 7;

  // Skills contribution
  score += Math.min(data.skills.length, 5) * 6;

  // Extra-curricular contribution
  score += data.extraCurricular === "None" ? 0 : 5;

  // Normalize score to 0-100
  if (score > 100) score = 100;

  // Threshold for placement chance
  const threshold = 60;

  return {
    placementChance: score,
    willGetPlacement: score >= threshold,
    summary: score >= threshold
      ? "Congratulations! You have a good chance of getting placed."
      : "You may need to improve some areas to increase your placement chances."
  };
};

export default function PlacementCalculator() {
  const [formData, setFormData] = useState({
    academicScore: "",
    projects: 0,
    internships: 0,
    skills: [],
    extraCurricular: "None"
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked, options } = e.target;
    if (type === "select-multiple") {
      const selectedOptions = Array.from(options).filter(o => o.selected).map(o => o.value);
      setFormData({ ...formData, [name]: selectedOptions });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const prediction = predictPlacement(formData);
      setResult(prediction);
      setLoading(false);
    }, 700);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col lg:flex-row overflow-hidden">
        {/* Left Column: The Form */}
        <div className="p-8 lg:p-10 w-full lg:w-1/2">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Placement Calculator</h2>
          <p className="text-slate-500 mb-8">Estimate your chances of getting placed.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-slate-600">Academic Score (%)</label>
              <input
                type="number"
                name="academicScore"
                value={formData.academicScore}
                onChange={handleChange}
                min="0"
                max="100"
                required
                className="mt-1 w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">Number of Projects Completed</label>
              <input
                type="number"
                name="projects"
                value={formData.projects}
                onChange={handleChange}
                min="0"
                max="10"
                className="mt-1 w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">Number of Internships</label>
              <input
                type="number"
                name="internships"
                value={formData.internships}
                onChange={handleChange}
                min="0"
                max="5"
                className="mt-1 w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">Relevant Skills</label>
              <select
                name="skills"
                multiple
                value={formData.skills}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded-md"
              >
                {skillsOptions.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">Extra-curricular Activities</label>
              <select
                name="extraCurricular"
                value={formData.extraCurricular}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded-md"
              >
                {extraCurricularOptions.map(activity => (
                  <option key={activity} value={activity}>{activity}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-blue-700 font-bold py-3 px-4 rounded-lg"
              disabled={loading}
            >
              {loading ? "Calculating..." : "Calculate Placement Chance"}
            </button>
          </form>
        </div>

        {/* Right Column: The Results */}
        <div className="w-full lg:w-1/2 bg-slate-800 text-white p-8 lg:p-10 flex flex-col justify-center">
          {loading && <div className="text-center">Calculating...</div>}

          {!loading && result && (
            <div className="text-center">
              <p className="text-lg text-slate-300">Placement Chance</p>
              <p className="text-5xl font-extrabold text-white mt-1">{result.placementChance.toFixed(1)}%</p>
              <p className={`mt-4 text-xl font-semibold ${result.willGetPlacement ? "text-green-400" : "text-red-400"}`}>
                {result.summary}
              </p>
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
