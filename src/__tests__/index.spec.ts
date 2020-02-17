import { createFetchRequest } from '../createFetchRequest'

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
    response: {} as {},
  },
  'test_3': {
    url: 'users',
    method: 'GET',
    queryParams: {} as null | {
      page?: string
    },
    response: {} as {},
  },
  'test_4': {
    url: 'users',
    method: 'GET',
    queryParams: {} as null | {
      page: string
    },
    response: {} as {},
  },
  'test_5': {
    url: 'users',
    method: 'GET',
    response: {} as {},
  },
  'test_6': {
    url: () => 'users',
    method: 'GET',
    response: {} as {},
  },
  'test_7': {
    url: (params: { id: string }) => `users/${params.id}`,
    method: 'GET',
    response: {} as {},
  },
  'test_8': {
    url: (params: { id: string }) => `users/${params.id}`,
    method: 'GET',
    response: {} as {
      id: string,
      username: string
    },
  },
}

const request = createFetchRequest(schema)

// uncomment "should failed" comment block to see if TypeScript show an error

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

    // // should failed: queryParams
    // request({
    //  name: 'test_1',
    //   queryParams: {
    //     page: '1'
    //   }
    // })

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
    // request({
    //   name: 'test_2',
    //   queryParams: {
    //     page: '1'
    //   },
    //   method: 'GET',
    //   headers: {
    //     foo: 'bar'
    //   },
    // })

    // // should failed: queryParams missing
    // request({
    //  name: 'test_2',
    // })
    
    // // should failed: queryParams empty
    // request({
    //  name: 'test_2',
    //   queryParams: {}
    // })

    // // should failed: queryParams empty
    // request({
    //  name: 'test_2',
    //   queryParams: null
    // })

    // // should failed: pageSize not expected
    // request({
    //  name: 'test_2',
    //   queryParams: {
    //     page: '1',
    //     pageSize: 2,
    //   }
    // })

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
    // request({
    //  name: 'test_3',
    //   queryParams: {
    //     page: '1',
    //     pageSize: '2'
    //   }
    // })

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
    
    // // should failed: queryParams.page required
    // request({
    //  name: 'test_4',
    //   queryParams: {}
    // })

    // // should failed: queryParams.pageSize not expected
    // request({
    //  name: 'test_4',
    //   queryParams: {
    //     page: '1',
    //     pageSize: '2'
    //   }
    // })

    // should works
    request({
      name: 'test_5',
    })

    // should works
    request({
      name: 'test_5',
      queryParams: null
    })

    // // should failed: queryParams not expected
    // request({
    //  name: 'test_5',
    //   queryParams: {}
    // })

    // should works
    request({
      name: 'test_6',
    })

    // should works
    request({
      name: 'test_6',
      pathParams: null
    })

    // // should failed: pathParams not expected
    // request({
    //  name: 'test_6',
    //   pathParams: {}
    // })

    // should works
    request({
      name: 'test_7',
      pathParams: {
        id: '2'
      }
    })

    // // should failed: pathParams.id expected to be a string
    // request({
    //   name: 'test_7',
    //   pathParams: {
    //     id: 2
    //   }
    // })

    // // should failed: pathParams required
    // request({
    //   name: 'test_7',
    // })

    // // should failed: pathParams required
    // request({
    //   name: 'test_7',
    //   pathParams: null
    // })

    // // should failed: pathParams.id required
    // request({
    //   name: 'test_7',
    //   pathParams: {}
    // })

    // should works
    request({
     name: 'test_8',
     pathParams: {
        id: '2'
      }
    }).then(res => {
      const data = res.username;
    })

    // // should failed: email in response not defined
    // request({
    //  name: 'test_8',
    //  pathParams: {
    //     id: '2'
    //   }
    // }).then(res => {
    //   const data = res.email;
    // })
  })
})