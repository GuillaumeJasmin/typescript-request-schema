# TypeScript Axios Schema

```js
import { Method } from 'axios';

const schema = {
  'GET users': {
    url: () => 'users',
    method: 'GET' as Method,
    params: {} as {
      page?: number,
      pageSize?: number,
    },
    data: null as void,
    response: {} as {
      id: string,
      username: string,
      email: string
    }[]
  },
}
```

## Quick setup
```js
import { createAxiosTSInstance } from 'ts-axios'

const api = createAxiosTSInstance({ baseUrl: '...' }, schema)

const users = await api.request({
  routeName: 'GET users',
  urlParams: {
    page: 1,
    pageSize: 10,
  },
})
```

## Under the hood
```js
export function createAxiosTSInstance<T, Instance = AxiosTSInstance<keyof T, T>>(
  axiosConfig: AxiosRequestConfig, schema: T
): Instance {

  const api: Instance = axios.create(axiosConfig)

  addAxiosTsInterceptor(api, schema)

  return api;
}
```