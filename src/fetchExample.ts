import { GetConfig, GetOutput, Method, validSchema } from './lib'

const apiShema = {
  'GET /users': {
    url: 'users',
    method: 'GET' as Method,
    queryParams: {} as void | {
      page?: number,
      pageSize?: number,
    },
    data: null,
    response: {} as {
      id: string,
      username: string,
      email: string
    }[]
  },
  'GET /users/:id': {
    url: (pathParams: { id: string }) => `users/${pathParams.id}`,
    method: 'GET' as Method,
    queryParams: null,
    data: null,
    response: {} as {
      id: string,
      username: string,
      email: string
    }
  },
  'POST /users/:id': {
    url: 'users',
    method: 'POST' as Method,
    queryParams: null,
    data: {} as {
      username: string,
      email: string
    },
    response: {} as {
      id: string,
      username: string,
      email: string
    }
  },
  'PATCH /users/:id': {
    url: (pathParams: { id: string }) => `users/${pathParams.id}`,
    method: 'PATCH' as Method,
    queryParams: null,
    data: {} as {
      username?: string,
      email?: string
    },
    response: {} as {
      id: string,
      username: string,
      email: string
    }
  },
  'DELETE /users/:id': {
    url: (pathParams: { id: string }) => `users/${pathParams.id}`,
    method: 'DELETE' as Method,
    queryParams: null,
    data: null,
    response: null
  },
}

validSchema(apiShema)

type Schema = typeof apiShema
type FetchParams = NonNullable<Parameters<typeof fetch>[1]>
type FinalRequest = <RouteName extends keyof Schema>(config: GetConfig<Schema, RouteName, FetchParams>) => Promise<GetOutput<RouteName, Schema>>

const request: FinalRequest = (config) => {
  const {
    name,
    pathParams,
    data,
    queryParams = {},
    ...restConfig
  } = config

  const {
    url,
    method,
    queryParams: defaultQueryParams
  } = apiShema[name]

  const finalQueryParams = {
    ...queryParams,
    ...defaultQueryParams,
  }

  const urlWithPathParams = typeof url === 'function' && pathParams
    ? url(pathParams)
    : url

  const baseURL = 'https://api.com'
  // @ts-ignore
  const queryParamsStr = queryString.stringify(queryParams)
  let fullURL = `${baseURL}/${urlWithPathParams}`
  if (fullURL) {
    fullURL += `?${queryParamsStr}`
  }

  return fetch(fullURL, {
    method,
    body: JSON.stringify(data),
    ...restConfig
  }).then(res => res.json())
}

request({
  name: 'PATCH /users/:id',
  pathParams: {
    id: ''
  },
  data: {},
}).then(res => res.id)

request({
  name: 'GET /users',
  queryParams: {
    page: 1,
  },
}).then((res) => res[0].id)