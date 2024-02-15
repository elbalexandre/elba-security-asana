import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { type NextRequest } from 'next/server';
import { env } from '@/env';

// Remove the next line if your integration does not works with edge runtime
export const preferredRegion = env.VERCEL_PREFERRED_REGION;
// Remove the next line if your integration does not works with edge runtime
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export function GET(request: NextRequest) {
  const organisationId = request.nextUrl.searchParams.get('organisation_id');
  const region = request.nextUrl.searchParams.get('region');

  if (!organisationId || !region) {
    redirect(`${env.ELBA_REDIRECT_URL}?error=true`);
  }

  // we store the organisationId in the cookies to be able to retrieve after the SaaS redirection
  cookies().set('organisation_id', organisationId);
  cookies().set('region', region);

  const redirectUrl = new URL(`${env.GITLAB_APP_INSTALL_URL}authorize?`);
  redirectUrl.searchParams.append('client_id', env.GITLAB_CLIENT_ID);
  redirectUrl.searchParams.append('redirect_uri', env.GITLAB_REDIRECT_URI);
  redirectUrl.searchParams.append('response_type', 'code');
  redirectUrl.searchParams.append('state', organisationId);
  redirectUrl.searchParams.append('scope', "sudo read_user api read_api"); // Scopes are space-separated.
  redirectUrl.searchParams.append('code_challenge', "2i0WFA-0AerkjQm4X4oDEhqA17QIAKNjXpagHBXmO_U");
  redirectUrl.searchParams.append('code_challenge_method', "S256");

  // we redirect the user to the installation page of the SaaS application
  redirect(redirectUrl.toString());
}
