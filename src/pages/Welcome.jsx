import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-base-200">
      <section className="hero py-16">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome to Blogmunity
            </h1>
            <p className="py-6 text-base-content/70">
              Share your thoughts, discover posts from the community, and connect with others.
              Sign in with Google to start creating and interacting.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate("/login")}
              >
                Continue with Google
              </button>
              <Link to="/posts" className="btn btn-outline btn-lg">
                Explore Posts
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Create & Share</h3>
            <p>Publish posts with images and formatting to share your ideas.</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Like & Discuss</h3>
            <p>Like posts you enjoy and engage with the community.</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Your Profile</h3>
            <p>Keep track of your posts and personalize your profile.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
