import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import Message from "../components/message";
import { BsFillTrashFill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import Link from "next/link";

export default function Dashboard() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  const getData = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };

  //delete post
  const deletePost = async (id) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  };

  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div className="my-10">
      <h1 className="text-xl font-medium">Your posts</h1>
      <div>
        {posts.map((post) => {
          return (
            <Message {...post} key={post.id}>
              <div className="flex px-12 gap-4">
                <button
                  onClick={() => deletePost(post.id)}
                  className="text-pink-600 flex items-center justify-center gap-2 py-1 text-sm"
                >
                  {" "}
                  <BsFillTrashFill />
                  delete
                </button>
                <Link href={{ pathname: "/post", query: post }}>
                  <button className="text-green-600 flex items-center justify-center gap-2 py-1 text-sm">
                    {" "}
                    <AiFillEdit></AiFillEdit>edit
                  </button>
                </Link>
              </div>
            </Message>
          );
        })}
      </div>

      <button
        onClick={() => auth.signOut()}
        className="font-medium bg-red-500 text-white py-2 px-4 rounded-md text-sm my-5"
      >
        Sign out
      </button>
    </div>
  );
}
