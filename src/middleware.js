import React from 'react'
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt';

export default async function middleware(req) {
    const token = await getToken({ req })
    if (token) {
        return NextResponse.next() // Allow the request to proceed
    } else {
        return NextResponse.redirect(new URL('/login', req.url)) // Redirect to login if not authenticated
    }
}

export const config = {
    matcher: [
        '/Dashboard/:path*',
        '/success',
        '/dashboard/:path*',
    ],
}
