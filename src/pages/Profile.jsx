import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../frebase-config";
import { getPostsByAuthorId } from "../services/posts";

export default function Profile() {
  const { uid } = useParams();
  const navigate = useNavigate();

  const [userUid, setUserUid] = useState(null);
  const [userName, setUserName] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const init = async () => {
      // Determine target UID
      let targetUid = uid || auth.currentUser?.uid;
      if (!targetUid) {
        navigate("/login");
        return;
      }
      setUserUid(targetUid);

      // If viewing self, take from auth; otherwise fallback to first post metadata
      if (uid && auth.currentUser?.uid !== uid) {
        // We'll resolve name/photo from the posts later
      } else {
        setUserName(auth.currentUser?.displayName || "User");
        setUserPhoto(auth.currentUser?.photoURL || "");
      }

      // Load posts of this author
      try {
        const items = await getPostsByAuthorId(targetUid);
        setPosts(items);

        // If viewing others, infer name/photo from first post
        if (uid && (!userName || !userPhoto)) {
          const first = items[0];
          if (first) {
            setUserName(first.authorName || "User");
            setUserPhoto(first.authorPhoto || "");
          }
        }
      } catch (e) {
        console.error("Failed to load user's posts", e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [uid, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="w-full max-w-[80%] mx-auto">
        {/* Profile header */}
        <div className="card bg-base-100 shadow-xl border border-base-300 mb-8">
          <div className="card-body flex flex-col md:flex-row items-center gap-6">
            <div className="avatar">
              <div className="w-24 h-24 rounded-full ring-2 ring-primary ring-offset-2">
                {userPhoto ? (
                  <img src={userPhoto} alt={userName} />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary text-primary-content flex items-center justify-center text-3xl font-bold">
                    {userName?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-black text-base-content">{userName || "User"}</h1>
              <p className="text-base-content/60 mt-1">Posts: {posts.length}</p>
              {auth.currentUser?.uid === userUid && (
                <div className="mt-4">
                  <button onClick={() => navigate("/create-post")} className="btn btn-primary">
                    Create new post
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Posts list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              onClick={() => navigate(`/post/${post.id}`)}
            >
              {post.imageURL && (
                <figure>
                  <img src={post.imageURL} alt={post.title} className="w-full h-48 object-cover" />
                </figure>
              )}
              <div className="card-body">
                <h2 className="card-title text-base-content line-clamp-2">{post.title}</h2>
                <p className="text-base-content/70 line-clamp-3">{post.content}</p>
                <div className="text-xs text-base-content/50 mt-2">
                  {post.createdAt?.toDate?.().toLocaleDateString() || "Recently"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-base-content/70 mb-2">No posts yet</h3>
            {auth.currentUser?.uid === userUid && (
              <button onClick={() => navigate("/create-post")} className="btn btn-primary">
                Write your first post
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
