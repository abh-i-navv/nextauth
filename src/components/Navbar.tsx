"use client"

import Link from "next/link";
import React from "react";
import { buttonVariants } from "./ui/button";
import { HandMetal } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

function Navbar() {

  const {data,status} = useSession()

  return (
    <div className="bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0">
      <div className="container flex items-center justify-between">
        <Link href={"/"}>
          <HandMetal />
        </Link>
        {status === 'authenticated' ? (<Image src={`${data.user?.image}`} height={25} width={24} alt="avatar"></Image>) : <></>}
        {
         status === 'authenticated' ? (<Link className={buttonVariants()} onClick={()=>signOut()} href={"/"}>
         Sign Out
       </Link>) 
        :(<Link className={buttonVariants()} href={"/signin"}>
          Sign in
        </Link>)
        }

      </div>
    </div>
  );
}

export default Navbar;
