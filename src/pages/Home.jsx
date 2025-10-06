import React, { useState, useEffect } from "react";
import { getDocs, collection, doc, updateDoc, deleteDoc, arrayUnion, arrayRemove, increment } from "firebase/firestore";
import { db, auth } from "../frebase-config";
import { useNavigate } from "react-router-dom";

export default function Home({ isAuth }) {
  const [posts, setPosts] = useState([]);
  const [deletePostId, setDeletePostId] = useState(null);
  const navigate = useNavigate();

  const postsCollectionRef = collection(db, "posts");

  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postsCollectionRef);
      setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getPosts();
  }, []);

  const handleLike = async (postId, likes) => {
    const postRef = doc(db, "posts", postId);
    const userId = auth.currentUser?.uid;

    if (!userId) {
      navigate("/login");
      return;
    }

    const hasLiked = likes?.includes(userId);

    if (hasLiked) {
      // إزالة الإعجاب
      await updateDoc(postRef, {
        likes: arrayRemove(userId),
        likesCount: increment(-1),
      });
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes.filter(id => id !== userId), likesCount: post.likesCount - 1 }
          : post
      ));
    } else {
      // إضافة الإعجاب
      await updateDoc(postRef, {
        likes: arrayUnion(userId),
        likesCount: increment(1),
      });
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: [...(post.likes || []), userId], likesCount: (post.likesCount || 0) + 1 }
          : post
      ));
    }
  };

  const confirmDelete = async () => {
    if (deletePostId) {
      try {
        const postRef = doc(db, "posts", deletePostId);
        await deleteDoc(postRef);
        setPosts(posts.filter(post => post.id !== deletePostId));
        setDeletePostId(null);
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4 relative">
      <div className="w-full max-w-[80%] mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Blogmunity Posts
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-primary to-secondary mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const hasLiked = post.likes?.includes(auth.currentUser?.uid);
            
            return (
              <div key={post.id} className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>
                {post.imageURL && (
                  <figure>
                    <img
                      src={post.imageURL}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  </figure>
                )}
                <div className="card-body">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="card-title text-2xl font-bold text-neutral line-clamp-2 flex-1">
                      {post.title}
                    </h2>
                    {auth.currentUser?.uid === post.authorId && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/post/${post.id}/edit`);
                          }}
                          className="btn btn-ghost btn-sm btn-circle text-info hover:bg-info/10"
                          title="Edit post"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712Z" />
                            <path d="M3.75 15.75 14.607 4.893l3.712 3.712L7.462 19.462a4.5 4.5 0 0 1-1.897 1.13l-3.087.88a.75.75 0 0 1-.926-.926l.88-3.087a4.5 4.5 0 0 1 1.318-2.419Z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletePostId(post.id);
                          }}
                          className="btn btn-ghost btn-sm btn-circle text-error hover:bg-error/10"
                          title="Delete post"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-base-content/70 line-clamp-3 my-3">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-base-content/60 mb-3">
                    {post.authorPhoto ? (
                      <div className="avatar">
                        <div className="w-6 h-6 rounded-full ring-1 ring-primary ring-offset-1">
                          <img
                            src={post.authorPhoto}
                            alt={post.authorName}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="avatar placeholder">
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-content ring-1 ring-primary ring-offset-1">
                          <span className="text-xs font-bold">{post.authorName?.charAt(0).toUpperCase()}</span>
                        </div>
                      </div>
                    )}
                    <span className="font-medium">{post.authorName}</span>
                  </div>

                  <div className="card-actions justify-between items-center mt-4 border-t border-base-300 pt-4">
                    <div className="flex items-center gap-2">
                      {isAuth ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(post.id, post.likes);
                          }}
                          className={`btn btn-circle btn-sm transition-all duration-300 ${
                            hasLiked 
                              ? "btn-primary text-white" 
                              : "btn-ghost hover:btn-primary"
                          }`}
                        >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill={hasLiked ? "currentColor" : "none"}
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                          />
                        </svg>
                      </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/login");
                          }}
                          className="btn btn-outline btn-sm gap-2"
                          title="Login to like"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                            />
                          </svg>
                          <span className="text-xs">Login to like</span>
                        </button>
                      )}
                      <span className="font-bold text-lg">{post.likesCount || 0}</span>
                    </div>

                    <div className="text-xs text-base-content/50">
                      {post.createdAt?.toDate?.().toLocaleDateString() || "Recently"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-20">
            <svg className="w-24 h-24 mx-auto text-base-content/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h3 className="text-2xl font-bold text-base-content/50 mb-2">No Posts Yet</h3>
            <p className="text-base-content/40">Be the first to create a post!</p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      {isAuth && (
        <button
          onClick={() => navigate("/create-post")}
          className="fixed bottom-8 right-8 btn btn-primary btn-circle btn-lg shadow-2xl hover:shadow-primary/50 hover:scale-110 transition-all duration-300 z-50"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      {/* Delete Confirmation Modal */}
      {deletePostId && (
        <div className="modal modal-open">
          <div className="modal-box border-2 border-error/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-error/10 rounded-full">
                <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-xl text-base-content">Delete Post</h3>
                <p className="text-sm text-base-content/60">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-base-content/80 mb-6">
              Are you sure you want to delete this post? This will permanently remove the post and all its data.
            </p>
            
            <div className="modal-action">
              <button 
                onClick={() => setDeletePostId(null)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="btn btn-error gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                Delete
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setDeletePostId(null)}></div>
        </div>
      )}
    </div>
  );
}
