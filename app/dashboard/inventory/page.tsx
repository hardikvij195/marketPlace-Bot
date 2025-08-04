/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-comment-textnodes */
"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import Modal from "@/app/components/Modal";

interface InterestForm {
   show: boolean;
    vehicle: VehicleList | null;
}

interface VehicleList{
    title: string;
    exteriorColor: string;
    interiorColor: string;
    kms: string;
    drivetrain: string;
    features: string;
    images: string[];
    price: string;
    vin: string;
    id: string;
    year: string;
    make: string;
    model: string;
    trim: string;
    stockNumber: string;
    specialFeatures: string;
}


function Inventory() {
  const [vehiclesList, setVehiclesList] = useState<VehicleList[]>([]);
  const [filterVehiclesList, setFilterVehiclesList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // For input value
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(""); // For debounced search
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(true);
  const [error, setError] = useState(null);
  const limit = 12;
  const [skip, setSkip] = useState(0);
  const [filterSkip, setFilterSkip] = useState(0);
  const [searchMode, setSearchMode] = useState(false);

  const fetchVehicles = async (
    isSearch = false,
    initialSearch = false,
    newData = false
  ) => {
    try {
      if (isSearch) setSearchLoading(true);
      if (initialSearch) setSearchLoading(true);

      const endpoint = "https://adminsnd.ca/parse/functions/getVehicles";

      const body = { limit, skip };

      const response = await axios.post(endpoint, body, {
        headers: {
          "Content-Type": "application/json",
          "X-Parse-Application-Id": "119b9dfd909eca53ceee2ea306fa193c84728746",
          "X-Parse-REST-API-Key": "718eb13b0aae8aff202b8595d1bf29b33225b44e",
        },
      });
      console.log(response.data.result)
      if (response.data.result) {
        const fetchedVehicles = response.data.result;

        if (fetchedVehicles.length < limit) setHasMore(false);

        setVehiclesList((prevVehicles) =>
          newData ? fetchedVehicles : [...prevVehicles, ...fetchedVehicles]
        );
        setSkip((prevSkip) => prevSkip + limit);
      } else {
        throw new Error("Invalid API response format.");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch vehicles.");
    } finally {
      setInitialLoading(false);
      setSearchLoading(false);
    }
  };

  const fetchFilterVehicles = async (
    isSearch = false,
    initialSearch = false,
    newData = false,
    newSkip = null
  ) => {
    try {
      if (isSearch) setSearchLoading(true);
      if (initialSearch) setSearchLoading(true);

      const endpoint = "https://adminsnd.ca/parse/functions/search";

      const body = {
        search: searchQuery,
        limit,
        skip: newSkip != null ? newSkip : filterSkip,
      };

      const response = await axios.post(endpoint, body, {
        headers: {
          "Content-Type": "application/json",
          "X-Parse-Application-Id": "119b9dfd909eca53ceee2ea306fa193c84728746",
          "X-Parse-REST-API-Key": "718eb13b0aae8aff202b8595d1bf29b33225b44e",
        },
      });

      if (response.data.result) {
        const fetchedVehicles = response.data.result;

        if (fetchedVehicles.length < limit) setHasMore(false);

        setFilterVehiclesList((prevVehicles) =>
          newData ? fetchedVehicles : [...prevVehicles, ...fetchedVehicles]
        );
        setFilterSkip((prevSkip) => prevSkip + limit);
      } else {
        throw new Error("Invalid API response format.");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch vehicles.");
    } finally {
      setInitialLoading(false);
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Observer for infinite scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 500 &&
        hasMore &&
        !initialLoading &&
        !searchLoading
      ) {
        if (searchQuery.trim() !== "") {
          fetchFilterVehicles(true);
        } else {
          fetchVehicles(true);
        }
      }
    };
    console.log(hasMore);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchVehicles]);

  // Handle search using debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setHasMore(true);
      setSkip(0);
      setFilterSkip(0);
      if (searchQuery.trim() !== "") {
        setSearchMode(true);
        fetchFilterVehicles(true, true, true, 0);
      } else {
        setSearchMode(false);
        fetchVehicles(true, true, true);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn); // Cleanup the timeout
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const [interestForm, setInterestForm] = useState<InterestForm>({
    show: false,
    vehicle: null,
  });
  const handleHeartClick = (vehicle: VehicleList) => {
    setInterestForm({ show: true, vehicle });
  };

  const closeForm = () => {
    setInterestForm({ show: false, vehicle: null });
  };

  useEffect(() => {
    // Prevent background scroll when popup is open
    if (interestForm.show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup to reset when the component unmounts or state changes
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [interestForm.show]);

  return (
    <div className="my-8 px-4">
      {error && (
        <div className="text-red-500 text-center my-4">Error: {error}</div>
      )}
      <div className="mb-8 container mx-auto lg:w-[40%] relative ">
        <input
          type="text"
          placeholder="Search.. (e.g. Toyota)"
          value={searchQuery}
          onChange={(e) => {
            const newValue = e.target.value;
            if (newValue[0] === " ") {
              setSearchQuery(newValue.trimStart());
            } else {
              setSearchQuery(newValue);
            }
          }}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-primary/30 focus:outline-none"
        />
        {/* Clear Search Button */}
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery(""); // Clear the search query
              setDebouncedSearchQuery(""); // Reset the debounced query
              setHasMore(true);
              setSkip(0);
              setFilterSkip(0);
              fetchVehicles(false, true);
              setFilterVehiclesList([]);
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
          >
            <X />
          </button>
        )}
      </div>
      {initialLoading && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 container mx-auto w-[90%] my-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 animate-pulse rounded-lg p-4 flex flex-col"
              >
                {/* Skeleton Image */}
                <div className="bg-gray-300 w-full h-48 rounded-md mb-4"></div>

                {/* Skeleton Text */}
                <div className="bg-gray-300 w-3/4 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 w-1/2 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 w-3/4 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 w-1/2 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 w-3/4 h-4 rounded mb-2"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 container mx-auto lg:w-[90%] ">
        {!initialLoading &&
          !searchMode &&
          vehiclesList.map((vehicle, index) => (
            <li
              key={`${vehicle.title}-${index}`}
              className="bg-white rounded-2xl shadow-xl pb-8 flex flex-col items-center justify-between relative"
            >
              <div>
                {/* Vehicle Image */}
                {vehicle.images && vehicle.images.length > 0 ? (
                  <div className="mb-4 h-72 relative flex items-center justify-center bg-gray-100">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="loader"></div>
                    </div>
                    <img
                      src={vehicle?.images[0]}
                      className="w-full h-full object-cover lazyload"
                      alt={vehicle.title}
                      onLoad={(e) => {
                        e.target.parentElement.querySelector(
                          ".loader"
                        ).style.display = "none";
                      }}
                    />
                  </div>
                ) : (
                  <div className="mb-4 h-78 flex items-center relative">
                    <img
                      src={"/no-img.png"}
                      className="w-full object-cover h-72 lazyload"
                      alt={vehicle.title}
                    />
                  </div>
                )}

                {/* Vehicle Details */}
                <h2 className="text-xl font-medium text-primary mb-2 px-4">
                  {vehicle.title}
                </h2>

                {vehicle.exteriorColor && (
                  <div className="mb-1 pl-4 flex items-center space-x-2">
                    <h3 className="text-gray-600 font-bold">Exterior Color:</h3>
                    <p className="text-black font-normal text-sm ">
                      {vehicle.exteriorColor}
                    </p>
                  </div>
                )}
                {vehicle.interiorColor && (
                  <div className="mb-1 pl-4 flex items-center space-x-2">
                    <h3 className="text-gray-600 font-bold">Interior Color:</h3>
                    <p className="text-black font-normal text-sm ">
                      {vehicle.interiorColor}
                    </p>
                  </div>
                )}
                {vehicle.kms && (
                  <div className="mb-1 pl-4 flex items-center space-x-2">
                    <h3 className="text-gray-600 font-bold">Kilometers:</h3>
                    <p className="text-black font-normal text-sm ">
                      {vehicle.kms}
                    </p>
                  </div>
                )}

                {vehicle.drivetrain && (
                  <div className="mb-1 pl-4 flex items-center space-x-2">
                    <h3 className="text-gray-600 font-bold">Drivetrain:</h3>
                    <p className="text-black font-normal text-sm ">
                      {vehicle.drivetrain}
                    </p>
                  </div>
                )}

                {vehicle.features && (
                  <div className="px-4 flex items-center">
                    <h3 className="text-gray-600 font-bold">
                      Features:{" "}
                      <span className="text-black font-normal text-sm ">
                        {vehicle.features}
                      </span>
                    </h3>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center pr-4">
                <button
                  className="bg-primary cursor-pointer text-white font-medium py-2 px-5 rounded-full mt-4 hover:scale-105"
                  onClick={() => handleHeartClick(vehicle)}
                >
                  Show Details
                </button>
              </div>
            </li>
          ))}
        {!initialLoading &&
          searchMode &&
          filterVehiclesList.map((vehicle: VehicleList, index) => (
            <li
              key={`${vehicle.title}-${index}`}
              className="bg-white rounded-2xl shadow-xl pb-8 flex flex-col items-center justify-between relative"
            >
              <div>
                {/* Vehicle Image */}
                {vehicle.images && vehicle.images.length > 0 ? (
                  <div className="mb-4 h-72 relative flex items-center justify-center bg-gray-100">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="loader"></div>
                    </div>
                    <img
                      src={vehicle.images[0]}
                      className="w-full h-full object-cover lazyload"
                      alt={vehicle.title}
                      onLoad={(e) => {
                        e.target.parentElement.querySelector(
                          ".loader"
                        ).style.display = "none";
                      }}
                    />
                  </div>
                ) : (
                  <div className="mb-4 h-78 flex items-center relative">
                    <img
                      src={"/no-img.png"}
                      className="w-full object-cover h-72 lazyload"
                      alt={vehicle.title}
                    />
                  </div>
                )}

                {/* Vehicle Details */}
                <h2 className="text-xl font-medium text-primary mb-2 px-4">
                  {vehicle.title}
                </h2>

                {vehicle.exteriorColor && (
                  <div className="mb-1 pl-4 flex items-center space-x-2">
                    <h3 className="text-gray-600 font-bold">Exterior Color:</h3>
                    <p className="text-black font-normal text-sm ">
                      {vehicle.exteriorColor}
                    </p>
                  </div>
                )}
                {vehicle.interiorColor && (
                  <div className="mb-1 pl-4 flex items-center space-x-2">
                    <h3 className="text-gray-600 font-bold">Interior Color:</h3>
                    <p className="text-black font-normal text-sm ">
                      {vehicle.interiorColor}
                    </p>
                  </div>
                )}
                {vehicle.kms && (
                  <div className="mb-1 pl-4 flex items-center space-x-2">
                    <h3 className="text-gray-600 font-bold">Kilometers:</h3>
                    <p className="text-black font-normal text-sm ">
                      {vehicle.kms}
                    </p>
                  </div>
                )}

                {vehicle.drivetrain && (
                  <div className="mb-1 pl-4 flex items-center space-x-2">
                    <h3 className="text-gray-600 font-bold">Drivetrain:</h3>
                    <p className="text-black font-normal text-sm ">
                      {vehicle.drivetrain}
                    </p>
                  </div>
                )}

                {vehicle.features && (
                  <div className="px-4 flex items-center">
                    <h3 className="text-gray-600 font-bold">
                      Features:{" "}
                      <span className="text-black font-normal text-sm ">
                        {vehicle.features}
                      </span>
                    </h3>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center pr-4">
                <button
                  className="bg-primary cursor-pointer text-white font-medium py-2 px-5 rounded-full mt-4 hover:scale-105"
                  onClick={() => handleHeartClick(vehicle)}
                >
                  Show Details
                </button>
              </div>
            </li>
          ))}
      </ul>

      {!initialLoading &&
        searchMode &&
        !searchLoading &&
        filterVehiclesList.length == 0 && (
          <div className="flex items-center flex-col justify-center px-4">
            {" "}
            <img src="/no-data.png" className="h-80 w-auto mb-4" />{" "}
            <p className="fredoka-light text-primary text-lg text-center">
              No data to display. Please search for something else.
            </p>
          </div>
        )}
      {searchLoading && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 container mx-auto w-[90%] my-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 animate-pulse rounded-lg p-4 flex flex-col"
              >
                {/* Skeleton Image */}
                <div className="bg-gray-300 w-full h-48 rounded-md mb-4"></div>

                {/* Skeleton Text */}
                <div className="bg-gray-300 w-3/4 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 w-1/2 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 w-3/4 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 w-1/2 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 w-3/4 h-4 rounded mb-2"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {interestForm.show && (
        <Modal isOpen={interestForm.show} onClose={closeForm}>

            {/* Vehicle Details Section */}
            {interestForm.vehicle && (
              <div className="mb-6 border-b pb-4 border-gray-300">
                <h2 className="text-xl font-semibold text-primary mb-4">
                  Vehicle Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  {interestForm.vehicle.images &&
                    interestForm.vehicle.images.length > 0 && (
                      <div className="md:col-span-2 mb-4 flex justify-center">
                        <img
                          src={interestForm.vehicle.images[0]}
                          alt={interestForm.vehicle.title}
                          className="w-full max-w-sm h-48 object-cover rounded-lg shadow-md"
                        />
                      </div>
                    )}
                  <p>
                    <span className="font-medium">Title:</span>{" "}
                    {interestForm.vehicle.title}
                  </p>
                  <p>
                    <span className="font-medium">Year:</span>{" "}
                    {interestForm.vehicle.year}
                  </p>
                  <p>
                    <span className="font-medium">Make:</span>{" "}
                    {interestForm.vehicle.make}
                  </p>
                  <p>
                    <span className="font-medium">Model:</span>{" "}
                    {interestForm.vehicle.model}
                  </p>
                  <p>
                    <span className="font-medium">Trim:</span>{" "}
                    {interestForm.vehicle.trim}
                  </p>
                  <p>
                    <span className="font-medium">Kilometers:</span>{" "}
                    {interestForm.vehicle.kms}
                  </p>
                  <p>
                    <span className="font-medium">Drivetrain:</span>{" "}
                    {interestForm.vehicle.drivetrain}
                  </p>
                  <p>
                    <span className="font-medium">Stock Number:</span>{" "}
                    {interestForm.vehicle.stockNumber}
                  </p>
                  <p>
                    <span className="font-medium">Interior Color:</span>{" "}
                    {interestForm.vehicle.interiorColor}
                  </p>
                  <p>
                    <span className="font-medium">Exterior Color:</span>{" "}
                    {interestForm.vehicle.exteriorColor}
                  </p>
                  {interestForm.vehicle.specialFeatures && (
                    <p className="md:col-span-2">
                      <span className="font-medium">Special Features:</span>{" "}
                      {interestForm.vehicle.specialFeatures}
                    </p>
                  )}
                  {interestForm.vehicle.features && (
                    <p className="md:col-span-2">
                      <span className="font-medium">Features:</span>{" "}
                      {interestForm.vehicle.features}
                    </p>
                  )}
                  <p className="md:col-span-2">
                    <span className="font-medium">VIN:</span>{" "}
                    {interestForm.vehicle.vin}
                  </p>
                </div>
              </div>
            )}

        </Modal>
      )}
    </div>
  );
}

export default Inventory;
