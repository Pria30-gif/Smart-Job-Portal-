import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
<<<<<<< HEAD
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery, setFilters } from "@/redux/jobSlice";
=======
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e

const filterData = [
  {
    filterType: "Location",
    array: [
      "Delhi",
      "Mumbai",
      "Kolhapur",
      "Pune",
      "Bangalore",
      "Hyderabad",
      "Chennai",
      "Remote",
    ],
  },
  {
    filterType: "Technology",
    array: [
      "Mern",
      "React",
      "Data Scientist",
      "Fullstack",
      "Node",
      "Python",
      "Java",
      "frontend",
      "backend",
      "mobile",
      "desktop",
    ],
  },
  {
    filterType: "Experience",
    array: ["0-3 years", "3-5 years", "5-7 years", "7+ years"],
  },
  {
    filterType: "Salary",
    array: ["0-50k", "50k-100k", "100k-200k", "200k+"],
  },
];

const Filter = () => {
<<<<<<< HEAD
  const dispatch = useDispatch();
  const filters = useSelector((store) => store.job?.filters) || {};

  // When a radio is selected for a specific filter type, update slice filters
  const handleFilterChange = (filterKey, value) => {
    // update the slice filters for this key
    dispatch(setFilters({ [filterKey]: value }));
    // clear any generic searchedQuery so search and filters don't conflict
    dispatch(setSearchedQuery(""));
  };
=======
  const [selectedValue, setSelectedValue] = useState("");
  const handleChange = (value) => {
    setSelectedValue(value);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue]);
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e

  return (
    <div className="w-full bg-white rounded-md">
      <h1 className="font-bold text-lg">Filter Jobs</h1>
      <hr className="mt-3" />
<<<<<<< HEAD
      {filterData.map((data, index) => {
        const key = data.filterType.toLowerCase();
        // map human-friendly names to slice keys
        const keyMap = {
          location: "location",
          technology: "technology",
          experience: "experience",
          salary: "salary",
        };
        const filterKey = keyMap[data.filterType.toLowerCase()] || key;

        return (
          <div key={index} className="mb-4">
            <h2 className="font-bold text-lg">{data.filterType}</h2>
            <RadioGroup
              value={filters[filterKey] || ""}
              onValueChange={(val) => handleFilterChange(filterKey, val)}
            >
              {data.array.map((item, indx) => {
                const itemId = `Id${index}-${indx}`;
                return (
                  <div key={itemId} className="flex items-center space-x-2 my-2">
                    <RadioGroupItem value={item} id={itemId}></RadioGroupItem>
                    <label htmlFor={itemId}>{item}</label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        );
      })}
=======
      <RadioGroup value={selectedValue} onValueChange={handleChange}>
        {filterData.map((data, index) => (
          <div key={index}>
            <h2 className="font-bold text-lg">{data.filterType}</h2>

            {data.array.map((item, indx) => {
              const itemId = `Id${index}-${indx}`;
              return (
                <div key={itemId} className="flex items-center space-x-2 my-2">
                  <RadioGroupItem value={item} id={itemId}></RadioGroupItem>
                  <label htmlFor={itemId}>{item}</label>
                </div>
              );
            })}
          </div>
        ))}
      </RadioGroup>
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
    </div>
  );
};

export default Filter;
