import mongoose from "mongoose";

<<<<<<< HEAD
const resumeSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
});

=======
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
const profileSchema = new mongoose.Schema({
  profilePhoto: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  skills: {
    type: [String],
    default: [],
  },
<<<<<<< HEAD
  resumes: {
    type: [resumeSchema],
    default: [],
=======
  resume: {
    type: String,
    default: "",
  },
  resumeOriginalName: {
    type: String,
    default: "",
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
  },
});

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
       enum: ["student", "Student", "recruiter", "Recruiter"],
      required: true,
    },
    profile: profileSchema,
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);