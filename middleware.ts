// import { clerkMiddleware } from "@clerk/nextjs/server";

// export default clerkMiddleware({
//   // publicRoutes: ["/", "/api/webhook"]
//   publicRoutes: ['/', 'api/webhook'],

// });

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };


import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// const isProtectedRoute = createRouteMatcher(['/',  '/api/webhook(.*)'])
const isProtectedRoute = createRouteMatcher(['/',  'api/webhook'])


export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect()
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],

}