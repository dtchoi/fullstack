import { useState } from "react";
import { createBlog } from '../reducers/blogReducer'
import { useDispatch, useSelector } from 'react-redux'

const BlogForm = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();
    dispatch(createBlog({
      title: title,
      author: author,
      url: url,
    }, user));
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={addBlog}>
        <div>
          title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            id="title"
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            id="author"
          />
        </div>
        <div>
          url
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            id="url"
          />
        </div>
        <button id="create-button" type="submit">
          create
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
