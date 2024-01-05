import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author', async () => {
  const blog = {
    title: 'How To Render Title and Author Only',
    author: 'Brian Logger',
    url: 'http://blog/url',
    likes: 99999,
    user: 'dchoi',
    id: '1234567890'
  }

  const container = render(
    <Blog blog={blog} userName='dchoi' />
  ).container

  const div = container.querySelector('.togglableContent')
  expect(div).toHaveStyle('display: none')
  screen.debug()
})

test('after clicking the button, url and likes are displayed', async () => {
  const blog = {
    title: 'How To Render Title and Author Only',
    author: 'Brian Logger',
    url: 'http://blog/url',
    likes: 99999,
    user: 'dchoi',
    id: '1234567890'
  }

  const container = render(
    <Blog blog={blog} userName='dchoi' />
  ).container

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const div = container.querySelector('.togglableContent')
  expect(div).not.toHaveStyle('display: none')
  screen.debug()
})

test('clicking the like button calls event handler twice', async () => {
  const blog = {
    title: 'How To Render Title and Author Only',
    author: 'Brian Logger',
    url: 'http://blog/url',
    likes: 99999,
    user: 'dchoi',
    id: '1234567890'
  }

  const mockHandler = jest.fn()

  const container = render(
    <Blog blog={blog} userName='dchoi' updateBlog={mockHandler} />
  ).container

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})