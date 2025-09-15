import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')?.value;

    if (pathname.startsWith('/student') || pathname.startsWith('/instructor')) {
        if (!token) {
            return NextResponse.redirect(new URL('/?login=true', request.url));
        }

        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            const { payload } = await jwtVerify(token, secret);

            if (pathname.startsWith('/student') && payload.role !== 'student') {
                return NextResponse.redirect(new URL('/?login=true', request.url));
            }
            if (pathname.startsWith('/instructor') && payload.role !== 'instructor') {
                return NextResponse.redirect(new URL('/?login=true', request.url));
            }
        } catch (err) {
            return NextResponse.redirect(new URL('/?login=true', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/student/:path*', '/instructor/:path*'],
};