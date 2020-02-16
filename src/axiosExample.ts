import { Method, validSchema } from './lib'
import axios from 'axios'
import { createAxiosRequest } from './createAxiosRequest'

const apiSchema = {
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

validSchema(apiSchema)

const axiosInstance = axios.create({ baseURL: 'https://api.com' })

const request = createAxiosRequest(apiSchema, axiosInstance)

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