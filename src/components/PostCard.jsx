import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../frebase-config";

export default function PostCard({ post, onLike, onDelete, onEdit }) {
  const navigate = useNavigate();
  const hasLiked = post.likes?.includes(auth.currentUser?.uid);
  const isAuthor = auth.currentUser?.uid === post.authorId;

  return (
    <div
      className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      onClick={() => navigate(`/post/${post.id}`)}
    >
      {post.imageURL && (
        <figure>
          <img src={post.imageURL} alt={post.title} className="w-full h-48 object-cover" />
        </figure>
      )}
      <div className="card-body">
        <div className="flex justify-between items-start mb-2">
          <h2 className="card-title text-2xl font-bold text-base-content line-clamp-2 flex-1">
            {post.title}
          </h2>
          {isAuthor && (
            <div className="flex items-center gap-1">
              {onEdit && (
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(post.id); }}
                  className="btn btn-ghost btn-sm btn-circle text-info hover:bg-info/10"
                  title="Edit post"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712Z" />
                    <path d="M3.75 15.75 14.607 4.893l3.712 3.712L7.462 19.462a4.5 4.5 0 0 1-1.897 1.13l-3.087.88a.75.75 0 0 1-.926-.926l.88-3.087a4.5 4.5 0 0 1 1.318-2.419Z" />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(post.id); }}
                  className="btn btn-ghost btn-sm btn-circle text-error hover:bg-error/10"
                  title="Delete post"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        <p className="text-base-content/70 line-clamp-3 my-3">{post.content}</p>

        <div
          className="flex items-center gap-2 text-sm text-base-content/60 mb-3"
          onClick={(e) => { e.stopPropagation(); navigate(`/profile/${post.authorId}`); }}
          role="button"
          title={`View ${post.authorName}'s profile`}
        >
          {post.authorPhoto ? (
            <div className="avatar">
              <div className="w-6 h-6 rounded-full ring-1 ring-primary ring-offset-1">
                <img src={post.authorPhoto} alt={post.authorName} />
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

        <div className="card-actions justify-between items-center mt-4 border-top border-base-300 pt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onLike && onLike(post.id, post.likes); }}
              className={`btn btn-circle btn-sm transition-all duration-300 ${
                hasLiked ? "btn-primary text-white" : "btn-ghost hover:btn-primary"
              }`}
              title={hasLiked ? "Unlike" : "Like"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={hasLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </button>
            <span className="font-bold text-lg">{post.likesCount || 0}</span>
          </div>
          <div className="text-xs text-base-content/50">
            {post.createdAt?.toDate?.().toLocaleDateString() || "Recently"}
          </div>
        </div>
      </div>
    </div>
  );
}
