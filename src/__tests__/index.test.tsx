import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import Custom404 from '../pages/404'
import { Providers } from '../components/ContextProviders/Providers'
import { ToastContainer } from 'react-toastify'



jest.mock('next/router', () => ({
  useRouter() {
    return ({
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn()
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null)
    });
  },
}));



jest.doMock('react-toastify', () => () => {
  const ToastContainer = () => <div />;
  return ToastContainer;
});


test('Loads 404-page', async () => {
  render(
    <Providers>
      <ToastContainer />
      <div>Hei verden</div>
      <Custom404 />
    </Providers>
  )

  expect(screen.getByRole('heading')).toHaveTextContent('Fant ikke siden')
})

// test('handles server error', async () => {
//   server.use(
//     rest.get('/greeting', (req, res, ctx) => {
//       return res(ctx.status(500))
//     }),
//   )

//   render(<Custom404 />)

//   fireEvent.click(screen.getByText('Load Greeting'))

//   await waitFor(() => screen.getByRole('alert'))

//   expect(screen.getByRole('alert')).toHaveTextContent('Oops, failed to fetch!')
//   expect(screen.getByRole('button')).not.toBeDisabled()
// })