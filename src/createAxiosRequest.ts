import { GetConfig, GetOutput } from './lib'
import { AxiosRequestConfig, AxiosPromise, AxiosInstance } from 'axios'

export const createAxiosRequest = <Schema extends any = {}>(apiShema: Schema, axiosInstance: AxiosInstance) => {
  // @ts-ignore
  type Request = <RouteName extends keyof Schema>(config: GetConfig<Schema, RouteName, AxiosRequestConfig>) => AxiosPromise<GetOutput<RouteName, Schema>>

  const request: Request = (config) => {
    const {
      name,
      pathParams,
      data,
      queryParams = {},
      ...restConfig
    } = config

    const {
      url,
      method,
      queryParams: defaultQueryParams
    } = apiShema[name]

    const urlWithPathParams = (typeof url === 'function' && pathParams)
      ? url(pathParams)
      : url

    const finalQueryParams = {
      ...queryParams,
      ...defaultQueryParams,
    }

    return axiosInstance.request({
      url: urlWithPathParams,
      method,
      data,
      params: finalQueryParams,
      ...restConfig
    })
  }

  return request
}