import { Config, Response, validateSchema } from './lib'

const schema = {
  'test_1': {
    url: 'users',
    method: 'GET',
    queryParams: null,
    data: null,
    response: {} as {},
  },
  'test_2': {
    url: 'users',
    method: 'GET',
    queryParams: {} as {
      page: string
    },
    data: null,
    response: {} as {},
  },
  'test_3': {
    url: 'users',
    method: 'GET',
    queryParams: {} as null | {
      page?: string
    },
    data: null,
    response: {} as {},
  },
  'test_4': {
    url: 'users',
    method: 'GET',
    queryParams: {} as null | {
      page: string;
    },
    data: null,
    response: {} as {},
  },
  'test_5': {
    url: 'users',
    method: 'GET',
    queryParams: null,
    data: null,
    response: {} as {},
  },
  'test_6': {
    url: () => 'users',
    method: 'GET',
    queryParams: null,
    data: null,
    response: {} as {},
  },
  'test_7': {
    url: (params: { id: string }) => `users/${params.id}`,
    method: 'GET',
    queryParams: null,
    data: null,
    response: {} as {},
  },
  'test_8': {
    url: (params: { id: string }) => `users/${params.id}`,
    method: 'GET',
    queryParams: null,
    data: null,
    response: {} as {
      id: string,
      username: string
    },
  },
}

validateSchema({
  // should failed: url required
  // @ts-expect-error
  'test_1': {
    method: 'GET',
    response: {} as {
      id: string,
      username: string
    },
  },
  // should failed: method required
  // @ts-expect-error
  'test_2': {
    url: (params: { id: string }) => `users/${params.id}`,
    response: {} as {
      id: string,
      username: string
    },
  },
  // should failed: response required
  // @ts-expect-error
  'test_3': {
    url: (params: { id: string }) => `users/${params.id}`,
    method: 'GET',
  },
})

validateSchema(schema)

type Schema = typeof schema
type RequestName = keyof Schema
type ExtraConfig = NonNullable<Parameters<typeof fetch>[1]>
type RequestConfig<T extends RequestName> = Config<T, Schema, ExtraConfig>
type RequestResponse<T extends RequestName> = Promise<Response<T, Schema>>

function request<T extends RequestName>(config: RequestConfig<T>): RequestResponse<T> {
  const { name, data, queryParams, pathParams, ...restConfig } = config
  const { url, method } = schema[name]

  const urlWithPathParams = (typeof url === 'function' && pathParams)
    ? url(pathParams)
    : url as string

  const queryParamsAsString = Object.entries(queryParams ?? {})
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  const baseUrl = 'http://api.website.com'
  const fullUrl = `${baseUrl}${urlWithPathParams}?${queryParamsAsString}`

  // return fetch(fullUrl, {
  //   method,
  //   body: data ? JSON.stringify(data) : undefined,
  //   ...restConfig
  // }).then(res => res.json())

  return Promise.resolve({})
}

describe('TypeScript def schema', () => {
  it('Should TypeScript def works', () => {
    // should works
    request({
      name: 'test_1',
    })

    // should works
    request({
      name: 'test_1',
      queryParams: null,
    })

    // should failed: queryParams
    request({
     name: 'test_1',
      // @ts-expect-error
      queryParams: {
        page: '1'
      }
    })

    // should works
    request({
      name: 'test_2',
      queryParams: {
        page: '1'
      },
    })

    // should works
    request({
      name: 'test_2',
      queryParams: {
        page: '1'
      },
      headers: {
        foo: 'bar'
      },
    })

    // should failed: method not expected
    request({
      name: 'test_2',
      queryParams: {
        page: '1'
      },
      // @ts-expect-error
      method: 'GET',
      headers: {
        foo: 'bar'
      },
    })

    // should failed: queryParams missing
    // @ts-expect-error
    request({
      name: 'test_2',
    })
    
    // should failed: queryParams empty
    request({
      name: 'test_2',
      // @ts-expect-error
      queryParams: {}
    })

    // should failed: queryParams empty
    request({
      name: 'test_2',
      // @ts-expect-error
      queryParams: null
    })

    // should failed: pageSize not expected
    request({
      name: 'test_2',
      queryParams: {
        page: '1',
        // @ts-expect-error
        pageSize: 2,
      }
    })

    // should works
    request({
      name: 'test_3',
    })

    // should works
    request({
      name: 'test_3',
      queryParams: null,
    })
    
    // should works
    request({
      name: 'test_3',
      queryParams: {}
    })

    // should works
    request({
      name: 'test_3',
      queryParams: {
        page: '1'
      }
    })

    // should failed: pageSize not expected
    request({
      name: 'test_3',
      queryParams: {
        page: '1',
        // @ts-expect-error
        pageSize: '2'
      }
    })

    // should works
    request({
      name: 'test_4',
    })

    // should works
    request({
      name: 'test_4',
      queryParams: null
    })

    // should works
    request({
      name: 'test_4',
      queryParams: {
        page: '1'
      }
    })
    
    // should failed: queryParams.page required
    request({
      name: 'test_4',
      // @ts-expect-error
      queryParams: {}
    })

    // should failed: queryParams.pageSize not expected
    request({
      name: 'test_4',
      queryParams: {
        page: '1',
        // @ts-expect-error
        pageSize: '2'
      }
    })

    // should works
    request({
      name: 'test_5',
    })

    // should works
    request({
      name: 'test_5',
      queryParams: null
    })

    // should failed: queryParams not expected
    request({
      name: 'test_5',
      // @ts-expect-error
      queryParams: {}
    })

    // should works
    request({
      name: 'test_6',
    })

    // should works
    request({
      name: 'test_6',
      pathParams: null
    })

    // should failed: pathParams not expected
    request({
      name: 'test_6',
      // @ts-expect-error
      pathParams: {}
    })

    // should works
    request({
      name: 'test_7',
      pathParams: {
        id: '2'
      }
    })

    // should failed: pathParams.id expected to be a string
    request({
      name: 'test_7',
      pathParams: {
        // @ts-expect-error
        id: 2
      }
    })

    // should failed: pathParams required
    // @ts-expect-error
    request({
      name: 'test_7',
    })

    // should failed: pathParams required
    request({
      name: 'test_7',
      // @ts-expect-error
      pathParams: null
    })

    // should failed: pathParams.id required
    request({
      name: 'test_7',
      // @ts-expect-error
      pathParams: {}
    })

    // should works
    request({
      name: 'test_8',
      pathParams: {
        id: '2'
      }
    }).then(res => {
      const data = res.username;
    })

    // should failed: email in response not defined
    request({
      name: 'test_8',
      pathParams: {
        id: '2'
      }
    }).then(res => {
      // @ts-expect-error
      const data = res.email;
    })
  })
})