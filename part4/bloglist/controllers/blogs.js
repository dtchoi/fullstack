const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  /*Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })*/
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const result = await blog.save()
  response.status(201).json(result)
  /*
  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error => next(error)) */
  /*try {
    const result = await blog.save()
    response.status(201).json(result)
  }
  catch (exception) {
    next(exception)
  }*/
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { title, author, url, likes }, { new: true, runValidators: true, context: 'query' })
  response.json(updatedBlog)
})

module.exports = blogsRouter