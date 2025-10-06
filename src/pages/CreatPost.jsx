import React, { useState , useEffect } from "react";
import { auth } from "../frebase-config";
import { useNavigate } from "react-router-dom";
import { uploadImageToImgBB } from "../services/storage";
import { createPost as createPostService } from "../services/posts";

export default function CreatPost({isAuth}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  let navigate = useNavigate();

  const uploadImage = async () => {
    if (!imageFile) return "";
    setUploading(true);
    try {
      const url = await uploadImageToImgBB(imageFile);
      setUploading(false);
      return url;
    } catch (err) {
      setUploading(false);
      setError("Failed to upload image: " + err.message);
      console.error("Image upload error:", err);
      return "";
    }
  };

  const handleCreatePost = async () => {
    // Validation
    if (!title.trim() || !content.trim()) {
      setError("Title and content cannot be empty!");
      return;
    }

    setError("");
    
    let uploadedImageURL = "";
    if (imageFile) {
      uploadedImageURL = await uploadImage();
    }

    await createPostService({ title, content, imageURL: uploadedImageURL });
    navigate("/");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Preview only
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="min-h-screen max-h-screen bg-gradient-to-br from-base-200 via-base-300 to-base-200 flex items-center justify-center px-4 overflow-y-auto">
      <div className="w-full max-w-2xl">
        <div className="bg-base-100 rounded-3xl shadow-2xl border-2 border-primary/20 p-8 md:p-12 relative overflow-hidden">
          {/* Decorative gradient background */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-accent"></div>

          {/* Header */}
          <div className="text-center mb-8 mt-4">
            <h1 className="text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight">
              CREATE POST
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary mx-auto mt-3 rounded-full"></div>
          </div>

          {/* Title Input */}
          <div className="mb-6">
            <label className="block mb-2">
              <span className="text-xl font-bold text-base-content flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                Title:
              </span>
            </label>
            <input
              type="text"
              placeholder="Title..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="input input-bordered input-lg w-full focus:input-primary focus:border-primary focus:shadow-lg focus:shadow-primary/20 transition-all duration-300 bg-base-100 hover:border-primary/50"
            />
          </div>

          {/* Content Textarea */}
          <div className="mb-6">
            <label className="block mb-2">
              <span className="text-xl font-bold text-base-content flex items-center gap-2">
                <span className="w-1.5 h-6 bg-secondary rounded-full"></span>
                Content:
              </span>
            </label>
            <div className="relative">
              <textarea
                placeholder="Post..."
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className="w-full px-4 py-3 text-base leading-relaxed border-2 border-base-300 rounded-2xl focus:border-secondary focus:ring-4 focus:ring-secondary/20 focus:shadow-lg focus:shadow-secondary/10 outline-none transition-all duration-300 resize-none placeholder:text-base-content/40 bg-base-100 h-48 hover:border-secondary/50"
                style={{
                  fontFamily:
                    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  lineHeight: "1.8",
                }}
              ></textarea>
              {/* Corner decoration */}
              <div className="absolute bottom-3 right-3 flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary/40"></div>
                <div className="w-2 h-2 rounded-full bg-secondary/40"></div>
                <div className="w-2 h-2 rounded-full bg-accent/40"></div>
              </div>
            </div>
          </div>

          {/* Image Upload (Optional) */}
          <div className="mb-6">
            <label className="block mb-2">
              <span className="text-xl font-bold text-base-content flex items-center gap-2">
                <span className="w-1.5 h-6 bg-accent rounded-full"></span>
                Image (Optional):
              </span>
            </label>
            <div className="flex flex-col gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input file-input-bordered file-input-primary w-full"
              />
              {imagePreview && (
                <div className="relative rounded-2xl overflow-hidden border-2 border-primary/20">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview("");
                    }}
                    className="absolute top-2 right-2 btn btn-circle btn-sm btn-error"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Post Button */}
          <div>
            <button
              onClick={handleCreatePost}
              disabled={uploading || !title.trim() || !content.trim()}
              className="btn btn-primary btn-lg w-full shadow-xl hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300 font-bold text-lg border-none bg-gradient-to-r from-primary to-secondary hover:from-primary hover:to-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Uploading...
                </>
              ) : (
                <>
                  Post
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* Bottom decorative bar */}
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent via-primary to-secondary opacity-50"></div>
        </div>
      </div>
    </div>
  );
}
