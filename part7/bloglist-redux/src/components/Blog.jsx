import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { deleteBlog, updateBlog } from '../reducers/blogReducer'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };
  const showDelete = { display: user.username === blog.user.username ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const addLike = (event) => {
    event.preventDefault();
    const modifiedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    }
    dispatch(updateBlog(modifiedBlog));
  };

  const removeBlog = (event) => {
    event.preventDefault();
    if (window.confirm(`Remove ${blog.title} by ${blog.author}`)) {
      dispatch(deleteBlog(blog));
    }
  };

  return (
    <div className="blog" style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible} className="togglableContent">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>hide</button> <br />
        {blog.url} <br />
        likes {blog.likes}
        <button onClick={addLike}>like</button> <br />
        {blog.user.name} <br />
        <div style={showDelete} className="deleteContent">
          <button onClick={removeBlog}>delete</button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
