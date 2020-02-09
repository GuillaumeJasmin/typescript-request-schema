import { ObjectParams, FnParams, Extends } from './index'

const apiShema = {
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

interface KeysTypes {
  URL: string | ((params?: object) => string);
  PATH_PARAMS?: object;
  QUERY_PARAMS?: object;
  DATA?: object;
  RESPONSE?: object;
}

type RequestParams<
  PathParamsKey extends string,
  QueryParamsKey extends string,
  DataKey extends string,
> =
  NonNullable<Parameters<typeof fetch>[1]> 
  & { name: string; }
  & ObjectParams<KeysTypes, 'PATH_PARAMS', 'pathParams'>
  & ObjectParams<KeysTypes, 'QUERY_PARAMS', 'queryParams'>
  & ObjectParams<KeysTypes, 'DATA', 'data'>

interface SchemaDef<
  QueryParamsKey extends string,
  URLKey extends string,
  DataKey extends string,
  ResponseKey extends string,
> {
  [key: string]: (
    { method: string; }
    & ObjectParams<KeysTypes, 'URL', 'url'>
    & ObjectParams<KeysTypes, 'QUERY_PARAMS', 'queryParams'>
    & ObjectParams<KeysTypes, 'DATA', 'data'>
    & ObjectParams<KeysTypes, 'RESPONSE', 'response'>
  )
}

function createFetchRequest<
  T extends any = {},
  PathParamsKey extends string = 'pathParams',
  QueryParamsKey extends string = 'queryParams',
  URLKey extends string = 'url',
  DataKey extends string = 'data',
  ResponseKey extends string = 'response',
>(
    schema: T,
    requestResolver: (
      config: RequestParams<PathParamsKey, QueryParamsKey, DataKey>,
      schema: SchemaDef<QueryParamsKey, URLKey, DataKey, ResponseKey>
    ) => ReturnType<typeof fetch>,
    options?: {
      pathParamsKey?: PathParamsKey,
      queryParamsKey?: QueryParamsKey,
      urlKey?: URLKey,
      dataKey?: DataKey,
      responseKey?: ResponseKey,
    },
  ) {

  type Schema = typeof schema
  type SchemaKeys = keyof Schema

  type RequestConfig = NonNullable<Parameters<typeof fetch>[1]>

  type Config<T extends SchemaKeys> =
    { name: T }
    & FnParams<Schema[T], URLKey, PathParamsKey>
    & ObjectParams<Schema[T], QueryParamsKey>
    & ObjectParams<Schema[T], DataKey>
    & Extends<Schema[T], RequestConfig>

  type Request = <T extends SchemaKeys>(config: Config<T>) => Promise<Schema[T][ResponseKey]>

  // @ts-ignore
  return ((config) => requestResolver(config, schema)) as Request
}

const request = createFetchRequest(
  apiShema,
  (config, schema) => {
    const {
      name,
      pathParams,
      data,
      queryParams,
      ...restConfig
    } = config

    const { url, method } = schema[name]

    const urlWithPathParams = typeof url === 'function'
      ? url(pathParams)
      : url

    const baseURL = 'https://api.com'
    // @ts-ignore
    const queryParamsStr = queryString.stringify(queryParams)
    const fullURL = `${baseURL}/${urlWithPathParams}?${queryParamsStr}`

    return fetch(fullURL, {
      method,
      body: JSON.stringify(data),
      ...restConfig
    }).then(res => res.json())
  },
  {
    // pathParamsKey: 'toto',
    // queryParamsKey: 'fff'
    // urlKey: 'd'
  },
)

request({
  name: 'GET /users/:id',
  pathParams: {
    id: ''
  },
}).then((res) => res.email)