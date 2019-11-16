import axios, { AxiosRequestConfig } from 'axios'
import { AxiosTSInstance } from './types'
import { addAxiosTsInterceptor } from './addAxiosTsInterceptor'

// @ts-ignore
export function createAxiosTSInstance<T, Instance = AxiosTSInstance<keyof T, T>>(axiosConfig: AxiosRequestConfig, schema: T): Instance {

  // @ts-ignore
  const api: Instance = axios.create(axiosConfig)

  // @ts-ignore
  addAxiosTsInterceptor(api, schema)

  return api;
}