import React from "react";
import { useNavigate } from "react-router-dom";

export default function ErrorPage({ error }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-error/5 via-base-200 to-error/5 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-error/10 mb-6">
            <svg className="w-20 h-20 text-error animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-5xl font-black text-error mb-4">Oops! Something Went Wrong</h1>
          <p className="text-lg text-base-content/70 mb-4">
            We encountered an unexpected error while processing your request.
          </p>
          
          {error && (
            <div className="bg-error/10 border-l-4 border-error rounded-lg p-4 my-6 text-left max-w-lg mx-auto">
              <p className="font-mono text-sm text-error mb-1">
                <span className="font-bold">Error:</span> {error.statusText || error.message || "Unknown error"}
              </p>
              {error.status && (
                <p className="font-mono text-xs text-error/70">
                  Status Code: {error.status}
                </p>
              )}
            </div>
          )}
          
          <p className="text-sm text-base-content/60">
            Don't worry, our team has been notified and we're working to fix it.
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-8 flex justify-center">
          <svg className="w-64 h-64 text-base-content/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={() => window.location.reload()}
            className="btn btn-outline btn-lg gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Page
          </button>
          <button
            onClick={() => navigate("/")}
            className="btn btn-primary btn-lg gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </button>
        </div>

        {/* Help Section */}
        <div className="pt-8 border-t border-base-300">
          <p className="text-sm text-base-content/60 mb-4">Still having trouble?</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => navigate(-1)} className="badge badge-lg badge-outline gap-1 cursor-pointer hover:badge-primary transition-colors">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go Back
            </button>
            <button onClick={() => navigate("/create-post")} className="badge badge-lg badge-outline gap-1 cursor-pointer hover:badge-primary transition-colors">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Create Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
