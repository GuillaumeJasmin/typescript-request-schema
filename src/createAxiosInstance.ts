import axios, { AxiosRequestConfig } from 'axios'
import { RSAxiosInstance } from './types'
import { addAxiosInterceptor } from './addAxiosInterceptor'

// @ts-ignore
export function createAxiosInstance<T, Instance = RSAxiosInstance<keyof T, T>>(axiosConfig: AxiosRequestConfig, schema: T): Instance {

  // @ts-ignore
  const api: Instance = axios.create(axiosConfig)

  // @ts-ignore
  addAxiosInterceptor(api, schema)

  return api;
}