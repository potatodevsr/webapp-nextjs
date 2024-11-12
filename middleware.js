import NextAuth from 'next-auth';
import authConfig from './auth.config';

const { auth } = NextAuth(authConfig);

// export default NextAuth(authConfig).auth

// export const config = {
//     matcher: [
//         /*
//          * Match all request paths except for the ones starting with:
//          * - api (API routes)
//          * - _next/static (static files)
//          * - _next/image (image optimization files)
//          * - favicon.ico, sitemap.xml, robots.txt (metadata files)
//          */
//         '/((?!api|_next/static|_next/image|.*\\.svg$|.*\\.png$|.*\\.jpeg$).*)',
//     ],
// }


export default auth((req) => {
    if (!req.auth) {
        const url = req.url.replace(req.nextUrl.pathname, '/');
        return Response.redirect(url);
    }
});

export const config = { matcher: ['/dashboard/:path*'] };