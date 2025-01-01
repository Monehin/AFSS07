import { currentUser } from "@clerk/nextjs/server";
import Guest from "./components/Guest";
import Home from "./components/Home";

export default async function Page() {
  const user = await currentUser();

  if (!user) {
    return <Guest />;
  }
  return (
    <div className=" gap-y-12">
      <h1 className="my-12  text-2xl">Welcome {user.firstName}</h1>
      <Home />
    </div>
  );
}
