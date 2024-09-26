"use client"

import { useEffect } from 'react';
import { Title, Badge } from 'rizzui';
import Card from "@/components/cards/card";
import ProfileProgress from "./profile-progress";
import Education from "./education";
import Language from "./language";
import Experience from "./experience"
import Portfolio from './portfolio';
import Skill from './skill';
import { useAtom } from "jotai";
import { profileAtom } from "@/utils/atoms/profileAtom";
import EditJobProfile from "../../shared/profile/EditJobPofile";


export default function ProfileDetails({ profile }: any) {

  const [, setAtomProfile] = useAtom(profileAtom);

  useEffect(() => {
    if (profile) {
      setAtomProfile(profile);
    }
  }, [profile, setAtomProfile]);

  const { status,
    id,
    hourly_rate,
    languages,
    job_title,
    completion_rate, education, experience, portfolio,skills } = profile
  console.log("PROFILE DETAILS COMPONENT", profile)
  return (
    <div className="rounded-lg border border-muted col-span-full @5xl:col-span-8 @7xl:col-span-9">

      {/* PROFILE PROGRESS */}
      <Card >
        <ProfileProgress completionRate={completion_rate}  jobProfileId={id} jobTitleId={job_title?.id}/>
      </Card>

      {/* PROFILE SECTION */}
      <Card>
        <EditJobProfile data={profile} />
        <WorkProfile rate={hourly_rate} status={status} experience="5+" />
      </Card>

      {/* EDUCATION SECTION */}
      <Education data={education} />

      {/* EXPERIANCE SECTION */}
      <Experience data={experience} jobProfileId={id} />

      {/* LANGUAGE SECTION */}
      <Language data={languages} />

      {/* SKILLS SECTION */}

      <Skill data={skills}
      jobProfileId={id} 
      />




      {/* PORTFIO SECTION */}

      <Portfolio data={portfolio} jobProfileId={id} />

    </div>
  );
}



const WorkProfile = ({ rate = "", experience = "", status = "" }) => {
  return (
    <>
      <Title className="text-gray-600 text-lg py-2" >Hourly rate</Title>
      <div>
        <Title className="text-gray-600 text-2xl py-2" >${rate}<span className="text-lg">/Hour</span>
          <Badge
            variant="flat"
            color="danger"
            rounded="md"
            className="mx-6 capitalize"
          >
            {status}
          </Badge>
        </Title>

      </div>
      <Title className="text-gray-600 text-lg pt-2" >{`${experience} years of experience`}</Title>
    </>
  )
}
