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

describe('when there are intially some blogs saved', () => {
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

  test('missing likes defaults to 0', async () => {
    const response = await api.get('/api/blogs')
    const likes = response.body.map(b => b.likes)
    expect(likes[2]).toEqual(0)
  })

  test('fails with statuscode 404 if note does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })

  describe('addition of a new blog', () => {
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
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

      const titles = blogsAtEnd.map(b => b.title)
      expect(titles).not.toContain(blogToDelete.title)
    })

    test('fails with statuscode 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .del(`/api/blogs/${invalidId}`)
        .expect(400)
    })
  })

  describe('update of a blog', () => {
    test('update all fields', async () => {
      const updatedBlog = {
        title: 'Denver Music',
        author: 'Brandon',
        url: 'http://localhost:3005/DEN',
        likes: 1
      }

      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const titles = blogsAtEnd.map(b => b.title)
      const authors = blogsAtEnd.map(b => b.author)
      const urls = blogsAtEnd.map(b => b.url)
      const likes = blogsAtEnd.map(b => b.likes)
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
      expect(titles).toContain('Denver Music')
      expect(authors).toContain('Brandon')
      expect(urls).toContain('http://localhost:3005/DEN')
      expect(likes).toContain(1)
    })

    test('update only likes', async () => {
      const updatedBlog = {
        likes: 11
      }

      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const likes = blogsAtEnd.map(b => b.likes)
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
      expect(likes).toContain(11)
    })

    test('fails with statuscode 400 if id is invalid', async () => {
      const updatedBlog = {
        likes: 11
      }
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .put(`/api/blogs/${invalidId}`)
        .send(updatedBlog)
        .expect(400)
    })
  })
})



afterAll(async () => {
  await mongoose.connection.close()
})