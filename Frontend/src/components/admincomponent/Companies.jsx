import React, { useEffect, useState } from "react";
<<<<<<< HEAD
=======
import Navbar from "../components_lite/Navbar";
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { PenTool } from "lucide-react";
=======
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e

import useGetAllCompanies from "@/hooks/usegetAllCompanies";
import { useDispatch } from "react-redux";
import { setSearchCompanyByText } from "@/redux/companyslice";

const Companies = () => {
  const navigate = useNavigate();

  useGetAllCompanies();
  const [input, setInput] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input]);
  return (
    <div>
<<<<<<< HEAD
=======
      <Navbar />
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
      <div className=" max-w-6xl mx-auto my-10">
        <div className="flex items-center justify-between my-5">
          <Input
            className="w-fit"
            placeholder="Filter by Name"
            onChange={(e) => setInput(e.target.value)}
          ></Input>
<<<<<<< HEAD
          <div className="flex gap-2">
            <Button onClick={() => navigate("/admin/content")} className="flex items-center gap-2">
              <PenTool size={16} />
              Content Management
            </Button>
            <Button onClick={() => navigate("/admin/companies/create")}>
              Add Company
            </Button>
          </div>
=======
          <Button onClick={() => navigate("/admin/companies/create")}>
            Add Company
          </Button>
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
        </div>
        <div>
          <CompaniesTable />
        </div>
      </div>
    </div>
  );
};

export default Companies;
