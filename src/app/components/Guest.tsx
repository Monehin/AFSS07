import { SignInButton } from "@clerk/nextjs";

const Guest = () => {
  return (
    <div>
      <h1>Welcome</h1>
      <p>Please sign to connect</p>
      <SignInButton />
    </div>
  );
};

export default Guest;
