import axios, { AxiosPromise, AxiosRequestConfig, AxiosInstance, Method } from 'axios'

export interface Schema {
  [key: string]: {
    url: (params?: { [key: string]: string | number }) => string,
    method: Method,
    params: void | {
      [key: string]: any
    },
    data: void | {
      [key: string]: any
    },
    response: void | {
      [key: string]: any
    },
  }
}

type Parameters<T> = T extends (...args: infer T) => any ? T : null;
type GetType<Key extends string, SchemaAPI extends any> = SchemaAPI[Key]
// @ts-ignore
type GetURLParams<Key extends string, SchemaAPI extends any> = Parameters<GetType<Key, SchemaAPI>['url']>[0]

interface AxiosRequestConfigBase<Key extends string = '', SchemaAPI extends any = {}> extends Omit<AxiosRequestConfig, 'url'> {
  routeName: Key
  urlParams: GetURLParams<Key, SchemaAPI>
  params: GetType<Key, SchemaAPI>['params'];
  data: GetType<Key, SchemaAPI>['data']
}

type OmitVoidKeys<Key extends string, SchemaAPI extends any, Acc extends AxiosRequestConfigBase<Key, SchemaAPI>> =
  GetType<Key, SchemaAPI>['params'] extends null
    ? GetType<Key, SchemaAPI>['data'] extends null
      ? GetURLParams<Key, SchemaAPI> extends void
        ? Omit<Acc, 'params' | 'data' | 'urlParams'>
        : Omit<Acc, 'params' | 'data'>
      : GetURLParams<Key, SchemaAPI> extends void
        ? Omit<Acc, 'params' | 'urlParams'>
        : Omit<Acc, 'params'>
    : GetType<Key, SchemaAPI>['data'] extends null
      ? GetURLParams<Key, SchemaAPI> extends void
        ? Omit<Acc, 'data' | 'urlParams'>
        : Omit<Acc, 'data'>
      : GetURLParams<Key, SchemaAPI> extends void
        ? Omit<Acc, 'urlParams'>
        : Acc

type AxiosRequestConfigFinal<Key extends string, SchemaAPI extends any> = OmitVoidKeys<Key, SchemaAPI, AxiosRequestConfigBase<Key, SchemaAPI>>

// @ts-ignore
export interface AxiosTSInstance<SchemaKeys extends string, SchemaAPI extends Schema> extends AxiosInstance {
  request: <Key extends SchemaKeys>(config: AxiosRequestConfigFinal<Key, SchemaAPI>) => AxiosPromise<SchemaAPI[Key]['response']>
}
