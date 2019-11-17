import { AxiosPromise, AxiosRequestConfig, AxiosInstance, Method } from 'axios'

export interface Schema {
  [key: string]: {
    url: string | ((params: { [key: string]: string | number }) => string),
    method: Method,
    params?: null | {
      [key: string]: any
    },
    data?: null | {
      [key: string]: any
    },
    response: void | {
      [key: string]: any
    },
  }
}

type Params<Key extends string, SchemaAPI extends any> =
  GetType<Key, SchemaAPI>['params'] extends object
    ? { params: GetType<Key, SchemaAPI>['params'] }
    : GetType<Key, SchemaAPI>['params'] extends (void | null | object)
      ? { params?: GetType<Key, SchemaAPI>['params'] }
      : { params?: null }

type Data<Key extends string, SchemaAPI extends any> =
  GetType<Key, SchemaAPI>['data'] extends object
    ? { data: GetType<Key, SchemaAPI>['data'] }
    : GetType<Key, SchemaAPI>['data'] extends (void | null | object)
      ? { data?: GetType<Key, SchemaAPI>['data'] }
      : { data?: null }

type URLParams<Key extends string, SchemaAPI extends any> =
  GetURLParams<Key, SchemaAPI> extends object
    ? { urlParams: GetURLParams<Key, SchemaAPI> }
    : { urlParams?: null }

type Parameters<T> = T extends (...args: infer T) => any ? T : null;
type GetType<Key extends string, SchemaAPI extends any> = SchemaAPI[Key]
// @ts-ignore
type GetURLParams<Key extends string, SchemaAPI extends any> = Parameters<GetType<Key, SchemaAPI>['url']>[0]

type RouteName<Key extends string> = {
  routeName: Key
}

type AxiosRequestConfigFinal<Key extends string, SchemaAPI extends any> =
  Omit<AxiosRequestConfig, 'url' | 'params' | 'data'>
  & RouteName<Key>
  & URLParams<Key, SchemaAPI>
  & Data<Key, SchemaAPI>
  & Params<Key, SchemaAPI>

export interface AxiosTSInstance<SchemaKeys extends string, SchemaAPI extends Schema> extends Omit<AxiosInstance, 'request'> {
  request: <Key extends SchemaKeys>(config: AxiosRequestConfigFinal<Key, SchemaAPI>) => AxiosPromise<SchemaAPI[Key]['response']>
}