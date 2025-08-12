import { cookies } from 'next/headers';

export default async function fetchWithRefresh(
  url: string,
  options: RequestInit = {}
) {
  // Get all cookies from Next.js server environment
  const cookieStore = await cookies();

  // Merge or set headers with Cookie
  options.headers = {
    ...(options.headers || {}),
    Cookie: cookieStore.toString(),
  };

  options.credentials = 'include'; // include cookies on fetch

  let response = await fetch(url, options);

  if (response.status === 401) {
    // Try refresh token endpoint
    console.log('api3');
    const refreshResponse = await fetch(
      'http://localhost:5000/auths/refreshToken',
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          Cookie: cookieStore.toString(),
        },
      }
    );
    console.log('api2');
    if (refreshResponse.ok) {
      // Refresh succeeded, retry original request
      // Note: You may want to update cookies here if needed (depends on backend)
      console.log('api');
      response = await fetch(url, options);
      console.log('prsaning');
      const data = await response.json();
      console.log('data: ', data);
    } else {
      console.log('error');
      throw new Error('Unauthorized - Refresh token expired');
    }
  }

  return response;
}
