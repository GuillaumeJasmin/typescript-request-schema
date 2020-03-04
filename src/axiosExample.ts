import { validSchema, GetConfig, GetOutput } from './lib'
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios'

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

const axiosInstance = axios.create({ baseURL: 'https://api.com' })

type Schema = typeof apiSchema
type RouteName = keyof typeof apiSchema

function request<T extends RouteName>(config: GetConfig<Schema, T, AxiosRequestConfig>): AxiosPromise<GetOutput<T, Schema>> {
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

  const urlWithPathParams = (typeof url === 'function' && pathParams)
    ? url(pathParams)
    : url

  const finalQueryParams = {
    ...queryParams,
    ...defaultQueryParams,
  }

  return axiosInstance.request({
    url: urlWithPathParams,
    method,
    data,
    params: finalQueryParams,
    ...restConfig
  })
}

request({
  name: 'PATCH /users/:id',
  pathParams: {
    id: ''
  },
  data: {},
}).then((res) => res.data.id)

request({
  name: 'GET /users',
  queryParams: {
    page: 1,
  },
}).then((res) => res.data[0].id)