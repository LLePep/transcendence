export interface GoogleUserInfo {
  id: string; // Google subject ID
  email: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email_verified?: boolean;
}

export const isGoogleAuthConfigured = (): boolean => {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
};

/**
 * Generate Google OAuth 2.0 authorization URL
 */
export const getGoogleAuthUrl = (): string => {
  const clientId = process.env.GOOGLE_CLIENT_ID || '';
  const redirectUri =
    process.env.GOOGLE_CALLBACK_URL || 'https://localhost:1026/api/auth/google/callback';

  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: redirectUri,
    client_id: clientId,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };

  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
};

/**
 * Exchange authorization code for Google access and ID tokens
 */
export const exchangeCodeForTokens = async (
  code: string
): Promise<{ access_token: string; id_token: string }> => {
  const clientId = process.env.GOOGLE_CLIENT_ID || '';
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
  const redirectUri =
    process.env.GOOGLE_CALLBACK_URL || 'https://localhost:1026/api/auth/google/callback';

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Google OAuth Error] Token exchange failed:', errorText);
    throw new Error('Failed to exchange authorization code with Google.');
  }

  return response.json() as Promise<{ access_token: string; id_token: string }>;
};

/**
 * Retrieve verified user profile from Google using access token
 */
export const getGoogleUserInfo = async (accessToken: string): Promise<GoogleUserInfo> => {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Google OAuth Error] UserInfo fetch failed:', errorText);
    throw new Error('Failed to fetch user information from Google.');
  }

  const data = (await response.json()) as any;
  return {
    id: data.sub,
    email: data.email,
    name: data.name,
    given_name: data.given_name,
    family_name: data.family_name,
    picture: data.picture,
    email_verified: data.email_verified,
  };
};

/**
 * Verify Google ID token (for client-side Google Sign-In button)
 */
export const verifyGoogleIdToken = async (idToken: string): Promise<GoogleUserInfo> => {
  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Google OAuth Error] ID Token verification failed:', errorText);
    throw new Error('Invalid Google ID token.');
  }

  const data = (await response.json()) as any;
  return {
    id: data.sub,
    email: data.email,
    name: data.name,
    given_name: data.given_name,
    family_name: data.family_name,
    picture: data.picture,
    email_verified: data.email_verified === 'true' || data.email_verified === true,
  };
};

/**
 * Helper to generate a valid unique Transcendence username from Google profile
 */
export const formatGoogleUsername = (name: string, email: string): string => {
  // Extract alphanumeric characters
  let base = (name || email.split('@')[0])
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(0, 16);

  if (base.length < 3) {
    base = `player_${Math.floor(1000 + Math.random() * 9000)}`;
  }
  return base;
};
