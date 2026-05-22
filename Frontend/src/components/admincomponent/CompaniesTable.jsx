import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
<<<<<<< HEAD
import { Edit2, MoreHorizontal } from "lucide-react";
=======
import { Eye, MoreHorizontal, Settings, Edit2 } from "lucide-react"; // Note: Edit2 is unused, but included for context
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CompaniesTable = () => {
  const { companies, searchCompanyByText } = useSelector(
    (store) => store.company
  );
  const navigate = useNavigate();
  const [filterCompany, setFilterCompany] = useState(companies);

  useEffect(() => {
    const filteredCompany =
      companies.length >= 0 &&
      companies.filter((company) => {
        if (!searchCompanyByText) {
          return true;
        }
        return company.name
          ?.toLowerCase()
          .includes(searchCompanyByText.toLowerCase());
      });
    setFilterCompany(filteredCompany);
  }, [companies, searchCompanyByText]);

<<<<<<< HEAD
  console.log("COMPANIES", companies);
=======
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
  if (!companies) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Table>
        <TableCaption>Your recent registered Companies</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filterCompany.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No Companies Added
              </TableCell>
            </TableRow>
          ) : (
            filterCompany?.map((company) => (
              <TableRow key={company._id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage
                      src={company.logo || "default-logo-url"}
                      alt={`${company.name} logo`}
                    />
                  </Avatar>
                </TableCell>
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.createdAt.split("T")[0]}</TableCell>
                <TableCell className="text-right cursor-pointer">
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal />
                    </PopoverTrigger>
<<<<<<< HEAD
                    <PopoverContent className="w-32">
                      <div
                        onClick={() => navigate(`/admin/companies/${company._id}`)}
                        className="flex items-center gap-2 w-fit cursor-pointer"
                      >
                        <Edit2 className="w-4" />
                        <span>Edit</span>
                      </div>
=======
                    <PopoverContent className="w-40"> 
                      
                      {/* 1. VIEW JOBS/APPLICANTS (NOW UNDER THE 'EDIT' SPOT) */}
                      {/* Note: This is now the top item, leading to the job list for shortlisting */}
                      <div
                        onClick={() =>
                          navigate(`/admin/companies/${company._id}/jobs`)
                        }
                        className="flex items-center gap-2 w-full cursor-pointer p-2 hover:bg-gray-100 rounded-md transition-colors mb-1 font-semibold text-red-600"
                      >
                        <Eye className="w-4" />
                        <span>View Jobs/Applicants</span>
                      </div>

                      <hr />
                      
                      {/* 2. EDIT DETAILS (MOVED TO THE SECOND SPOT) */}
                      {/* Navigate to the Company Setup page */}
                      <div
                        onClick={() =>
                          navigate(`/admin/companies/${company._id}`)
                        }
                        className="flex items-center gap-2 w-full cursor-pointer p-2 hover:bg-gray-100 rounded-md transition-colors mt-1 text-gray-700"
                      >
                        <Settings className="w-4" /> 
                        <span>Edit Details</span>
                      </div>
                      
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesTable;
