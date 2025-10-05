import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, provider } from "../frebase-config";
import React from "react";

function Nav({ isAuth, setIsAuth, photoURL, setPhotoURL }) {
    
  let navigate = useNavigate();

  const logout = () => {
    signOut(auth)
      .then(() => {
        localStorage.clear();
        setIsAuth(false);
        setPhotoURL(null);
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  return (
    <nav>
      <div className="navbar bg-neutral shadow-sm py-4 text-white">
        <div className="flex-1"></div>

        <div className="navbar-center">
          <Link
            to="/"
            className="btn btn-ghost text-xl text-white hover:bg-neutral-focus"
          >
            Blogmunity
          </Link>
        </div>

        {isAuth ? (
          <div className="flex-1 flex justify-end">
            <div className="dropdown dropdown-end mr-12">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="User Avatar"
                    src={
                      photoURL
                       ||
                      "https://i.pinimg.com/1200x/c6/0e/a0/c60ea00b55471c5a57ce5109dcd2f7df.jpg"
                    }
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link
                    to="/profile"
                    className="justify-between text-base-content hover:bg-base-200"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    className="text-base-content hover:bg-base-200"
                  >
                    Settings
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="text-base-content w-full text-left hover:bg-base-200"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex justify-end">
            <Link
              to="/login"
              className="btn btn-ghost text-white mr-12 hover:bg-neutral-focus"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Nav;
