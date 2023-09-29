const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
  /*
  api.get('/api/blogs').then(response => {
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })*/
})

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')

  const ids = response.body.map(b => b.id)
  expect(ids).toBeDefined()
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Best Snowboarding Resorts',
    author: 'Shawn White',
    url: 'http://localhost/shred',
    likes: 999
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).toContain('Best Snowboarding Resorts')
})

test('missing likes defaults to 0', async () => {
  const response = await api.get('/api/blogs')
  const likes = response.body.map(b => b.likes)
  expect(likes[2]).toEqual(0)
})

test('400 error if title or url missing', async () => {
  const newBlog = {
    author: 'Shawn White',
    url: 'http://localhost/shred',
    likes: 999
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
/*
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).toContain('Best Snowboarding Resorts')*/
})

afterAll(async () => {
  await mongoose.connection.close()
})