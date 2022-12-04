import * as session from 'services/session'

type ClientOptions = {
  data?: Record<string, unknown>
  token?: string
} & RequestInit

function client<TResponse>(
  endpoint: string,
  {data, token, headers: customHeaders, ...customConfig}: ClientOptions = {},
): Promise<TResponse> {
  const headers = customHeaders ? new Headers(customHeaders) : new Headers()

  if (data) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers,
    ...customConfig,
  }

  return window
    .fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, config)
    .then(async response => {
      if (response.status === 401) {
        await session.logout()
        window.location.assign(window.location.href)
        return Promise.reject({message: 'Please re-authenticate'})
      }
      const data = await response.json()
      if (response.ok) {
        return data
      } else {
        return Promise.reject(data)
      }
    })
}

export {client}
