import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const FairnessAnalysis = ({ jobId }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/fairness/metrics/${jobId}`, { withCredentials: true })
      .then((res) => setData(res.data))
      .catch((err) => console.error("Failed to load fairness metrics:", err));
  }, [jobId]);

  if (!data) return null;

  return (
    <div className="space-y-6">

      {/* Overall Assessment */}
      <div className="bg-white p-5 rounded shadow">
        <h2 className="text-lg font-semibold">Overall Bias Assessment</h2>
        <p
          className={`mt-2 font-medium ${
            data.biasLevel === "High"
              ? "text-red-600"
              : data.biasLevel === "Moderate"
              ? "text-yellow-600"
              : "text-green-600"
          }`}
        >
          Bias Level: {data.biasLevel}
        </p>
        <p>Max Selection Rate Difference: {data.maxRateDiff}%</p>
        <p>Avg Score Difference: {data.maxScoreDiff} points</p>
      </div>

      {/* Demographic Parity Chart */}
      <div className="bg-white p-5 rounded shadow">
        <h2 className="font-semibold mb-3">Demographic Parity (Experience Based)</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.demographicParity}>
            <XAxis dataKey="group" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="selectionRate" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Score Distribution */}
      <div className="bg-white p-5 rounded shadow">
        <h2 className="font-semibold mb-3">Score Distribution Fairness</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.demographicParity}>
            <XAxis dataKey="group" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="avgScore" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default FairnessAnalysis;
