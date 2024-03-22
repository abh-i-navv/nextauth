
import { getToken } from 'next-auth/jwt'
import { getSession } from 'next-auth/react'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname

    const isPublicPath = path === '/signin' || path === '/signup'

    const token = await getToken({req})
    console.log(token)
    if(isPublicPath && token){
        return NextResponse.redirect(new URL("/",req.nextUrl))
    }

    else if(token){
        console.log("JSON Web Token", JSON.stringify(token, null, 2))
    }
    
}

 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/profile',
    '/signin',
    '/signup',
    '/verifyemail'
  ]
}