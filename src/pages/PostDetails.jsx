import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../frebase-config";
import { getPostById, deletePostById, toggleLike } from "../services/posts";
import ImageViewer from "../components/ImageViewer";

export default function PostDetails({ isAuth }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletePostId, setDeletePostId] = useState(null);
  const [imageOpen, setImageOpen] = useState(false);

  useEffect(() => {
    const getPost = async () => {
      const data = await getPostById(id);
      if (data) {
        setPost(data);
      } else {
        navigate("/");
      }
      setLoading(false);
    };
    getPost();
  }, [id, navigate]);

  const handleLike = async () => {
    if (!isAuth) { navigate("/login"); return; }
    const userId = auth.currentUser?.uid;
    const hasLiked = post.likes?.includes(userId);
    await toggleLike(id, post.likes);
    if (hasLiked) {
      setPost({ ...post, likes: post.likes.filter(x => x !== userId), likesCount: (post.likesCount || 0) - 1 });
    } else {
      setPost({ ...post, likes: [...(post.likes || []), userId], likesCount: (post.likesCount || 0) + 1 });
    }
  };

  const confirmDelete = async () => {
    if (deletePostId) {
      try {
        await deletePostById(deletePostId);
        navigate("/");
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!post) return null;

  const hasLiked = post.likes?.includes(auth.currentUser?.uid);

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="w-full max-w-[80%] mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="btn btn-ghost gap-2 mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Posts
        </button>

        {/* Post Card */}
        <div className="card bg-base-100 shadow-2xl border border-base-300">
          {post.imageURL && (
            <figure>
              <img
                src={post.imageURL}
                alt={post.title}
                className="w-full max-h-96 object-cover cursor-zoom-in"
                onClick={() => setImageOpen(true)}
                title="Click to view full image"
              />
            </figure>
          )}

          <div className="card-body p-8 md:p-12">
            {/* Header with Title and Edit/Delete (author only) */}
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-4xl font-black text-base-content flex-1">
                {post.title}
              </h1>
              {auth.currentUser?.uid === post.authorId && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/post/${post.id}/edit`)}
                    className="btn btn-ghost btn-sm btn-circle text-info hover:bg-info/10"
                    title="Edit post"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712Z" />
                      <path d="M3.75 15.75 14.607 4.893l3.712 3.712L7.462 19.462a4.5 4.5 0 0 1-1.897 1.13l-3.087.88a.75.75 0 0 1-.926-.926l.88-3.087a4.5 4.5 0 0 1 1.318-2.419Z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeletePostId(post.id)}
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

            {/* Author Info */}
            <div 
              className="flex items-center gap-3 mb-6 pb-6 border-b border-base-300 cursor-pointer"
              onClick={() => navigate(`/profile/${post.authorId}`)}
              title={`View ${post.authorName}'s profile`}
            >
              {post.authorPhoto ? (
                <div className="avatar">
                  <div className="w-12 h-12 rounded-full ring-2 ring-primary ring-offset-2">
                    <img src={post.authorPhoto} alt={post.authorName} />
                  </div>
                </div>
              ) : (
                <div className="avatar placeholder">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-content ring-2 ring-primary ring-offset-2">
                    <span className="text-xl font-bold">{post.authorName?.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
              )}
              <div>
                <p className="font-bold text-lg text-base-content">{post.authorName}</p>
                <p className="text-sm text-base-content/60">
                  {post.createdAt?.toDate?.().toLocaleDateString() || "Recently"}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="prose max-w-none mb-8">
              <p className="text-base-content/80 text-lg leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>

            {/* Like Button */}
            <div className="flex items-center gap-4 pt-6 border-t border-base-300">
              <button
                onClick={handleLike}
                className={`btn gap-2 transition-all duration-300 ${
                  hasLiked ? "btn-primary" : "btn-outline btn-primary"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
                <span className="font-bold text-lg">{post.likesCount || 0} Likes</span>
              </button>
            </div>
          </div>
        </div>
      </div>

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
      {/* Fullscreen Image Viewer */}
      <ImageViewer
        src={post.imageURL}
        alt={post.title}
        open={imageOpen}
        onClose={() => setImageOpen(false)}
      />
    </div>
  );
}
