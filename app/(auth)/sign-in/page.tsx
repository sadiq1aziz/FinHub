import AuthForm from "@/components/ui/AuthForm";
import React from "react"


const SignIn = () => {
  // to ensure consistency we declare size full in this parent class
  return <section className="flex items-center justify-center size-full">
    <AuthForm
      type='sign-in'
     />
  </section>;
};

export default SignIn;
