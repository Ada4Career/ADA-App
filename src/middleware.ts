// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { API_BASE_URL } from '@/constant/config';

import { routing } from './i18n/routing';

// Route constants
const LOGIN_ROUTE = '/?auth=login';
const JOBSEEKER_ROUTE = '/app/home/jobs';
const HR_ROUTE = '/app/hr/dashboard';

// Map paths to roles
const routeRoleMap = {
  '/': 'public',
  '/onboarding': 'onboarding',
  '/app/home/jobs': 'jobseeker',
  '/app/hr/dashboard': 'human_resources',
  '/app/profile': 'authenticated',
};

// Create the intl middleware
const handleI18nRouting = createMiddleware(routing);

// Helper to get the current locale from path
function getLocaleFromPath(path: string, locales: string[]): string | null {
  for (const locale of locales) {
    if (path === `/${locale}` || path.startsWith(`/${locale}/`)) {
      return locale;
    }
  }
  return null;
}

// Skip middleware for these paths
function shouldSkipMiddleware(path: string) {
  return (
    path.includes('.') || // Static files
    path.startsWith('/_next') || // Next.js internal routes
    path.startsWith('/api') || // API routes
    path.startsWith('/trpc') || // tRPC routes
    path.startsWith('/_vercel') // Vercel internal routes
  );
}

// Authentication middleware function
async function authMiddleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const redirectParam = request.nextUrl.searchParams.get('redirect');
  const token = request.cookies.get('ada4career-token')?.value;
  let routeRole = 'authenticated';

  // Get the current locale, if any
  const currentLocale = getLocaleFromPath(path, [...routing.locales]);
  const localePrefix = currentLocale ? `/${currentLocale}` : '';

  // Determine the route role - strip locale for matching
  const pathWithoutLocale = currentLocale
    ? path.substring(currentLocale.length + 1) || '/'
    : path;

  for (const [pattern, role] of Object.entries(routeRoleMap)) {
    if (
      pathWithoutLocale === pattern ||
      pathWithoutLocale.startsWith(`${pattern}/`)
    ) {
      routeRole = role;
      break;
    }
  }

  // Check if the user is authenticated
  if (!token) {
    if (routeRole === 'public' || routeRole === 'optional') {
      return NextResponse.next();
    }

    // Redirect to login page with locale preserved
    const loginUrl = new URL(`${localePrefix}${LOGIN_ROUTE}`, request.url);
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
      const response = NextResponse.redirect(
        new URL(`${localePrefix}${LOGIN_ROUTE}`, request.url)
      );
      response.cookies.delete('ada4career-token');
      response.cookies.delete('ada4career-email');
      return response;
    }

    const userData = await userResponse.json();
    const user = userData.data;
    const userRole = user?.role?.[0];

    if (!userRole) {
      const response = NextResponse.redirect(
        new URL(`${localePrefix}${LOGIN_ROUTE}`, request.url)
      );
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
        return NextResponse.redirect(
          new URL(`${localePrefix}/onboarding`, request.url)
        );
      } else {
        // Redirect to appropriate dashboard with locale preserved
        return NextResponse.redirect(
          new URL(
            `${localePrefix}${
              userRole === 'jobseeker' ? JOBSEEKER_ROUTE : HR_ROUTE
            }`,
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
            return NextResponse.redirect(
              new URL(`${localePrefix}${JOBSEEKER_ROUTE}`, request.url)
            );
          }
        } else {
          return NextResponse.redirect(
            new URL(`${localePrefix}${HR_ROUTE}`, request.url)
          );
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
        return NextResponse.redirect(
          new URL(`${localePrefix}/onboarding`, request.url)
        );
      } else {
        return NextResponse.redirect(
          new URL(
            `${localePrefix}${
              userRole === 'jobseeker' ? JOBSEEKER_ROUTE : HR_ROUTE
            }`,
            request.url
          )
        );
      }
    }

    return response;
  } catch (error) {
    console.error('Auth middleware error:', error);
    const response = NextResponse.redirect(
      new URL(`${localePrefix}${LOGIN_ROUTE}`, request.url)
    );
    response.cookies.delete('ada4career-token');
    response.cookies.delete('ada4career-email');
    return response;
  }
}

// The main middleware function that combines both internationalization and auth
export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip processing for certain paths
  if (shouldSkipMiddleware(path)) {
    return NextResponse.next();
  }
  // Step 3: Apply auth middleware on the original request
  // This ensures auth logic runs with the locale information preserved
  authMiddleware(request);
  // Step 1: Apply the intl middleware
  const response = handleI18nRouting(request);

  // Step 2: If intl middleware redirected (e.g., locale detection), return immediately
  if (response.status !== 200) {
    return response;
  }
  return response;
}

export const config = {
  // Match all pathnames except for ones containing a dot (e.g. favicon.ico)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
