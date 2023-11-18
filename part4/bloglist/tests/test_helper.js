const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const initialUsers = async () => {
  const passwordHash = await bcrypt.hash(process.env.PASS, 10)
  const users = [
    {
      username: 'dtchoi',
      passwordHash: passwordHash
    },
    {
      username: 'mochi',
      passwordHash: passwordHash
    }
  ]
  return users
}

const initialBlogs = (userId) => {
  const blogs = [
    {
      title: 'Mexico City Travels',
      author: 'Daniel',
      url: 'http://localhost:3005/CMDX',
      likes: 5000,
      user: userId
    },
    {
      title: 'Phoenix Golf',
      author: 'Andy',
      url: 'http://localhost:3003/PHX',
      likes: 33,
      user: userId
    },
    {
      title: 'How To Get Zero Likes',
      author: 'Missing',
      url: 'http://localhost/zero',
      user: userId
    }
  ]
  return blogs
}

const initialBlogsLength = async () => {
  const blogs = initialBlogs()
  return blogs.length
}

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

const findFirstUserId = async () => {
  const user = await User.findOne({})
  return user._id.toString()
}

const tokenOfFirstUser = async () => {
  const user = await User.findOne({})
  const userForToken = {
    username: user.username,
    id: user._id.toString()
  }
  return jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60*60 })
}

module.exports = {
  initialUsers, initialBlogs, initialBlogsLength, nonExistingId, blogsInDb, findFirstUserId, tokenOfFirstUser
}