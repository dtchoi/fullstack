import { useState } from 'react'

const Blog = ({ blog, userName, updateBlog, deleteBlog }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  const showDelete = { display: userName === blog.user.username  ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const addLike = (event) => {
    event.preventDefault()
    const modifiedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
      id: blog.id
    }
    updateBlog(modifiedBlog)
  }

  const removeBlog = (event) => {
    event.preventDefault()
    if(window.confirm(`Remove ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog)
    }
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>hide</button> <br/>
        {blog.url} <br/>
        likes {blog.likes}<button onClick={addLike}>like</button> <br/>
        {blog.user.name} <br/>
        <div style={showDelete}>
          <button onClick={removeBlog}>delete</button>
        </div>

      </div>
    </div>
  )
}

export default Blog