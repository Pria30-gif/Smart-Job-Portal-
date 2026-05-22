import React from "react";
import { AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react";

const getDifficultyTheme = (difficulty) => {
  // ✅ HARD = ORANGE
  if (difficulty === "HARD") {
    return {
      gradient: "from-orange-600 via-orange-400 to-yellow-200",
      labelBg: "bg-orange-100 text-orange-700",
    };
  }

  // ✅ MEDIUM = PURPLE
  if (difficulty === "MEDIUM") {
    return {
      gradient: "from-purple-700 via-purple-500 to-pink-400",
      labelBg: "bg-purple-100 text-purple-700",
    };
  }

  // ✅ EASY = GREEN
  return {
    gradient: "from-green-600 via-green-300 to-green-200",
    labelBg: "bg-green-100 text-green-700",
  };
};

const TacitMeter = ({ tacit }) => {
  if (!tacit) return null;

  const {
    scarcityIndex = 0,
    demandTrend = 0,
    salaryGap = 0,
    difficulty = "MEDIUM",
  } = tacit;

  const theme = getDifficultyTheme(difficulty);

  // ✅ Trend Icon Helper
  const getTrendIcon = (trend) => {
    if (trend > 10) return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (trend < -10) return <TrendingDown className="w-5 h-5 text-red-600" />;
    return <Minus className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="my-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          TACIT Meter - Market Analysis
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Real-time job market difficulty & demand score
        </p>
      </div>

      {/* ✅ Main Difficulty Gauge */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-700">Difficulty Level</span>
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${theme.labelBg}`}>
            {difficulty}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 bg-gradient-to-r ${theme.gradient}`}
            style={{ width: `${scarcityIndex}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Scarcity Index: <strong>{scarcityIndex.toFixed(1)}</strong> / 100
        </p>
      </div>

      {/* ✅ Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Market Trend */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            {getTrendIcon(demandTrend)}
            <span className="text-xs font-semibold text-gray-700">Demand Trend</span>
          </div>
          <p className="text-lg font-bold text-blue-600">
            {demandTrend > 0 ? "+" : ""}{demandTrend.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500">vs last 7 days</p>
        </div>

        {/* Salary Gap */}
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <span className="text-xs font-semibold text-gray-700">Salary Gap</span>
          <p className="text-lg font-bold text-green-600">
            +{salaryGap.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500">vs average</p>
        </div>
      </div>

      {/* ✅ Info Box */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-gray-700">
        <strong>💡 Insight:</strong> This role is in{" "}
        <strong>{difficulty.toLowerCase()}</strong> demand. 
        {demandTrend > 0 && " Demand is increasing!"}
        {demandTrend < 0 && " Demand is decreasing."}
      </div>
    </div>
  );
};

export default TacitMeter;
