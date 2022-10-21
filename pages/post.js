import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

export default function Post() {
  //form state
  const [post, setPost] = useState({ description: "" });
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  const routeData = route.query;
  //submit post
  const submitPost = async (e) => {
    e.preventDefault();
    //post check for empty field
    if (!post.description) {
      toast.error("Your post is empty 📰", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }
    //post check for content overflow
    if (post.description.length > 200) {
      toast.error("Your post is too long ⏳", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }
    //update a post
    if (post?.hasOwnProperty("id")) {
      const docRef = doc(db, "posts", post.id);
      const updatedPost = { ...post, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatedPost);

      toast.success("Edited successfully 📝✅", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });

      return route.push("/");
    } else {
      //make a new post
      const collectionRef = collection(db, "posts");
      await addDoc(collectionRef, {
        ...post,
        timestamp: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL,
        username: user.displayName,
      });
      //post success message
      //post check
    }
    if (post.description && post.description.length < 200) {
      toast.success("Posted successfully 📬✅", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return route.push("/");
      setPost({ description: "" });
    }
  };

  //check user exists to edit the post
  const checkUser = async () => {
    if (loading) return;
    if (!user) route.push("/auth/login");
    if (routeData.id) {
      setPost({ description: routeData.description, id: routeData.id });
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading]);

  return (
    <div className="my-20 p-10 shadow-lg rounded-md max-w-md mx-auto">
      <form onSubmit={submitPost}>
        <h1 className="text-2xl font-medium">
          {post.hasOwnProperty("id") ? "Edit your post" : "Create your post"}
        </h1>
        <div className="py-2">
          <textarea
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            className="bg-gray-200 h-48 w-full text-black rounded-md p-2 text-sm border-none focus:outline-none"
          ></textarea>
          <p
            className={`text-emerald-500 font-medium text-sm ${
              post.description.length > 200 ? "text-red-600" : ""
            }`}
          >
            {post.description.length}/200
          </p>
        </div>
        <button
          type="submit"
          className="w-full font-medium bg-emerald-500 text-white py-2 px-4 rounded-md text-sm"
        >
          Post
        </button>
      </form>
    </div>
  );
}
