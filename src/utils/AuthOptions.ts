import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials";
import * as bcrypt from 'bcrypt'
import User from "../../mongoose/models/User";
import { NextResponse,NextRequest } from "next/server";


export const authOptions:AuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
        Credentials({
          name:'credentials',
          credentials: {
            email: {
              label: 'username',
              type: 'email',
              placeholder: 'jsmith@example.com',
            },
            password: { label: 'Password', type: 'password' },
            
          },
          async authorize(credentials: any,req: NextRequest):Promise<any>{
            if(!credentials.email || !credentials.password){
              return null;
            }

            const {email,password} = credentials

            const user =await User.findOne({Email:email});
            if(user == null){
              return NextResponse.redirect(new URL("/signin",req.nextUrl))
            }
            const passwordMatch=await bcrypt.compare(password,user.Password);

            if(!passwordMatch){
              return NextResponse.redirect(new URL("/signin",req.nextUrl))
            }
            const obj = {
              userid:user._id,
              name:user.Username,
              email:user.Email,
              image:user.Avatar
            }
            return obj
          }
        })
    ],
    callbacks: {
        async signIn({account, profile }:any){
          if(account.provider === 'github' || account.provider === 'google'){
            const {login, email,avatar_url} = profile
            const userCheck =await User.findOne({Email:email});
            if(!userCheck){
              let newUser=new User();
              newUser.Username=login;
              newUser.Email=email;
              newUser.Avatar = avatar_url
              newUser.Provider = "other"
              const resp=await newUser.save();
              console.log(resp)
            }
          }
            return true;
          },
          async jwt({ token, account, profile }:any) {

            if (account && account.type !== "credentials") {
              token.accessToken = account.access_token
              token.id = profile.id
            }
            return token
          },
          async session({ session, token, user }:any) {
            session.accessToken = token.accessToken
            session.user.id = token.id
            return session;
          }
    },
    session:{
      strategy:"jwt"
    }
}