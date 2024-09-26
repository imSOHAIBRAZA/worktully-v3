'use client';
import { Suspense } from "react";
// import { LAYOUT_OPTIONS } from '@/config/enums';
import HydrogenLayout from '@/layouts/hydrogen/layout';

// import { useIsMounted } from '@/hooks/use-is-mounted';

type LayoutProps = {
  children: React.ReactNode;
};

export default function DefaultLayout({ children }: LayoutProps) {
  return <HydrogenLayout>
    <Suspense fallback={<p>Loading Job Seeker...</p>}>
      {children}
    </Suspense>


  </HydrogenLayout>;
}

