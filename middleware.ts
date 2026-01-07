export const config = {
  matcher: ['/app', '/app/(.*)'],
};

export default function middleware(request: Request) {
  const url = new URL(request.url);
  
  // Allow access to login page
  if (url.pathname === '/app/login' || url.pathname === '/app/login.html') {
    return;
  }

  // Parse cookies
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').filter(Boolean).map(c => {
      const [key, ...val] = c.split('=');
      return [key, val.join('=')];
    })
  );

  // Check auth cookie
  const authCookie = cookies['app_auth'];
  const expectedToken = process.env.APP_AUTH_TOKEN;

  if (authCookie === expectedToken) {
    return;
  }

  // Not authenticated - redirect to login
  return Response.redirect(new URL('/app/login.html', request.url), 302);
}
