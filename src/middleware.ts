// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { API_BASE_URL } from '@/constant/config';

// Route constants
const LOGIN_ROUTE = '/?auth=login';
const JOBSEEKER_ROUTE = '/app/home';
const HR_ROUTE = '/app/hr';

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
  '/app/home': 'jobseeker',
  '/app/hr': 'human_resources',
  '/app/profile': 'authenticated',
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const redirectParam = request.nextUrl.searchParams.get('redirect');
  const token = request.cookies.get('ada4career-token')?.value;
  let routeRole = 'authenticated';

  for (const [pattern, role] of Object.entries(routeRoleMap)) {
    if (path === pattern || path.startsWith(`${pattern}/`)) {
      routeRole = role;
      break;
    }
  }

  if (!token) {
    if (routeRole === 'public' || routeRole === 'optional') {
      return NextResponse.next();
    }

    const loginUrl = new URL(LOGIN_ROUTE, request.url);
    loginUrl.searchParams.set('redirect', redirectParam || path);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const userResponse = await fetch(`${API_BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // * Token Valid, Ada User
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

    if (routeRole === 'public') {
      if (
        user.gender != 'male' &&
        user.gender != 'female' &&
        user.gender != 'other'
      ) {
        return NextResponse.redirect(new URL('/onboard', request.url));
      } else {
        return NextResponse.redirect(
          new URL(
            userRole === 'jobseeker' ? JOBSEEKER_ROUTE : HR_ROUTE,
            request.url
          )
        );
      }
    }

    if (routeRole === 'authenticated') {
      return response;
    }

    // masuk ke onboarding, tapi udah onboarding
    // alasan cek gender doang, karena form gender itu setelah disability, kalo gender udah, disability pasti udah
    if (routeRole === 'onboarding') {
      if (
        user.gender == 'male' ||
        user.gender == 'female' ||
        user.gender == 'other'
      ) {
        return NextResponse.redirect(
          new URL(
            userRole === 'jobseeker' ? JOBSEEKER_ROUTE : HR_ROUTE,
            request.url
          )
        );
      }
    }

    if (
      (routeRole === 'jobseeker' && userRole !== 'jobseeker') ||
      (routeRole === 'human_resources' && userRole !== 'human_resources')
    ) {
      if (
        user.gender != 'male' &&
        user.gender != 'female' &&
        user.gender != 'other'
      ) {
        return NextResponse.redirect(new URL('/onboard', request.url));
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

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
