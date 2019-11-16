import axios, { Method } from 'axios'
import { createAxiosTSInstance, valid } from '../index'

const schema = {
  'GET users': {
    url: (params: { id: string }) => `users/${params.id}`,
    method: 'GET' as Method,
    params: null,
    data: null,
    response: {} as {
      id: string,
      username: string,
      email: string
    }[]
  },
}

describe('Axios TS', () => {
  it('Should return axios instance', () => {
    const api = createAxiosTSInstance({ baseURL: 'http://api.com' }, schema)

    expect(api.request).toBeDefined()
  })

  it('Should handle config params', () => {
    let interceptor: Function;
    const request = jest.fn((config) => {
      return interceptor(config)
    })

    axios.create = jest.fn(() => ({
      request,
      interceptors: {
        request: {
          use: (inter: typeof interceptor) => {
            interceptor = inter
          }
        }
      }
    }) as any)

    const api = createAxiosTSInstance({ baseURL: 'http://api.com' }, schema)

    api.request({
      routeName: 'GET users',
      urlParams: {
        id: '2',
      },
    })

    expect(request).toBeCalledWith({
      routeName: 'GET users',
      urlParams: {
        id: '2',
      }
    })

    expect(request).toHaveReturnedWith({
      url: 'users/2',
      method: 'GET',
    })
  })
})