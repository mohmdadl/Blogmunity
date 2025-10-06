import { db, auth } from "../frebase-config";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";

const postsRef = collection(db, "posts");

export async function getAllPosts() {
  const snap = await getDocs(postsRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getPostById(id) {
  const ref = doc(db, "posts", id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getPostsByAuthorId(authorId) {
  const q = query(postsRef, where("authorId", "==", authorId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createPost({ title, content, imageURL }) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  const newPost = {
    title,
    content,
    imageURL: imageURL || "",
    authorName: user.displayName,
    authorId: user.uid,
    authorPhoto: user.photoURL || "",
    likes: [],
    likesCount: 0,
    createdAt: new Date(),
  };
  const added = await addDoc(postsRef, newPost);
  return { id: added.id, ...newPost };
}

export async function updatePost(id, updates) {
  const ref = doc(db, "posts", id);
  await updateDoc(ref, updates);
}

export async function deletePostById(id) {
  const ref = doc(db, "posts", id);
  await deleteDoc(ref);
}

export async function toggleLike(postId, currentLikes = []) {
  const ref = doc(db, "posts", postId);
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("Not authenticated");
  const hasLiked = currentLikes?.includes(userId);
  if (hasLiked) {
    await updateDoc(ref, { likes: arrayRemove(userId), likesCount: increment(-1) });
    return { action: "unlike", userId };
  } else {
    await updateDoc(ref, { likes: arrayUnion(userId), likesCount: increment(1) });
    return { action: "like", userId };
  }
}
