import Navbar from "@/components/Navbar";
import { ModalProvider } from "@/components/ui/animated-modal";
import { checkUser } from "@/lib/checkUser";
import { ProfileUpdateModal } from "./modals/ProfileUpdateModal";
const Header = async () => {
  const user = await checkUser();

  if (!user) {
    return null;
  }

  if (user && !user?.verified) {
    return (
      <ModalProvider>
        <ProfileUpdateModal />
      </ModalProvider>
    );
  }

  return <Navbar />;
};

export default Header;
