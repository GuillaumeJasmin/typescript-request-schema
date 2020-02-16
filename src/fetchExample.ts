import { Method, validSchema } from './lib'
import { createFetchRequest } from './createFetchRequest'

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

const request = createFetchRequest(apiSchema)

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