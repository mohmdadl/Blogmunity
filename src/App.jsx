import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CreatPost from "./pages/CreatPost";
import PostDetails from "./pages/PostDetails";
import NotFound from "./pages/NotFound";
import ErrorPage from "./pages/ErrorPage";
import Nav from "./components/Nav";
import EditPost from "./pages/EditPost";
import { ThemeProvider } from "./context/ThemeContext";
import Profile from "./pages/Profile";
import Welcome from "./pages/Welcome";

function App() {
  const [isAuth, setIsAuth] = useState(
    localStorage.getItem("isAuth") === "true"
  );
  const [photoURL, setPhotoURL] = useState(
    localStorage.getItem("photoURL")
  );
  
  


  return (
    <ThemeProvider>
      <Router>
        <Nav 
          isAuth={isAuth} 
          setIsAuth={setIsAuth} 
          photoURL={photoURL} 
          setPhotoURL={setPhotoURL}
        />
        <Routes>
          <Route path="/" element={isAuth ? <Home isAuth={isAuth} /> : <Welcome />} errorElement={<ErrorPage />} />
          <Route path="/posts" element={<Home isAuth={isAuth} />} errorElement={<ErrorPage />} />
          <Route path="/login" element={<Login setIsAuth={setIsAuth} setPhotoURL={setPhotoURL} />} errorElement={<ErrorPage />} />
          <Route path="/create-post" element={<CreatPost isAuth={isAuth}/>} errorElement={<ErrorPage />} />
          <Route path="/post/:id" element={<PostDetails isAuth={isAuth}/>} errorElement={<ErrorPage />} />
          <Route path="/post/:id/edit" element={<EditPost isAuth={isAuth} />} errorElement={<ErrorPage />} />
          <Route path="/profile" element={<Profile />} errorElement={<ErrorPage />} />
          <Route path="/profile/:uid" element={<Profile />} errorElement={<ErrorPage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

