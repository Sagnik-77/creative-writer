import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";

export default function Nav() {
  const [user, loading] = useAuthState(auth);

  return (
    <nav className="flex justify-between items-center py-10">
      <Link href="/">
        <button className="text-lg font-m">Creative Writers</button>
      </Link>
      <ul className="flex items-center gap-10">
        {!user && (
          <Link href={"/auth/login"}>
            <a className="py-2 px-4 text-sm bg-emerald-500 text-white rounded-md font-medium ml-8">
              Join Now
            </a>
          </Link>
        )}
        {user && (
          <div className="flex items-center gap-6">
            <Link href="/post">
              <button className="font-medium bg-emerald-500 text-white py-2 px-4 rounded-md text-sm">
                Create
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="font-medium bg-emerald-500 text-white py-2 px-4 rounded-md text-sm">
                Dashboard
              </button>
            </Link>
            <Image
              className="w-10 rounded-full cursor-pointer"
              src={user.photoURL}
              referrerPolicy="no-referrer"
              alt="userImage"
            />
          </div>
        )}
      </ul>
    </nav>
  );
}
