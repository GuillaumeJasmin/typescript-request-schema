import { GetConfig, GetOutput, Method, validSchema } from './lib'
import axios, { AxiosRequestConfig, AxiosPromise } from 'axios'

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
type Request = <RouteName extends keyof Schema>(config: GetConfig<Schema, RouteName, AxiosRequestConfig>) => AxiosPromise<GetOutput<RouteName, Schema>>

const axiosInstance = axios.create({ baseURL: 'https://api.com' })

const request: Request = (config) => {
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
}).then(res => res.data.id)

request({
  name: 'GET /users',
  queryParams: {
    page: 1,
  },
}).then((res) => res.data[0].id)