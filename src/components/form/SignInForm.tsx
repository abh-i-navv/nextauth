"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import GoogleSigninButton from "../GoogleSigninButton";
import GithubSigninButton from "../GithubSigninButton";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is Required!")
    .min(8, "Password should have at least 8 charactars"),
});
const SignInForm = () => {
  const router = useRouter()

  const [error,setError] = useState(false)
  

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    
    const response = await signIn('credentials',{
      redirect:false,
      email: values.email,
      password: values.password,
      callbackUrl: "/"
    })
    if(response?.status === 200){
      setError(false)
      return router.push("/")
    }
    else if(response?.error){
      setError(true)
    }
    console.log(response)
  };

  return (
    <>
    {error ? (<span>error while sign in</span>) : <></> }
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>email</FormLabel>
                <FormControl>
                  <Input placeholder="mail@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
        </div>

        <Button className="w-full mt-6" type="submit">
          Sign in
        </Button>
      </form>
      <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
        or
      </div>
      <div className="my-2">
      <GoogleSigninButton>Sign in with Google</GoogleSigninButton>
      </div>
      <GithubSigninButton>Sign in with Github</GithubSigninButton>

      <p className="text-center text-sm text-gray-600 mt-2">
        If you don&apos;t have an account, please&nbsp;
        <Link className="text-blue-500 hover:underline" href="/signup">
          Sign up
        </Link>
      </p>
    </Form>
    </>
  );
};

export default SignInForm;
