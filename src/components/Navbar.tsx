"use client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const Navbar = () => {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  );
};

const items = [
  { label: "Home", link: "/" },
  { label: "Gigs", link: "/gigs" },
  { label: "Events", link: "/events" },
  { label: "Pix", link: "/pix" },
  { label: "Pulse", link: "/pulse" },
  { label: "Donation", link: "/donation" },
  { label: "My Profile", link: "/profile" },
];

function DesktopNavbar() {
  return (
    <div className="hidden md:flex border-separate border-b bg-background">
      <nav className="flex w-full items-center justify-between px-8">
        <h2 className="text-lg font-extrabold">AFSS07</h2>

        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <div className="flex h-full">
            {items.map((item) => (
              <NavBarItems
                key={item.label}
                label={item.label}
                link={item.link}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </div>
        </div>
      </nav>
    </div>
  );
}

function NavBarItems({
  label,
  link,
  onClick,
}: {
  label: string;
  link: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <div className="relative flex items-center">
      <Link
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "w-full justify-start sm:text-sm md:text-base text-muted-foreground hover:text-foreground",
          isActive && "text-foreground"
        )}
        onClick={() => onClick && onClick()}
        href={link}
      >
        {label}
      </Link>
      {isActive && (
        <div className="absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl  bg-foreground md:block"></div>
      )}
    </div>
  );
}

function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size={"icon"}>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col sm:w-[540px]" side={"left"}>
            <SheetHeader>
              <SheetTitle>AFSS07</SheetTitle>
              <SheetDescription>Preseverance Breeds Success</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-1">
              {items.map((item) => (
                <NavBarItems
                  key={item.label}
                  label={item.label}
                  link={item.link}
                  onClick={() => setIsOpen(false)}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div>
                <SignedIn>
                  <UserButton />
                </SignedIn>
                <SignedOut>
                  <SignInButton />
                </SignedOut>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <h2 className="text-lg font-extrabold">AFSS07</h2>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
