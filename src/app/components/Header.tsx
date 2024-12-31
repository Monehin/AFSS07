import { ModalProvider } from "@/components/ui/animated-modal";
import { checkUser } from "@/lib/checkUser";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "./ThemeToggle";
import { ProfileUpdateModal } from "./modals/ProfileUpdateModal";
const Header = async () => {
  const user = await checkUser();

  if (user && !user?.verified) {
    return (
      <ModalProvider>
        <ProfileUpdateModal />
      </ModalProvider>
    );
  }

  return (
    <nav className="flex justify-between items-center mx-8 h-16">
      <div className="navbar-container">
        <h2>AFSS 2007</h2>
      </div>
      <ul className="flex gap-x-8">
        <li>Home</li>
        <li>Members</li>
        <li>Events</li>
        <li>Forum</li>
      </ul>
      <div className="flex items-center gap-x-8">
        <div>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Header;
