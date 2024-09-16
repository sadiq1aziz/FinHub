"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomInput from "./CustomInput";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/actions/user.actions";

const AuthForm = ({ type }: { type: string }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  //invoke authform to perform input validation based on user action to sign in or sign up
  const formSchema = authFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "", // Default value for email
      password: "", // Default value for password
      city: "",
      ssn: "",
      dateOfBirth: "",
      address1: "",
      postalCode: "",
      firstName: "",
      lastName: "",
      state: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);

    //perform async actions
    try {
      if (type == "sign-up") {
        const newUser = await signUp(data);
        setUser(newUser);
      }

      if (type === "sign-in") {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });

        if (response) {
          router.push("/");
        }
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section className="auth-form">
      {/* header will consist of the logo and the authentication header message ie sign in/up */}
      <header className="flex flex-col gap-4 max-xl:gap-4">
        <Link
          href="/"
          // flex to make the logo and title appear side by side
          className="mb-15 flex
                gap-2 items-center cursor-pointer"
        >
          <Image
            src="/icons/logo.svg"
            alt="FinHub logo"
            height={30}
            width={30}
            className="size-[40px]
                    lg:size-[50px]
                    "
          />
          <h1 className="sidebar-logo">FinHub</h1>
        </Link>

        <div className="flex flex-col">
          <h1 className="font-bold text-gray-900 text-24 lg:text-30 ">
            {user
              ? "Link Account "
              : type === "sign-in"
              ? "Sign In"
              : "Sign Up"}
          </h1>
          <p className="">
            {user ? "Please link your account" : "Please enter your details"}
          </p>
        </div>
      </header>
      {/* Here we check for bank account link */}
      {user ? (
        <div className="flex flex-col gap-4">{/* Plaid Bank Account */}</div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  {type === "sign-up" && (
                    <div className="flex flex-col gap-6">
                      <div className="flex gap-2">
                        <CustomInput
                          control={form.control}
                          fieldLabel={"First Name"}
                          fieldName={"firstName"}
                          fieldPlaceholder={"Enter your first name"}
                        />
                        <CustomInput
                          control={form.control}
                          fieldLabel={"Last Name"}
                          fieldName={"lastName"}
                          fieldPlaceholder={"Enter your last name"}
                        />
                      </div>
                      <CustomInput
                        control={form.control}
                        fieldLabel={"City"}
                        fieldName={"city"}
                        fieldPlaceholder={"Example: Indianapolis"}
                      />
                      <CustomInput
                        control={form.control}
                        fieldLabel={"Address"}
                        fieldName={"address1"}
                        fieldPlaceholder={"Example: 1234 broadway street"}
                      />
                      <div className="flex gap-2">
                        <CustomInput
                          control={form.control}
                          fieldLabel={"State"}
                          fieldName={"state"}
                          fieldPlaceholder={"Example: NY"}
                        />
                        <CustomInput
                          control={form.control}
                          fieldLabel={"Postal Code"}
                          fieldName={"postalCode"}
                          fieldPlaceholder={"Example: 11235"}
                        />
                      </div>
                      <div className="flex gap-2">
                        <CustomInput
                          control={form.control}
                          fieldLabel={"Date Of Birth"}
                          fieldName={"dateOfBirth"}
                          fieldPlaceholder={"DD/MM/YYYY"}
                        />
                        <CustomInput
                          control={form.control}
                          fieldLabel={"SSN"}
                          fieldName={"ssn"}
                          fieldPlaceholder={"Example: 1134"}
                        />
                      </div>
                    </div>
                  )}
                  <CustomInput
                    fieldLabel="Email"
                    fieldName="email"
                    fieldPlaceholder={"Enter your Email"}
                    control={form.control}
                  />
                  <CustomInput
                    control={form.control}
                    fieldLabel="Password"
                    fieldName="password"
                    fieldPlaceholder={"Enter your password"}
                  />
                  {/* on submit we display loading msg and disable button */}
                  <div className="flex flex-col gap-2 w-full">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="form-btn flex"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          &nbsp; Loading...
                        </>
                      ) : type === "sign-in" ? (
                        "Sign In"
                      ) : (
                        "Sign Up"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            }
          </div>
          <footer className="flex justify-center">
            <p>
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            &nbsp;
            <Link
              href={type === "sign-in" ? "/sign-up" : "sign-in"}
              className="text-blue-600"
            >
              {type === "sign-up" ? "Sign In" : "Sign Up"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
