import { validSchema, Input, Output } from './lib'

const schema = {
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

validSchema(schema)

type Schema = typeof schema
type RequestName = keyof Schema
type ExtraConfig = NonNullable<Parameters<typeof fetch>[1]>
type RequestConfig<T extends RequestName> = Input<T, Schema, ExtraConfig>
type RequestOutput<T extends RequestName> = Promise<Output<T, Schema>>

function request<T extends RequestName>(config: RequestConfig<T>): RequestOutput<T> {
  const { name, data, queryParams, pathParams, ...restConfig } = config
  const { url, method } = schema[name]

  const urlWithPathParams = (typeof url === 'function' && pathParams)
    ? url(pathParams)
    : url as string

  const queryParamsAsString = Object.entries(queryParams ?? {})
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  const fullUrl = `${urlWithPathParams}?${queryParamsAsString}`

  return fetch(fullUrl, {
    method,
    body: data ? JSON.stringify(data) : undefined,
    ...restConfig
  }).then(res => res.json())
}

request({
  name: 'PATCH /users/:id',
  pathParams: {
    id: '1'
  },
  data: {},
}).then((res) => res.id)

request({
  name: 'GET /users',
  queryParams: {
    page: 1,
  },
}).then((res) => res[0].id)