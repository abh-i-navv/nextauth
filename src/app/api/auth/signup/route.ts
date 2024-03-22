import { NextRequest, NextResponse } from "next/server";
import UserModal from "../../../../../mongoose/models/User";
import * as bcrypt from 'bcrypt';
import dbConnect from "../../../../../mongoose/connect";

dbConnect()

export async function POST(req:NextRequest){
    try{
        const {username,email,password}=await req.json();
        let checkExist=await UserModal.findOne({Email:email,Provider:'credentials'});
        if(checkExist){
            return NextResponse.json({
                isError:true,
                message:'Email already exists'
            },{status:400})
        }
        let User=new UserModal();
        User.Username=username;
        User.Email=email;
        const salt = await bcrypt.genSalt(10)
        const hashedPass=await bcrypt.hash(password,salt);
        User.Password=hashedPass;
    
        const resp=await User.save();
        return NextResponse.json({message: "success"},{status:200})
    }
    catch(e){
        console.log(e)
    }
}