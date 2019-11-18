import { Schema, RSAxiosInstance } from './types'

export function addAxiosInterceptor(api: RSAxiosInstance<'', {}>, schema: Schema) {
  // @ts-ignore
  api.interceptors.request.use((config: AxiosRequestConfigBase) => {
    const { routeName, urlParams, ...restConfig } = config
    if (!routeName) {
      throw new Error(`
        request-schema: routeName is undefined.
        \nIf you use axios@0.19, downgrade to axios@0.18 because request-schema is incomptabible with v0.19
        \nsee breaking changes issue with custom config https://github.com/axios/axios/issues/1718
      `)
    }
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