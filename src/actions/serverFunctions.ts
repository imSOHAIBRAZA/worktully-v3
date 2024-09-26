"use server";

import { revalidateTag as revalidate } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

export const getJobProfile = async () => {
  try {
    const session = await getServerSession(authOptions);

    // Check if the session exists and has the access token
    if (!session || !session?.user?.access) {
      throw new Error("No session or access token found");
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/job_profile/info/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.user.access}`,
          "Content-Type": "application/json",

          cache: "no-store",
        },
        next: { tags: ["jobProfile"] },
      }
    );

    // Check if the request was successful
    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch job profile:", error.message);
    return null;
  }
};

export const getJobSeeker = async () => {
  try {
    const session = await getServerSession(authOptions);

    // Check if the session exists and has the access token
    if (!session || !session?.user?.access) {
      throw new Error("No session or access token found");
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/job_seeker/info/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.user.access}`,
          "Content-Type": "application/json",

          cache: "no-store",
        },
        next: { tags: ["jobSeeker"] },
      }
    );

    // Check if the request was successful
    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch job profile:", error.message);
    return null;
  }
};

export const getQuiz = async (id) => {
  try {
    const session = await getServerSession(authOptions);

    // Check if the session exists and has the access token
    if (!session || !session?.user?.access) {
      throw new Error("No session or access token found");
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/get-assessment-questions/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.user.access}`,
          "Content-Type": "application/json",
          cache: "no-store",
        },
        body: JSON.stringify({
          job_title_id: id, // Pass the job title ID here
        }),
        next: { tags: ["getAssessment"] },
      }
    );

    // Check if the response was not OK
    if (!res.ok) {
      const errorDetails = await res.text(); // Attempt to read error details from the response body
      console.error(
        `Error1: Status ${res.status} - ${res.statusText} - Details: ${errorDetails}`
      );
      return null;
    }

    // Parse and return the JSON data if the response was OK
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch job profile:", error.message);
    return null;
  }
};

export const revalidateTag = (name) => {
  revalidate(name);
};
