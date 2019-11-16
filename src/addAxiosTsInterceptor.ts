import { Schema, AxiosTSInstance } from './types'

export function addAxiosTsInterceptor(api: AxiosTSInstance<'', {}>, schema: Schema) {
  // @ts-ignore
  api.interceptors.request.use((config: AxiosRequestConfigBase) => {
    const { routeName, urlParams, ...restConfig } = config
    const urlAsFunction = schema[routeName].url
    const { method } = schema[routeName]

    // @ts-ignore
    const url = urlAsFunction(config.urlParams)

    return {
      ...restConfig,
      url,
      method,
    }
  })
}