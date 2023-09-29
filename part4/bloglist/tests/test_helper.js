const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Mexico City Travels',
    author: 'Daniel',
    url: 'http://localhost:3005/CMDX',
    likes: 5000
  },
  {
    title: 'Phoenix Golf',
    author: 'Andy',
    url: 'http://localhost:3003/PHX',
    likes: 33
  },
  {
    title: 'How To Get Zero Likes',
    author: 'Missing',
    url: 'http://localhost/zero'
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'will remove soon', url: 'remove' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}