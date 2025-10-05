import React from "react";
import { auth, provider } from "../frebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login(props) {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        localStorage.setItem("isAuth", true);
        localStorage.setItem("photoURL", result.user.photoURL); 
        props.setIsAuth(true);
        props.setPhotoURL(result.user.photoURL);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="w-full max-w-[80%] flex items-center justify-center">
        <div className="card w-full max-w-md bg-base-100 shadow-2xl p-8 md:p-10 border border-base-300 rounded-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-neutral mb-2 tracking-tight">
              Blogmunity
            </h1>
            <div className="h-1 bg-primary mx-auto rounded-full mb-4 w-24"></div>
            <p className="text-md text-base-content/70">
              Join the community using your Google account.
            </p>
          </div>

          <button
            onClick={signInWithGoogle}
            className="btn btn-lg w-full flex items-center justify-center space-x-4 font-bold border-2 border-base-300 bg-base-100 hover:bg-base-200 hover:border-primary shadow-lg transition-all duration-300 rounded-xl"
          >
          <svg
            className="w-6 h-6"
            viewBox="-3 0 262 262"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid"
          >
            <path
              d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
              fill="#4285F4"
            />
            <path
              d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
              fill="#34A853"
            />
            <path
              d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
              fill="#FBBC05"
            />
            <path
              d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
              fill="#EB4335"
            />
          </svg>

            <span className="text-base-content">Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}
