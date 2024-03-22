import { FC, ReactNode } from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

interface GithubSigninButtonProps {
  children: ReactNode;
}
const GithubSigninButton: FC<GithubSigninButtonProps> = ({ children }) => {
  const loginWithGithub = () => {
    signIn('github')
  };

  return (
    <Button onClick={loginWithGithub} className="w-full">
      {children}
    </Button>
  );
};

export default GithubSigninButton;
