import { useState } from "react";
import { createContentPost } from "./contentAPI";
import { Settings, MoreHorizontal, Image, BarChart3 } from "lucide-react";

export default function CreatePost() {
  const [title, setTitle] = useState("Exciting Opportunity!");
  const [body, setBody] = useState("We are hiring for Frontend Developers.\nJoin our dynamic team and work with the latest tech!\nApply now to be a part of our journey.");
  const [goal, setGoal] = useState("applications");
  const [audience, setAudience] = useState(["students", "fresh-graduates"]);

  const handleSubmit = async () => {
    await createContentPost({ title, body, goal, audience });
    alert("A/B Testing Started!");
  };

  const goals = [
    { id: "applications", label: "Increase Applications", active: goal === "applications" },
    { id: "visits", label: "Boost Profile Visits", active: goal === "visits" },
    { id: "comments", label: "Get More Comments", active: goal === "comments" },
    { id: "saves", label: "Gain Saves", active: goal === "saves" }
  ];

  const audiences = [
    { id: "students", label: "Students", icon: "🎓", active: audience.includes("students") },
    { id: "fresh-graduates", label: "Fresh Graduates", icon: "🧑‍🎓", active: audience.includes("fresh-graduates") },
    { id: "professionals", label: "Experienced Professionals", icon: "💼", active: audience.includes("professionals") }
  ];

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-50 min-h-screen">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 mb-1">
        <span>Content Management</span>
        <span className="mx-2">›</span>
        <span>Create Post</span>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Engagement Outcome Planner</h1>
            <p className="text-sm text-gray-500">Content Management</p>
          </div>
          <div className="flex gap-3 text-gray-400 text-xl cursor-pointer">
            <Settings size={20} />
            <MoreHorizontal size={20} />
          </div>
        </div>

        {/* Goal Selection */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3">Set Your Goal</h3>
          <div className="flex flex-wrap gap-2">
            {goals.map((g) => (
              <button
                key={g.id}
                onClick={() => setGoal(g.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition-colors ${
                  g.active
                    ? "bg-blue-50 border-blue-500 text-blue-600 font-medium"
                    : "bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {g.active && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side */}
          <div className="lg:col-span-2">
            {/* Target Audience */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">Target Audience</h3>
              <div className="flex flex-wrap gap-2">
                {audiences.map((aud) => (
                  <div
                    key={aud.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm border cursor-pointer transition-colors ${
                      aud.active
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200 font-medium"
                        : "bg-gray-50 text-gray-600 border-gray-300"
                    }`}
                  >
                    <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                      {aud.icon}
                    </span>
                    {aud.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Post Editor */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Draft Your Post</h3>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                <div className="space-y-1 mb-4">
                  {body.split('\n').map((line, index) => (
                    <div key={index} className="text-sm">
                      {line.includes('Frontend Developers') || line.includes('Apply now') ? (
                        <strong className={line.includes('Apply now') ? 'text-blue-600' : ''}>
                          {line}
                        </strong>
                      ) : (
                        line
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                      <Image size={16} />
                      Add Image
                    </span>
                    <span className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                      <BarChart3 size={16} />
                      Add Poll
                    </span>
                  </div>
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    Preview Results
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Predicted Engagement */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-3">Predicted Engagement</h4>
              <ul className="space-y-2 mb-4">
                <li className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-sm text-gray-600">
                    Expected Saves
                  </span>
                  <span className="text-sm font-medium text-green-600">High</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-sm text-gray-600">
                    Comments
                  </span>
                  <span className="text-sm font-medium text-gray-600">Medium</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-sm text-gray-600">
                    Apply Clicks
                  </span>
                  <span className="text-sm font-medium text-red-600">Low</span>
                </li>
              </ul>

              <h4 className="text-sm font-semibold mb-2">Suggestions</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  Use a clear call-to-action at the end.
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  Keep the post under 100 words.
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  Add a relevant image to boost interest.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* A/B Testing Results Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">A/B Testing Results</h2>
            <p className="text-sm text-gray-500">Optimizing Your Post for Maximum Engagement</p>
          </div>
          <div className="flex gap-3 text-gray-400 text-xl cursor-pointer">
            <Settings size={20} />
            <MoreHorizontal size={20} />
          </div>
        </div>

        {/* A/B Variants */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 relative">
          {/* Variant A */}
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
            <h4 className="text-sm font-semibold mb-2">Variant A</h4>
            <h5 className="font-semibold text-sm mb-2">Join Our Frontend Team Today!</h5>
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              We're hiring Frontend Developers.<br />
              Be part of our innovative team!<br />
              Apply now!
            </p>
            <div className="flex gap-3">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                👍 Saves: 35%
              </span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                🔗 Apply Clicks: 20%
              </span>
            </div>
          </div>

          {/* Variant B */}
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
            <h4 className="text-sm font-semibold mb-2">Variant B</h4>
            <h5 className="font-semibold text-sm mb-2">Exciting Frontend Developer Role!</h5>
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              Great opportunity for Frontend Developers!<br />
              Join us and grow your career.<br />
              Apply now!
            </p>
            <div className="flex gap-3">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                👍 Saves: 48%
              </span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                🔗 Apply Clicks: 32%
              </span>
            </div>
          </div>

          {/* Winner Banner */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-xl z-10 whitespace-nowrap">
            🏆 Winner Selected!
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center mb-6">
          Variant B was chosen automatically after 24 hours of testing.
        </p>

        {/* Summary Cards */}
        <div className="flex justify-center gap-6">
          <div className="bg-blue-50 text-blue-800 rounded-lg px-6 py-3 text-center min-w-32">
            <div className="text-lg font-semibold">+42%</div>
            <div className="text-xs">Total Engagement</div>
          </div>
          <div className="bg-blue-50 text-blue-800 rounded-lg px-6 py-3 text-center min-w-32">
            <div className="text-lg font-semibold">+37%</div>
            <div className="text-xs">More Saves</div>
          </div>
          <div className="bg-blue-50 text-blue-800 rounded-lg px-6 py-3 text-center min-w-32">
            <div className="text-lg font-semibold">+60%</div>
            <div className="text-xs">Increase in Apply Clicks</div>
          </div>
        </div>
      </div>
    </div>
  );
}
