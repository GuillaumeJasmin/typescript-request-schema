import { GetConfig, GetOutput } from './lib'

export const createFetchRequest = <Schema extends any = {}>(apiShema: Schema) => {
  type FetchParams = NonNullable<Parameters<typeof fetch>[1]>
  // @ts-ignore
  type FinalRequest = <RouteName extends keyof Schema>(config: GetConfig<Schema, RouteName, FetchParams>) => Promise<GetOutput<RouteName, Schema>>

  const request: FinalRequest = (config) => {
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

    const finalQueryParams = {
      ...queryParams,
      ...defaultQueryParams,
    }

    const urlWithPathParams = typeof url === 'function' && pathParams
      ? url(pathParams)
      : url

    const baseURL = 'https://api.com'
    // @ts-ignore
    const queryParamsStr = queryString.stringify(queryParams)
    let fullURL = `${baseURL}/${urlWithPathParams}`
    if (fullURL) {
      fullURL += `?${queryParamsStr}`
    }

    return fetch(fullURL, {
      method,
      body: JSON.stringify(data),
      ...restConfig
    }).then(res => res.json())
  }

  return request
}