import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CreatPost from "./pages/CreatPost";
import PostDetails from "./pages/PostDetails";
import NotFound from "./pages/NotFound";
import ErrorPage from "./pages/ErrorPage";
import Nav from "./components/Nav";

function App() {
  const [isAuth, setIsAuth] = useState(
    localStorage.getItem("isAuth") === "true"
  );
  const [photoURL, setPhotoURL] = useState(
    localStorage.getItem("photoURL")
  );
  



  return (
    <Router>
      <Nav isAuth={isAuth} setIsAuth={setIsAuth} photoURL={photoURL} setPhotoURL={setPhotoURL} />
      <Routes>
        <Route path="/" element={<Home isAuth={isAuth} />} errorElement={<ErrorPage />} />
        <Route path="/login" element={<Login setIsAuth={setIsAuth} setPhotoURL={setPhotoURL} />} errorElement={<ErrorPage />} />
        <Route path="/create-post" element={<CreatPost isAuth={isAuth}/>} errorElement={<ErrorPage />} />
        <Route path="/post/:id" element={<PostDetails isAuth={isAuth}/>} errorElement={<ErrorPage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
