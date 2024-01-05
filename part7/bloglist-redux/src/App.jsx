import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser, loginUser, logoutUser } from './reducers/userReducer'

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const blogFormRef = useRef();
  const blogRef = useRef();

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
  }, []);

  /*
  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
*/

  const handleLogin = async (event) => {
    event.preventDefault();
      dispatch(loginUser(username, password))
      setUsername("");
      setPassword("");

  };

  const handleLogout = async (event) => {
    event.preventDefault();
      dispatch(logoutUser())
      setUsername("");
      setPassword("");
  };

  const blogForm = () => (
    <div>
      <h2>blogs</h2>
      <Notification />
      <form onSubmit={handleLogout}>
        {user.name} logged in<button type="submit">logout</button>
      </form>
      <br />
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm />
      </Togglable>
      <div>
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
          />
        ))}
      </div>
    </div>
  );

  const loginForm = () => (
    <div>
      <h2>login to application</h2>
      <Notification />
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id="login-button" type="submit">
          login
        </button>
      </form>
    </div>
  );

  return (
    <div>
      {!user && loginForm()}
      {user && blogForm()}
    </div>
  );
};

export default App;
