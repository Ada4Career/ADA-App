// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

import { API_BASE_URL } from '@/constant/config';

import { routing } from './i18n/routing';

// Route constants
const LOGIN_ROUTE = '/?auth=login';
const JOBSEEKER_ROUTE = '/app/home/jobs';
const HR_ROUTE = '/app/hr/dashboard';

// Define route roles
export enum RouteRole {
  public,
  optional,
  authenticated, // Requires login (any role)
  onboarding,
  jobseeker,
  human_resources,
}

// Map paths to roles
const routeRoleMap = {
  '/': 'public',
  '/onboarding': 'onboarding',
  '/app/home/jobs': 'jobseeker',
  '/app/hr/dashboard': 'human_resources',
  '/app/profile': 'authenticated',
};

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware(routing);

// Check if a path is a localized path
function isLocalizedPath(path: string, locales: string[]) {
  return locales.some((locale) => path.startsWith(`/${locale}/`));
}

async function authMiddleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const redirectParam = request.nextUrl.searchParams.get('redirect');
  const token = request.cookies.get('ada4career-token')?.value;
  let routeRole = 'authenticated';

  // Determine the route role
  for (const [pattern, role] of Object.entries(routeRoleMap)) {
    if (path === pattern || path.startsWith(`${pattern}/`)) {
      routeRole = role;
      break;
    }
  }

  // Check if the user is authenticated
  if (!token) {
    if (routeRole === 'public' || routeRole === 'optional') {
      return NextResponse.next();
    }

    // Redirect to login page
    const loginUrl = new URL(LOGIN_ROUTE, request.url);
    if (redirectParam) {
      loginUrl.searchParams.set('redirect', redirectParam);
    } else if (path !== LOGIN_ROUTE) {
      loginUrl.searchParams.set('redirect', path);
    }
    return NextResponse.redirect(loginUrl);
  }

  try {
    const userResponse = await fetch(`${API_BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Invalid token
    if (!userResponse.ok) {
      const response = NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));
      response.cookies.delete('ada4career-token');
      response.cookies.delete('ada4career-email');
      return response;
    }

    const userData = await userResponse.json();
    const user = userData.data;
    const userRole = user?.role?.[0];

    if (!userRole) {
      const response = NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));
      response.cookies.delete('ada4career-token');
      response.cookies.delete('ada4career-email');
      return response;
    }

    const response = NextResponse.next();

    // Store only email in cookies
    response.cookies.set('ada4career-email', user.email, {
      httpOnly: true,
      secure: true,
      path: '/',
    });

    // Handle public routes
    if (routeRole === 'public') {
      // Check if user needs to complete onboarding
      if (
        user.gender != 'male' &&
        user.gender != 'female' &&
        user.gender != 'other'
      ) {
        return NextResponse.redirect(new URL('/onboarding', request.url));
      } else {
        // Redirect to appropriate dashboard
        return NextResponse.redirect(
          new URL(
            userRole === 'jobseeker' ? JOBSEEKER_ROUTE : HR_ROUTE,
            request.url
          )
        );
      }
    }

    // Allow access to authenticated routes
    if (routeRole === 'authenticated') {
      return response;
    }

    // Handle onboarding routes
    if (routeRole === 'onboarding') {
      if (
        user.gender == 'male' ||
        user.gender == 'female' ||
        user.gender == 'other'
      ) {
        if (userRole === 'jobseeker') {
          if (user.job_seeker_data?.resume_url != '') {
            return NextResponse.redirect(new URL(JOBSEEKER_ROUTE, request.url));
          }
        } else {
          return NextResponse.redirect(new URL(HR_ROUTE, request.url));
        }
      }
    }

    // Handle role-specific routes
    if (
      (routeRole === 'jobseeker' && userRole !== 'jobseeker') ||
      (routeRole === 'human_resources' && userRole !== 'human_resources')
    ) {
      if (
        user.gender != 'male' &&
        user.gender != 'female' &&
        user.gender != 'other'
      ) {
        return NextResponse.redirect(new URL('/onboarding', request.url));
      } else {
        return NextResponse.redirect(
          new URL(
            userRole === 'jobseeker' ? JOBSEEKER_ROUTE : HR_ROUTE,
            request.url
          )
        );
      }
    }

    return response;
  } catch (error) {
    console.error('Auth middleware error:', error);
    const response = NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));
    response.cookies.delete('ada4career-token');
    response.cookies.delete('ada4career-email');
    return response;
  }
}

// Combine both middlewares
export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip certain paths from all middleware
  if (
    path.includes('.') || // Static files
    path.startsWith('/_next') || // Next.js internal routes
    path.startsWith('/api') || // API routes
    path.startsWith('/trpc') || // tRPC routes
    path.startsWith('/_vercel') // Vercel internal routes
  ) {
    return NextResponse.next();
  }

  // Handle internationalization first
  // Only process paths that aren't already localized
  if (!isLocalizedPath(path, [...routing.locales])) {
    // Run the intl middleware
    const intlResult = await intlMiddleware(request);

    // If the intl middleware redirected, return that response
    if (intlResult.status !== 200) {
      return intlResult;
    }
  }

  // Run the auth middleware
  return authMiddleware(request);
}

export const config = {
  // Match all pathnames except for ones containing a dot (e.g. favicon.ico)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
