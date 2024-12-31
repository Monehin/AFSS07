import { currentUser } from "@clerk/nextjs/server";
import Guest from "./components/Guest";

export default async function Home() {
  const user = await currentUser();

  if (!user) {
    return <Guest />;
  }
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>Welcome {user.firstName}</h1>
    </div>
  );
}
