import Message from "../components/message";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { toast } from "react-toastify";
import { async } from "@firebase/util";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";

export default function Details() {
  const router = useRouter();
  const routeData = router.query;
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  //submit a message
  const submitComment = async () => {
    //check if user is logged in
    if (!auth.currentUser) return router.push("/auth/login");
    if (!message) {
      toast.error("Please add a comment 😰", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }
    const docRef = doc(db, "posts", routeData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        username: auth.currentUser.displayName,
        time: Timestamp.now(),
      }),
    });
    setMessage("");
  };

  //Get comments
  const getComments = async () => {
    const docRef = doc(db, "posts", routeData.id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setAllMessages(snapshot.data().comments);
    });
    return unsubscribe;
  };

  useEffect(() => {
    if (!router.isReady) return;
    getComments();
  }, [router.isReady]);
  return (
    <div>
      <Message {...routeData}></Message>
      <div className="my-2">
        <div className="flex gap-2">
          <input
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            value={message}
            placeholder="Add a comment 💬"
            className="bg-gray-100 w-full p-2 text-black text-sm rounded-sm"
          />
          <button
            onClick={submitComment}
            className="font-medium bg-emerald-500 text-white py-2 px-2 rounded-md text-sm"
          >
            Comment
          </button>
        </div>
        <div className="py-6">
          <h2 className="font-bold">Comments</h2>
          {allMessages?.map((message) => (
            <div className="bg-white p-4 my-2 border-2" key={message.time}>
              <div className="flex items-center gap-2 mb-2">
                <Image
                  className="w-8 rounded-full"
                  src={message.avatar}
                  alt="userImage"
                />
                <h2 className="text-xs font-medium">{message.username}</h2>
              </div>
              <h2 className="px-10 text-sm text-gray-700">{message.message}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
