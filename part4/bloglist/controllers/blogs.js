const blogsRouter = require('express').Router()
const { nextTick } = require('process')
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

module.exports = blogsRouter