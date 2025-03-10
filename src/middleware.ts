// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Route constants
const LOGIN_ROUTE = '/?auth=login';
const JOBSEEKER_ROUTE = '/app/home';
const HR_ROUTE = '/app/hr';

// Define route roles
export enum RouteRole {
  public,
  optional,
  authenticated, // Requires login (any role)
  jobseeker,
  human_resources,
}

// Map paths to roles
const routeRoleMap = {
  '/': 'public',
  '/onboarding': 'authenticated',
  '/app/home': 'jobseeker',
  '/app/hr': 'human_resources',
  '/app/profile': 'authenticated',
  // Add more routes as needed
};

export async function middleware(request: NextRequest) {
  // Get the current path
  const path = request.nextUrl.pathname;

  // Get the redirect param if it exists
  const redirectParam = request.nextUrl.searchParams.get('redirect');

  // Get token from cookies
  const token = request.cookies.get('token')?.value;

  // Determine route role for the current path (default to authenticated)
  let routeRole = 'authenticated';

  // Find matching route pattern
  for (const [pattern, role] of Object.entries(routeRoleMap)) {
    if (path === pattern || path.startsWith(`${pattern}/`)) {
      routeRole = role;
      break;
    }
  }

  // If no token exists
  if (!token) {
    // Allow access to public and optional routes
    if (routeRole === 'public' || routeRole === 'optional') {
      return NextResponse.next();
    }

    // Redirect to login for protected routes
    const loginUrl = new URL(LOGIN_ROUTE, request.url);
    // Preserve the intended destination
    loginUrl.searchParams.set('redirect', redirectParam || path);
    return NextResponse.redirect(loginUrl);
  }

  // If token exists, verify it and get user info
  try {
    // Fetch user data using the token
    const userResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      }
    );

    if (!userResponse.ok) {
      // Invalid token, clear it and redirect to login
      const response = NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));
      response.cookies.delete('token');
      return response;
    }

    const userData = await userResponse.json();
    const user = userData.data;
    const userRole = user?.role?.[0];

    if (!userRole) {
      // Missing role information, clear token and redirect to login
      const response = NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));
      response.cookies.delete('token');
      return response;
    }

    // Redirect authenticated users away from public routes (like login)
    if (routeRole === 'public') {
      const dashboardUrl =
        redirectParam ||
        (userRole === 'jobseeker' ? JOBSEEKER_ROUTE : HR_ROUTE);
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }

    // For authenticated route, any logged-in user can access
    if (routeRole === 'authenticated') {
      return NextResponse.next();
    }

    // Check if user has the required role for role-specific routes
    if (
      (routeRole === 'jobseeker' && userRole !== 'jobseeker') ||
      (routeRole === 'human_resources' && userRole !== 'human_resources')
    ) {
      // Redirect to the appropriate dashboard for their role
      const dashboardUrl =
        userRole === 'jobseeker' ? JOBSEEKER_ROUTE : HR_ROUTE;
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }

    // User is authenticated and has correct role, allow access
    return NextResponse.next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    // In case of any errors, clear token and redirect to login
    const response = NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));
    response.cookies.delete('token');
    return response;
  }
}

// Configure which paths the middleware will run on - fixed matcher pattern
export const config = {
  matcher: [
    // Match all paths except for specific paths we want to exclude
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
