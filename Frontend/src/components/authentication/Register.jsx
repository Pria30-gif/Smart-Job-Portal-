import React, { useEffect, useState } from "react";
<<<<<<< HEAD
=======
import Navbar from "../components_lite/Navbar";
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";

const Register = () => {
<<<<<<< HEAD
  // State for all form inputs
=======
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "",
<<<<<<< HEAD
    file: null, // Initialize file as null
  });

  // Local loading state specifically for the submit button spinner
  const [isSubmitting, setIsSubmitting] = useState(false);

=======
    file: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

<<<<<<< HEAD
  // Generic handler for text-based input changes
=======
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

<<<<<<< HEAD
  // Specific handler for the file input
  const changeFileHandler = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setInput({ ...input, file: e.target.files[0] });
    }
  };

  // Form submission logic
  const submitHandler = async (e) => {
    e.preventDefault();

    // Basic validation to ensure required fields are filled
    if (!input.fullname || !input.email || !input.password || !input.role) {
      toast.error("Please fill all required fields.");
      return;
    }

    setIsSubmitting(true); // Start the local spinner

    // Use FormData to correctly handle multipart data (for the file upload)
=======
  const ChangeFilehandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.fullname || !input.email || !input.password || !input.role || !input.file) {
      toast.error("Please fill all required fields including profile photo.");
      return;
    }

    setIsSubmitting(true);

>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("role", input.role);
<<<<<<< HEAD
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      dispatch(setLoading(true)); // Optional: trigger a global loading state
=======
    formData.append("file", input.file);

    try {
      dispatch(setLoading(true));
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
      const res = await axios.post(`${USER_API_ENDPOINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
<<<<<<< HEAD
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Registration Error:", error);
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false)); // Stop the global loading state
      setIsSubmitting(false); // Stop the local spinner
    }
  };

  // Effect to redirect users away from this page if they are already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    // A centered layout for the registration form
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12">
      <div className="w-full max-w-md border border-gray-200 rounded-lg shadow-sm p-8 bg-white">
        <form onSubmit={submitHandler} className="space-y-6">
          <div className="text-center">
            <h1 className="font-bold text-3xl text-gray-800">Create Account</h1>
            <p className="text-gray-500 mt-1">Join the Smart Job Portal today.</p>
          </div>

          {/* Form Fields */}
          <div>
            <Label htmlFor="fullname">Fullname</Label>
            <Input id="fullname" type="text" value={input.fullname} name="fullname" onChange={changeEventHandler} placeholder="John Doe" className="mt-1" />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={input.email} name="email" onChange={changeEventHandler} placeholder="johndoe@example.com" className="mt-1" />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={input.password} name="password" onChange={changeEventHandler} placeholder="••••••••" className="mt-1" />
          </div>

          <div>
            <Label>I am a...</Label>
            <RadioGroup value={input.role} onValueChange={(value) => setInput({ ...input, role: value })} className="flex items-center gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <Input type="radio" value="Student" id="role-student" name="role" className="cursor-pointer" />
                <Label htmlFor="role-student" className="font-normal cursor-pointer">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input type="radio" value="Recruiter" id="role-recruiter" name="role" className="cursor-pointer" />
                <Label htmlFor="role-recruiter" className="font-normal cursor-pointer">Recruiter</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="file">Profile Photo (Optional)</Label>
            <Input id="file" type="file" accept="image/*" onChange={changeFileHandler} className="mt-1 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>

          {/* Submit Button - 'block' class removed */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md flex justify-center items-center gap-2 transition-colors duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isSubmitting && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" role="status"></div>}
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-gray-600 text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
=======
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || "Registration failed";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center max-w-7xl mx-auto">
      <form onSubmit={submitHandler} className="w-1/2 border p-4 rounded-md my-10">
        <h1 className="font-bold text-xl mb-5 text-center text-blue-600">Register</h1>

        <div className="my-2">
          <Label>Fullname</Label>
          <Input type="text" name="fullname" value={input.fullname} onChange={changeEventHandler} placeholder="John Doe" />
        </div>

        <div className="my-2">
          <Label>Email</Label>
          <Input type="email" name="email" value={input.email} onChange={changeEventHandler} placeholder="johndoe@gmail.com" />
        </div>

        <div className="my-2">
          <Label>Password</Label>
          <Input type="password" name="password" value={input.password} onChange={changeEventHandler} placeholder="********" />
        </div>

        <RadioGroup className="flex items-center gap-4 my-5">
          {["Student", "Recruiter"].map((roleOption) => (
            <div key={roleOption} className="flex items-center space-x-2">
              <Input type="radio" name="role" value={roleOption} checked={input.role === roleOption} onChange={changeEventHandler} />
              <Label>{roleOption}</Label>
            </div>
          ))}
        </RadioGroup>

        <div className="flex items-center gap-2">
          <Label>Profile Photo</Label>
          <Input type="file" accept="image/*" onChange={ChangeFilehandler} className="cursor-pointer" />
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full py-3 my-3 bg-blue-600 text-white rounded-md flex justify-center items-center gap-2">
          {isSubmitting && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          Register
        </button>

        <p className="text-center mt-4 text-gray-500">
          Already have an account? <Link to="/login" className="text-blue-700 font-semibold">Login</Link>
        </p>
      </form>
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
    </div>
  );
};

export default Register;
