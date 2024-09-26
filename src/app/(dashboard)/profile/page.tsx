
import { Suspense } from 'react'
import ProfileInformation from "@/app/shared/profile/profile-information";
import ProfilesView from "./profileView";
import { getJobProfile, getJobSeeker } from "@/actions/serverFunctions";
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';



// Define the types for the profile data
interface Profile {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  experience: Experience[];
  education: Experience[];
  skills: Experience[];
}

// Define the type for individual experience or education entries
interface Experience {
  id: number;
  company?: string;
  role?: string;
  duration?: string;
  institution?: string;
  degree?: string;
  year?: string;
  skillName?: string;
}




// Main ProfilePage component
export default async function ProfilePage() {

  // Initialize a new instance of QueryClient
  const queryClient = new QueryClient();

  // Prefetch the job profile data from the server
  // 'queryKey' identifies the query, and 'queryFn' is the function to fetch the data
  await queryClient.prefetchQuery({ queryKey: ['jobProfile'], queryFn: getJobProfile });

  // Prefetch the job seeker data from the server
  await queryClient.prefetchQuery({ queryKey: ["jobSeeker"], queryFn: getJobSeeker });

  // Dehydrate the query client state (convert it into a serialized format) for React Query hydration
  const dehydratedState = dehydrate(queryClient);

  return (

    <div className="@container">
      <div className={'grid grid-cols-12 gap-4 @7xl:gap-4'}>

        {/* HydrationBoundary component to pass the pre-fetched data to the client */}

        <HydrationBoundary state={dehydratedState}>
          <ProfileInformation />
          <Suspense fallback={<p>Loading Job profile...</p>}>
            <ProfilesView />
          </Suspense>
        </HydrationBoundary>


      </div>
    </div>
  );
}
