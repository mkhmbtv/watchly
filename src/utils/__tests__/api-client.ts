import {rest, server, RestRequest} from 'mocks/server/test-server'
import {client} from '../api-client'
import * as userService from 'services/user'

jest.mock('services/user')

const apiUrl = process.env.REACT_APP_API_URL

test('calls fetch at the endpoint with the arguments for GET requests', async () => {
  const endpoint = 'test-endpoint'
  const mockRes = {mockValue: 'VALUE'}
  server.use(
    rest.get(`${apiUrl}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.json(mockRes))
    }),
  )

  const res = await client(endpoint)
  expect(res).toEqual(mockRes)
})

test('adds auth token when a token is provided', async () => {
  const token = 'FAKE_TOKEN'
  let request: RestRequest | undefined
  const endpoint = 'test-endpoint'
  const mockRes = {mockValue: 'VALUE'}
  server.use(
    rest.get(`${apiUrl}/${endpoint}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json(mockRes))
    }),
  )

  await client(endpoint, {token})
  expect(request?.headers.get('Authorization')).toBe(`Bearer ${token}`)
})

test('allows for config overrides', async () => {
  const endpoint = 'test-endpoint'
  const mockRes = {mockValue: 'VALUE'}
  let request: RestRequest | undefined
  server.use(
    rest.put(`${apiUrl}/${endpoint}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json(mockRes))
    }),
  )

  const customConfig = {
    method: 'PUT',
    headers: {
      'Content-Type': 'test type',
    },
  }
  await client(endpoint, customConfig)

  expect(request?.headers.get('Content-Type')).toBe(
    customConfig.headers['Content-Type'],
  )
})

test('provided data is stringified and the method defaults to POST', async () => {
  const endpoint = 'test-endpoint'
  server.use(
    rest.post(`${apiUrl}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.json(req.body))
    }),
  )

  const mockData = {foo: 'bar'}
  const result = await client(endpoint, {data: mockData})

  expect(result).toEqual(mockData)
})

test('Unsuccessull request results in a rejected promise', async () => {
  const endpoint = 'test-endpoint'
  const testMessage = {message: 'test error'}
  server.use(
    rest.get(`${apiUrl}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.status(400), ctx.json(testMessage))
    }),
  )
  await expect(client(endpoint)).rejects.toEqual(testMessage)
})

test('logs the user out if the request returns a status of 401', async () => {
  const endpoint = 'test-endpoint'
  const mockRes = {mockValue: 'VALUE'}
  server.use(
    rest.get(`${apiUrl}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.status(401), ctx.json(mockRes))
    }),
  )

  const error = (await client(endpoint).catch(e => e)) as {message: string}

  expect(error.message).toMatchInlineSnapshot(`"Please re-authenticate"`)
  expect(userService.logout).toHaveBeenCalledTimes(1)
})
