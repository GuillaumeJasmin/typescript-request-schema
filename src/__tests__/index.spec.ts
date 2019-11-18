import axios from 'axios'
import { createAxiosInstance, valid } from '../index'

const schema = {
  'GET users': {
    url: 'users',
    method: 'GET',
    params: {} as null | {
      page?: number,
      pageSize?: number
    },
    data: null,
    response: {} as {
      id: string,
      username: string,
      email: string
    }[]
  },
  'POST users': {
    url: 'users',
    method: 'POST',
    params: null,
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
  'PATCH users/:id': {
    url: (params: { id: string }) => `users/${params.id}`,
    method: 'PATCH',
    params: null,
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
}

// valid(schema)

let request: any;

beforeEach(() => {
  let interceptor: Function;
  request = jest.fn((config) => {
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
})

describe('Axios TS', () => {
  it('Should return axios instance', () => {
    const api = createAxiosInstance({ baseURL: 'http://api.com' }, schema)

    expect(api.request).toBeDefined()
  })

  it('Should handle config params', () => {
    const api = createAxiosInstance({ baseURL: 'http://api.com' }, schema)

    api.request({
      routeName: 'PATCH users/:id',
      urlParams: {
        id: '2'
      },
      data: {
        username: 'new name'
      }
    })

    expect(request).toBeCalledWith({
      routeName: 'PATCH users/:id',
      urlParams: {
        id: '2',
      },
      data: {
        username: 'new name'
      }
    })

    expect(request).toHaveReturnedWith({
      url: 'users/2',
      method: 'PATCH',
      data: {
        username: 'new name'
      }
    })
  })

  it('Should TypeScript def works', () => {
    const api1 = createAxiosInstance({}, {
      'GET users': {
        url: 'users',
        method: 'GET',
      },
    })

    // should works
    api1.request({
      routeName: 'GET users',
    })

    // should works
    api1.request({
      routeName: 'GET users',
      params: null
    })

    // should failed
    // api1.request({
    //   routeName: 'GET users',
    //   params: {
    //     page: '1'
    //   }
    // })

    // -------

    const api2 = createAxiosInstance({}, {
      'GET users': {
        url: 'users',
        method: 'GET',
        params: {} as {
          page: string
        }
      },
    })

    // should works
    api2.request({
      routeName: 'GET users',
      params: {
        page: '1'
      }
    })

    // should failed
    // api2.request({
    //   routeName: 'GET users',
    // })
    
    // should failed
    // api2.request({
    //   routeName: 'GET users',
    //   params: {}
    // })

    // should failed
    // api2.request({
    //   routeName: 'GET users',
    //   params: null
    // })

    // should failed
    // api2.request({
    //   routeName: 'GET users',
    //   params: {
    //     page: '1',
    //     pageSize: 2,
    //   }
    // })

    // ---------

    const api3 = createAxiosInstance({}, {
      'GET users': {
        url: 'users',
        method: 'GET',
        params: {} as null | {
          page?: string
        }
      },
    })

    // should works
    api3.request({
      routeName: 'GET users',
    })

    // should works
    api3.request({
      routeName: 'GET users',
      params: null,
    })
    
    // should works
    api3.request({
      routeName: 'GET users',
      params: {}
    })

    // should works
    api3.request({
      routeName: 'GET users',
      params: {
        page: '1'
      }
    })

    // should failed
    // api3.request({
    //   routeName: 'GET users',
    //   params: {
    //     page: '1',
    //     pageSize: '2'
    //   }
    // })

    // ------------
    const api4 = createAxiosInstance({}, {
      'GET users': {
        url: 'users',
        method: 'GET',
        params: {} as null | {
          page: string
        }
      },
    })

    // should works
    api4.request({
      routeName: 'GET users',
    })

    // should works
    api4.request({
      routeName: 'GET users',
      params: null
    })

    // should works
    api4.request({
      routeName: 'GET users',
      params: {
        page: '1'
      }
    })
    
    // should failed
    // api4.request({
    //   routeName: 'GET users',
    //   params: {}
    // })

    // should failed
    // api4.request({
    //   routeName: 'GET users',
    //   params: {
    //     page: '1',
    //     pageSize: '2'
    //   }
    // })

  // ----------
    const api5 = createAxiosInstance({}, {
      'GET users': {
        url: 'users',
        method: 'GET',
      },
    })

    // should works
    api5.request({
      routeName: 'GET users',
    })

    // should works
    api5.request({
      routeName: 'GET users',
      urlParams: null
    })

    // should failed
    // api5.request({
    //   routeName: 'GET users',
    //   urlParams: {}
    // })

    // --------

    const api6 = createAxiosInstance({}, {
      'GET users': {
        url: () => 'users',
        method: 'GET',
      },
    })

    // should works
    api6.request({
      routeName: 'GET users',
    })

    // should works
    api6.request({
      routeName: 'GET users',
      urlParams: null
    })

    // should failed
    // api6.request({
    //   routeName: 'GET users',
    //   urlParams: {}
    // })

    // --------

    const api7 = createAxiosInstance({}, {
      'GET users': {
        url: (params: { id: string }) => `users/${params.id}`,
        method: 'GET',
      },
    })

    // should works
    api7.request({
      routeName: 'GET users',
      urlParams: {
        id: '2'
      }
    })

    // should failed
    // api7.request({
    //   routeName: 'GET users',
    //   urlParams: {
    //     id: 2
    //   }
    // })

    // should failed
    // api7.request({
    //   routeName: 'GET users',
    // })

    // should failed
    // api7.request({
    //   routeName: 'GET users',
    //   urlParams: null
    // })

    // should failed
    // api7.request({
    //   routeName: 'GET users',
    //   urlParams: {}
    // })
  })
})