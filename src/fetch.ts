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
  QUERY_PARAMS?: object | null | void;
  DATA?: object | null | void;
  RESPONSE?: object;
}

type RequestParams<
  RouteNameKey extends string,
  PathParamsKey extends string,
  QueryParamsKey extends string,
  DataKey extends string,
> =
  { [key in RouteNameKey]: string; }
  & ObjectParams<KeysTypes, 'PATH_PARAMS', PathParamsKey>
  & ObjectParams<KeysTypes, 'QUERY_PARAMS', QueryParamsKey>
  & ObjectParams<KeysTypes, 'DATA', DataKey>

interface SchemaConfig<
  QueryParamsKey extends string,
  URLKey extends string,
  DataKey extends string,
  ResponseKey extends string,
> {
  [key: string]: (
    { method: string; }
    & { [Key in URLKey]: string | ((params: any) => string)  }
    & { [Key in QueryParamsKey]: object | null | void }
    & { [Key in DataKey]: object | null | void }
    & { [Key in ResponseKey]: object | null | void }
  )
}

function createFetchRequest<
  RouteNameKey extends string = 'name',
  PathParamsKey extends string = 'pathParams',
  QueryParamsKey extends string = 'queryParams',
  URLKey extends string = 'url',
  DataKey extends string = 'data',
  ResponseKey extends string = 'response',
  OtherProperties extends { [key: string]: any } = {},
  Schema extends SchemaConfig<QueryParamsKey, URLKey, DataKey, ResponseKey> = SchemaConfig<QueryParamsKey, URLKey, DataKey, ResponseKey>
>(
    schema: Schema,
    requestResolver: (
      config: RequestParams<RouteNameKey, PathParamsKey, QueryParamsKey, DataKey>,
      schema: SchemaConfig<QueryParamsKey, URLKey, DataKey, ResponseKey>
    ) => any,
    options?: {
      pathParamsKey?: PathParamsKey,
      queryParamsKey?: QueryParamsKey,
      urlKey?: URLKey,
      dataKey?: DataKey,
      responseKey?: ResponseKey,
      routeNameKey?: RouteNameKey,
      otherProperties?: OtherProperties
    },
  ) {

  type SchemaKeys = keyof Schema

  type Config<T extends SchemaKeys> =
    { [key in RouteNameKey]: T }
    & FnParams<Schema[T], URLKey, PathParamsKey>
    & ObjectParams<Schema[T], QueryParamsKey>
    & ObjectParams<Schema[T], DataKey>
    & Extends<Schema[T], OtherProperties>

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

    const { url, method, response } = schema[name]

    const urlWithPathParams = typeof url === 'function'
      ? url(pathParams)
      : url

    const baseURL = 'https://api.com'
    // @ts-ignore
    const queryParamsStr = queryString.stringify(queryParams)
    const fullURL = `${baseURL}/${urlWithPathParams}?${queryParamsStr}`

    const res = fetch(fullURL, {
      method,
      body: JSON.stringify(data),
      ...restConfig
    }).then(res => res.json())

    return res
  },
  {
    otherProperties: {} as Parameters<typeof fetch>[1],
  },
)

request({
  name: 'GET /users',
  queryParams: {
    page: 1,
  },
}).then((res) => res[0].id)