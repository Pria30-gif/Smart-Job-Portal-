import mongoose from "mongoose";
<<<<<<< HEAD
=======

>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
<<<<<<< HEAD
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    resume: {
      original: {
        filename: String,
        path: String,
        mimetype: String,
        size: Number,
      },
      anonymized: {
        filename: String,
        path: String,
        mimetype: String,
        size: Number,
        anonymizationStatus: {
          type: String,
          enum: ["pending", "completed", "failed"],
          default: "pending",
        },
        removedFields: [String], // Track what was anonymized
      },
    },
    resumeScore: {
      type: Number,
      default: 0
    },
    experienceRange: {
      type: String, // "0-2", "3-5", "6+"
      default: "0-2"
    },
  },
  {
    timestamps: true,
  }
);

export const Application = mongoose.model("Application", applicationSchema);
=======
      enum: ["Pending", "Accepted", "Rejected"], // Capitalize for UI consistency
      default: "Pending",
    },
    matchPercentage: {
      type: Number,
      default: 0, // Used for ranking in recruiter panel
    },
    matchedSkills: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export const Application = mongoose.model("Application", applicationSchema);
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
