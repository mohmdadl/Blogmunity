import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, auth } from "../frebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditPost({ isAuth }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageURL, setImageURL] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, [isAuth, navigate]);

  // Load post and verify owner
  useEffect(() => {
    const loadPost = async () => {
      try {
        const postRef = doc(db, "posts", id);
        const snap = await getDoc(postRef);
        if (!snap.exists()) {
          navigate("/");
          return;
        }
        const data = snap.data();
        // Ownership check
        const currentUid = auth.currentUser?.uid;
        if (!currentUid || currentUid !== data.authorId) {
          navigate(`/post/${id}`);
          return;
        }

        setTitle(data.title || "");
        setContent(data.content || "");
        setImageURL(data.imageURL || "");
        setImagePreview(data.imageURL || "");
      } catch (e) {
        console.error(e);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!imageFile) return imageURL; // no change

    setUploading(true);
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=5708d1b89a823acd41e8913fa44f24cc`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      setUploading(false);
      if (data.success) {
        return data.data.url;
      } else {
        setError("Failed to upload image to ImgBB");
        return imageURL; // fallback to old image
      }
    } catch (err) {
      setUploading(false);
      setError("Failed to upload image: " + err.message);
      console.error("Image upload error:", err);
      return imageURL;
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content cannot be empty!");
      return;
    }

    setError("");

    const newImageURL = await uploadImage();

    try {
      const postRef = doc(db, "posts", id);
      await updateDoc(postRef, {
        title: title.trim(),
        content: content.trim(),
        imageURL: newImageURL || "",
      });
      navigate(`/post/${id}`);
    } catch (e) {
      console.error(e);
      setError("Failed to save changes");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-h-screen bg-gradient-to-br from-base-200 via-base-300 to-base-200 flex items-center justify-center px-4 overflow-y-auto">
      <div className="w-full max-w-2xl">
        <div className="bg-base-100 rounded-3xl shadow-2xl border-2 border-primary/20 p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-accent"></div>

          <div className="text-center mb-8 mt-4">
            <h1 className="text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight">
              EDIT POST
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary mx-auto mt-3 rounded-full"></div>
          </div>

          {error && (
            <div className="alert alert-error mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

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
              onChange={(e) => setTitle(e.target.value)}
              className="input input-bordered input-lg w-full focus:input-primary focus:border-primary focus:shadow-lg focus:shadow-primary/20 transition-all duration-300 bg-base-100 hover:border-primary/50"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2">
              <span className="text-xl font-bold text-base-content flex items-center gap-2">
                <span className="w-1.5 h-6 bg-secondary rounded-full"></span>
                Content:
              </span>
            </label>
            <textarea
              placeholder="Post..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 text-base leading-relaxed border-2 border-base-300 rounded-2xl focus:border-secondary focus:ring-4 focus:ring-secondary/20 focus:shadow-lg focus:shadow-secondary/10 outline-none transition-all duration-300 resize-none placeholder:text-base-content/40 bg-base-100 h-48 hover:border-secondary/50"
              style={{
                fontFamily:
                  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                lineHeight: "1.8",
              }}
            />
          </div>

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
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                  <button
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview("");
                      setImageURL("");
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

          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/post/${id}`)}
              className="btn btn-ghost w-1/3"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={uploading || !title.trim() || !content.trim()}
              className="btn btn-primary w-2/3 shadow-xl hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300 font-bold text-lg border-none bg-gradient-to-r from-primary to-secondary hover:from-primary hover:to-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Saving...
                </>
              ) : (
                <>Save Changes</>
              )}
            </button>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent via-primary to-secondary opacity-50"></div>
        </div>
      </div>
    </div>
  );
}
