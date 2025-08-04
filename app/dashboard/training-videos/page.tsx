/* eslint-disable @next/next/no-img-element */
"use client";

import React, { use, useEffect, useState } from "react";
import { X } from "lucide-react"; // Only necessary icons
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { showToast } from "@/hooks/useToast"; // Assuming you still want toasts for errors
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function VideoViewer() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVideos, setFilteredVideos] = useState([]);

  // Assuming VIDEO_BUCKET is the same as in VideoManager
  const VIDEO_BUCKET = "video-bucket";

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch video metadata from the 'videos' PostgreSQL table
      const { data: dbVideos, error: dbError } = await supabaseBrowser
        .from("videos")
        .select("*")
        .order("uploaded_at", { ascending: false });

      if (dbError) {
        throw new Error(
          dbError.message || "Failed to fetch video metadata from database."
        );
      }

      // For each video record from the database, get its public URL from Storage
      const videosWithUrls = await Promise.all(
        dbVideos.map(async (video) => {
          const { data: publicUrlData } = supabaseBrowser.storage
            .from(VIDEO_BUCKET)
            .getPublicUrl(video.file_path);

          return {
            ...video, // Contains id, title, description, file_path, uploaded_at
            publicUrl: publicUrlData.publicUrl,
          };
        })
      );

      setVideos(videosWithUrls);
      setFilteredVideos(videosWithUrls);
    } catch (err) {
      setError(err.message || "Failed to fetch videos.");
      showToast({
        title: "Error",
        description: err.message || "Failed to load videos.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []); // Fetch videos on initial component mount

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredVideos(videos);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = videos.filter(
        (video) =>
          (video.title || "").toLowerCase().includes(lowerCaseQuery) ||
          (video.description || "").toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredVideos(filtered);
    }
  }, [searchQuery, videos]);

  const router = useRouter();
  const user = useSelector((state: any) => state.user.user);

  useEffect(() => {
    const checkUserPlanAndRedirect = async () => {
      try {
        if (user?.subscriptionPlan.length == 0) {
          router.push("/dashboard");
        } else if (user?.subscriptionPlan.length != 0) {
          const activePlan = user?.subscriptionPlan?.find(
            (w: any) => w?.is_active
          );
          if (!activePlan) {
            router.push("/dashboard/subscription");
          }
        }

      } catch (err) {
        console.log("Unexpected error during plan check:", err);
        router.push("/dashboard");
      }
    };

    if (user) checkUserPlanAndRedirect();
  }, [router,user]);

  return (
    <div className="my-8 lg:px-4 md:px-4 px-2">
      {error && (
        <div className="text-red-500 text-center my-4">Error: {error}</div>
      )}

      {/* Search Bar */}
      <div className="mb-8 container mx-auto relative flex flex-col md:flex-row items-center gap-4">
        <input
          type="text"
          placeholder="Search videos by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 ps-5 border border-gray-300 rounded-lg focus:ring focus:ring-primary/30 focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black md:relative md:top-auto md:right-auto md:translate-y-0"
          >
            <X />
          </button>
        )}
        {/* Removed Upload button */}
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 container mx-auto w-[90%] my-8">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 animate-pulse rounded-lg p-4 flex flex-col"
            >
              <div className="bg-gray-300 w-full h-48 rounded-md mb-4"></div>
              <div className="bg-gray-300 w-3/4 h-4 rounded mb-2"></div>
              <div className="bg-gray-300 w-1/2 h-4 rounded mb-2"></div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredVideos.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 container mx-auto lg:w-[90%]">
          {filteredVideos.map((video) => (
            <li
              key={video.id}
              className="bg-white rounded-2xl shadow-xl p-4 flex flex-col items-center justify-between relative"
            >
              <div className="w-full mb-4 h-48 relative flex items-center justify-center bg-gray-100 rounded-md overflow-hidden">
                <video
                  src={video.publicUrl}
                  controls
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/600x400/E0E0E0/6C757D?text=Video+Error";
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <h2 className="text-lg font-medium text-primary mb-2 text-center break-words w-full px-2">
                {video.title}
              </h2>
              {video.description && (
                <p className="text-gray-600 text-sm mb-2 text-center px-2 line-clamp-3">
                  {video.description}
                </p>
              )}
              {/* Removed File: {video.file_path} as it's not relevant for end-users */}
              <p className="text-gray-600 text-sm mb-4">
                Uploaded: {new Date(video.uploaded_at).toLocaleDateString()}
              </p>
              {/* Removed Update and Delete buttons */}
            </li>
          ))}
        </ul>
      )}

      {!loading && filteredVideos.length === 0 && searchQuery.trim() !== "" && (
        <div className="flex items-center flex-col justify-center px-4 mt-12">
          <img
            src="https://placehold.co/600x400/E0E0E0/6C757D?text=No+Results"
            className="h-80 w-auto mb-4"
            alt="No results"
          />
          <p className="fredoka-light text-primary text-lg text-center">
            No videos found matching your search.
          </p>
        </div>
      )}

      {!loading && videos.length === 0 && searchQuery.trim() === "" && (
        <div className="flex items-center flex-col justify-center px-4 mt-12">
          <img
            src="https://placehold.co/600x400/E0E0E0/6C757D?text=No+Videos"
            className="h-80 w-auto mb-4"
            alt="No videos"
          />
          <p className="fredoka-light text-primary text-lg text-center">
            No videos available yet.
          </p>
        </div>
      )}
    </div>
  );
}
