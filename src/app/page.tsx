import { checkUser } from "@/lib/checkUser";
import Guest from "./components/Guest";
import Home from "./components/Home";

export default async function Page() {
  const user = await checkUser();

  if (!user) {
    return <Guest />;
  }
  return (
    <div className=" gap-y-12 mx-12">
      <h1 className="my-12  text-2xl">Welcome {user.name}</h1>
      <Home />
    </div>
  );
}
