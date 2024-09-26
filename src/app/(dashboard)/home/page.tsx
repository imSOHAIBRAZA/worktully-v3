"use client"
import { Title } from "rizzui";
import HydrogenLayout from "@/layouts/hydrogen/layout";
import { useSession, signIn, signOut } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
      <Title>HOME Start Building your App</Title>
        {/* <HydrogenLayout>
          {children}
        </HydrogenLayout> */}
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signOut()}>Sign in</button>
    </>
  )
}