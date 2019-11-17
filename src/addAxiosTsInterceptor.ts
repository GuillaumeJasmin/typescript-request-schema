import { Schema, AxiosTSInstance } from './types'

export function addAxiosTsInterceptor(api: AxiosTSInstance<'', {}>, schema: Schema) {
  // @ts-ignore
  api.interceptors.request.use((config: AxiosRequestConfigBase) => {
    const { routeName, urlParams, ...restConfig } = config
    const { url, method } = schema[routeName]
    const finalURL = typeof url === 'function'
      ? url(config.urlParams)
      : url;

    return {
      ...restConfig,
      url: finalURL,
      method,
    }
  })
}