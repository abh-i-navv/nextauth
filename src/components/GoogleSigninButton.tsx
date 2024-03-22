import { FC, ReactNode } from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

interface GoogleSigninButtonProps {
  children: ReactNode;
}
const GoogleSigninButton: FC<GoogleSigninButtonProps> = ({ children }) => {
  const loginWithGoogle = () => {
    console.log("login with google");
    signIn('google')
  };

  return (
    <Button onClick={loginWithGoogle} className="w-full">
      {children}
    </Button>
  );
};

export default GoogleSigninButton;
