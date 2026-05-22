<<<<<<< HEAD

import React, { useEffect, useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Navigate, useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_ENDPOINT } from "@/utils/data.js";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "", 
    role: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((store) => store.auth);
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const ChangeFilehandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };
=======
import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { USER_API_ENDPOINT } from "@/utils/data.js";

const Login = () => {
  const [input, setInput] = useState({ email: "", password: "", role: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((store) => store.auth);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e

  const submitHandler = async (e) => {
    e.preventDefault();

<<<<<<< HEAD
    // Client-side validation
    if (!input.email || !input.password || !input.role) {
      toast.error("Please fill in all fields, including selecting a role.");
=======
    if (!input.email || !input.password || !input.role) {
      toast.error("Please fill all fields");
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
      return;
    }

    try {
<<<<<<< HEAD
      dispatch(setLoading(true)); // Start loading
=======
      dispatch(setLoading(true));
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
      const res = await axios.post(`${USER_API_ENDPOINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
<<<<<<< HEAD
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        // Redirect based on user role
        if (res.data.user.role === "Recruiter" || res.data.user.role === "Admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || "Login failed";
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false)); // End loading
=======

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || "Login failed";
      toast.error(errMsg);
    } finally {
      dispatch(setLoading(false));
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
    }
  };

  useEffect(() => {
<<<<<<< HEAD
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div>
      
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          onSubmit={submitHandler}
          className="w-1/2 border border-gray-500 rounded-md p-4 my-10"
        >
          <h1 className="font-bold text-xl mb-5 text-center text-blue-600">
            Login
          </h1>
          <div className="my-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="priya@gmail.com"
              required
            ></Input>
          </div>
          <div className="my-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="********"
              required
            ></Input>
          </div>
           

          <div className="flex items-center justify-between">
            <RadioGroup className="flex items-center gap-4 my-5 ">
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="Student"
                  checked={input.role === "Student"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="r1">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="Recruiter"
                  checked={input.role === "Recruiter"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="r2">Recruiter</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="Admin"
                  checked={input.role === "Admin"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="r3">Admin</Label>
              </div>
            </RadioGroup>
          </div>

          {loading ? (
            <div className="flex items-center justify-center my-10">
              <div className="spinner-border text-blue-600" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <button
              type="submit"
              disabled={!input.role}
              className="w-3/4 py-3 my-3 text-white flex items-center justify-center max-w-7xl mx-auto bg-blue-600 hover:bg-blue-800/90 rounded-md disabled:bg-gray-400"
            >
              Login
            </button>
          )}

          <div className=" ">
            <p className="text-gray-700  text-center my-2">
              Create new Account{" "}
              <Link to="/register" className="text-blue-700">
                <button className=" w-1/2 py-3 my-3 text-white flex items-center justify-center max-w-7xl mx-auto bg-green-600 hover:bg-green-800/90 rounded-md">
                  Register
                </button>
              </Link>
            </p>
          </div>
        </form>
      </div>
=======
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center max-w-7xl mx-auto">
      <form onSubmit={submitHandler} className="w-1/2 border p-4 rounded-md my-10">
        <h1 className="font-bold text-xl mb-5 text-center text-blue-600">Login</h1>

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

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-800">Login</button>
        )}

        <p className="text-center mt-4 text-gray-500">
          Don't have an account? <Link to="/register" className="text-blue-700">Register</Link>
        </p>
      </form>
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
    </div>
  );
};

export default Login;
