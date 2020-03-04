import { validSchema, GetConfig, GetOutput } from './lib'

const apiSchema = {
  'GET /users': {
    url: 'users',
    method: 'GET',
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
    method: 'GET',
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
    method: 'POST',
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
    method: 'PATCH',
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
    method: 'DELETE',
    queryParams: null,
    data: null,
    response: null
  },
}

validSchema(apiSchema)

type Schema = typeof apiSchema
type RouteName = keyof typeof apiSchema
type FetchParams = NonNullable<Parameters<typeof fetch>[1]>

function request<T extends RouteName>(config: GetConfig<Schema, T, FetchParams>): Promise<GetOutput<T, Schema>> {
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
  } = apiSchema[name]

  const finalQueryParams = {
    ...defaultQueryParams,
    ...queryParams,
  }

  const urlWithPathParams = typeof url === 'function' && pathParams
    ? url(pathParams)
    : url

  const baseURL = 'https://api.com'
  // @ts-ignore
  const queryParamsStr = queryString.stringify(finalQueryParams)
  let fullURL = `${baseURL}/${urlWithPathParams}`
  if (Object.keys(queryParamsStr).length) {
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
}).then((res) => res.id)

request({
  name: 'GET /users',
  queryParams: {
    page: 1,
  },
}).then((res) => res[0].id)