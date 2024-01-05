import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('creating new blog through blogform', async () => {
  const mockHandler = jest.fn()

  const container = render(
    <BlogForm createBlog={mockHandler} />
  ).container

  const title = container.querySelector('#title')
  const author = container.querySelector('#author')
  const url = container.querySelector('#url')
  const user = userEvent.setup()
  const button = screen.getByText('create')
  await user.type(title, 'Testing Creating New Blog')
  await user.type(author, 'Daniel Choi')
  await user.type(url, 'http://testing/url')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(mockHandler.mock.calls[0][0].title).toBe('Testing Creating New Blog')
})