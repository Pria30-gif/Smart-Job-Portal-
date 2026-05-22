import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
<<<<<<< HEAD
import cloudinary from '../utils/cloud.js';


export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(401).json({
=======
import cloudinary from "../utils/cloud.js";

// ------------------------
// REGISTER COMPANY
// ------------------------
export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;

    if (!companyName) {
      return res.status(400).json({
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
        message: "Company name is required",
        success: false,
      });
    }
<<<<<<< HEAD
    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(401).json({
=======

    let existing = await Company.findOne({ name: companyName });
    if (existing) {
      return res.status(400).json({
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
        message: "Company already exists",
        success: false,
      });
    }
<<<<<<< HEAD
    company = await Company.create({
      name: companyName,
      userId: req.id,
    });
    return res.status(201).json({
      message: "Company registered successfully.",
=======

    const company = await Company.create({
      name: companyName,
      userId: req.id, // recruiter ID
    });

    return res.status(201).json({
      message: "Company registered successfully",
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
      company,
      success: true,
    });
  } catch (error) {
<<<<<<< HEAD
    console.log(error);
  }
};

export const getAllCompanies = async (req, res) => {
  try {
    const userId = req.id; // loggedin user id
    const companies = await Company.find({ userId });
    if (!companies) {
      return res.status(404).json({ message: "No companies found" });
    }
=======
    console.error("Error registering company:", error);
    return res.status(500).json({
      message: "Server error during company registration",
      success: false,
    });
  }
};

// ------------------------
// GET ALL COMPANIES
// ------------------------
export const getAllCompanies = async (req, res) => {
  try {
    let companies;

    // If recruiter → only show their companies
    if (req.user?.role === "Recruiter") {
      companies = await Company.find({ userId: req.id });
    } else {
      // For student or admin → show all
      companies = await Company.find({});
    }

    if (!companies || companies.length === 0) {
      return res.status(404).json({
        message: "No companies found",
        success: false,
      });
    }

>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
<<<<<<< HEAD
    console.error(error);
    res.status(500).json({ message: "Server Error", success: false });
  }
};

//get company by id
=======
    console.error("Error fetching companies:", error);
    return res.status(500).json({
      message: "Server error fetching companies",
      success: false,
    });
  }
};

// ------------------------
// GET COMPANY BY ID
// ------------------------
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
<<<<<<< HEAD
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    return res.status(200).json({ company, success: true });
  } catch (error) {
    console.error(error);
  }
};

//update company details
export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;

    let updateData = { name, description, website, location };

    // Only upload logo if file is provided
    if (file) {
      const fileUri = getDataUri(file);
=======

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching company by ID:", error);
    return res.status(500).json({
      message: "Server error fetching company",
      success: false,
    });
  }
};

// ------------------------
// UPDATE COMPANY DETAILS
// ------------------------
export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const updateData = { name, description, website, location };

    // If a new file is uploaded, update logo
    if (req.file) {
      const fileUri = getDataUri(req.file);
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      updateData.logo = cloudResponse.secure_url;
    }

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
<<<<<<< HEAD
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    return res.status(200).json({ message: "Company updated", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
=======

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company updated successfully",
      company,
      success: true,
    });
  } catch (error) {
    console.error("Error updating company:", error);
    return res.status(500).json({
      message: "Server error updating company",
      success: false,
    });
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
  }
};
