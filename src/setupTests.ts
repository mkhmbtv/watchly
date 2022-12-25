import {server} from 'mocks/server/test-server'
import '@testing-library/jest-dom'

beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
