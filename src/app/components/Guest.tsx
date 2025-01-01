import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";

const Guest = () => {
  return (
    <div className="h-dvh  dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center  w-full ">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      <div className="flex  flex-col justify-center items-center gap-x-12">
        <div>
          <Image
            className="h-52 w-52  inset-0 object-cover"
            src="/AFSS07-logo.png"
            width={100}
            height={100}
            alt="AFSS07"
          />
        </div>
        <div className="flex flex-col gap-y-3 justify-center items-center">
          <h1 className="text-3xl">Welcome to AFSS07 </h1>
          <div>
            <p className="text-lg max-w-96 text-center ">
              Members of the AirForce Secondary School Ikeja Class of 2007
            </p>
          </div>
          <SignInButton>
            <Button className="w-fit px-12">Sign In</Button>
          </SignInButton>
        </div>
      </div>
    </div>
  );
};

export default Guest;

<div className="h-[50rem] w-full dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center">
  <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
</div>;
