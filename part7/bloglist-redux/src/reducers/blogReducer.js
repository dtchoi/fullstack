import { createSlice, current } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setNotification } from '../reducers/notificationReducer'
import { successChange } from '../reducers/successReducer'
import { useSelector } from 'react-redux'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    removeBlog(state, action) {
      state.splice(state.findIndex((blog) => blog === action.payload), 1)
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    updateLike(state, action) {
      return state.map((blog) =>
          blog.id === action.payload.id
            ? { ...blog, likes: action.payload.likes }
            : blog,
        )
    },
    setBlogs(state, action) {
      return action.payload
    }
  }
})

export const { removeBlog, appendBlog, updateLike, setBlogs } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs.sort((a, b) => b.likes - a.likes)))
  }
}

export const deleteBlog = blogObject => {
  return async dispatch => {
    try {
      await blogService.deleteBlog(blogObject.id);
      dispatch(removeBlog(blogObject));
      dispatch(successChange(true));
      dispatch(setNotification(`${blogObject.title} deleted`, 5));
    } catch (exception) {
      dispatch(successChange(false));
      dispatch(setNotification(exception.message, 5));
    }
  }
};

export const createBlog = (blogObject, user) => {
  return async dispatch => {
    try {
      const returnedBlog = await blogService.create(blogObject);
      const newBlogObject = {
        ...blogObject,
        id: returnedBlog.id,
        likes: 0,
        user: { name: user.name, username: user.username },
      };
      dispatch(successChange(true));
      dispatch(setNotification(`a new blog ${blogObject.title} added`, 5));
      dispatch(appendBlog(newBlogObject));
    } catch (exception) {
      dispatch(successChange(false));
      dispatch(setNotification(exception.message, 5));
    }
  }
};

export const updateBlog = (blogObject) => {
  return async dispatch => {
    try {
      const returnedBlog = await blogService.update(blogObject);
      dispatch(updateLike(returnedBlog));
    } catch (exception) {
      dispatch(successChange(false))
      dispatch(setNotification(exception.message, 5));
    }
  }
};

export default blogSlice.reducer