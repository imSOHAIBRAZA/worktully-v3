// // import { getServerSession } from 'next-auth/next';
// import { createUploadthing, type FileRouter } from 'uploadthing/next';
// // import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';

// const f = createUploadthing();

// const auth = (req: Request) => ({ id: 'fakeId' }); // Fake auth function

// // FileRouter for your app, can contain multiple FileRoutes
// export const ourFileRouter = {
//   // Define as many FileRoutes as you like, each with a unique routeSlug
//   avatar: f({ image: { maxFileSize: '4MB' } })
//     .middleware(({ req }) => auth(req))
//     .onUploadComplete((data) => console.log('file', data)),

//   generalMedia: f({
//     'application/pdf': { maxFileSize: '4MB', maxFileCount: 4 },
//     image: { maxFileSize: '2MB', maxFileCount: 4 },
//     video: { maxFileSize: '256MB', maxFileCount: 1 },
//   })
//     .middleware(({ req }) => auth(req))
//     .onUploadComplete((data) => console.log('file', data)),
// } satisfies FileRouter;

// export type OurFileRouter = typeof ourFileRouter;


import { getServerSession } from 'next-auth/next';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';

const f = createUploadthing();

const auth = async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
  return { id: session.user.id }; // Return authenticated user ID
};

export const ourFileRouter = {
  avatar: f({ image: { maxFileSize: '4MB' } })
    .middleware(async ({ req }) => {
      try {
        return await auth(req);
      } catch (error) {
        throw new Error('Authentication failed');
      }
    })
    .onUploadComplete((data) => {
      console.log('Avatar uploaded:', data);
    }),

  generalMedia: f({
    'application/pdf': { maxFileSize: '4MB', maxFileCount: 4 },
    image: { maxFileSize: '2MB', maxFileCount: 4 },
    video: { maxFileSize: '256MB', maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      try {
        return await auth(req);
      } catch (error) {
        throw new Error('Authentication failed');
      }
    })
    .onUploadComplete((data) => {
      console.log('General media uploaded:', data);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
