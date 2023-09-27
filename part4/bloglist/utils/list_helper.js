const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogList) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogList.length === 0
    ? 0
    : blogList.reduce(reducer, 0)
}

const favoriteBlog = (blogList) => {
  const reducer = (favorite, blog) => {
    const strippedBlog = {
      title: blog.title,
      author: blog.author,
      likes: blog.likes
    }
    if(favorite.likes > strippedBlog.likes) {
      return favorite
    } else {
      return strippedBlog
    }
  }

  const zeroBlog = {
    title: '',
    author: '',
    likes: 0
  }

  return blogList.length === 0
    ? {}
    : blogList.reduce(reducer, zeroBlog)
}

const mostBlogs = (blogList) => {
  if (blogList.length > 0) {
    const result = lodash(blogList).countBy('author').map((value, key) => ({
      'author': key,
      'blogs': value
    })).maxBy('blogs')
    return result
  }
  return {}
}

const mostLikes = (blogList) => {
  if (blogList.length > 0) {
    const result = lodash(blogList).groupBy('author').map((objs, key) => ({
      'author': key,
      'likes': lodash.sumBy(objs, 'likes')
    })).maxBy('likes')
    return result
  }
  return {}
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}