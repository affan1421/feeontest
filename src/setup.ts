import '@testing-library/jest-dom'


import { server } from '../src/mocks/setup'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())