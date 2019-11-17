<div align="center">
  <h1>
    Axios Schema
    <br/>
    <br/>
  </h1>
    <br/>
    <a href="https://www.npmjs.com/package/axios-schema">
      <img src="https://img.shields.io/npm/v/axios-schema.svg" alt="npm package" />
    </a>
    <br/>
    <br/>
    <br/>
    Axios schema for TypeScript Intellisense
    <br/>
  <br/>
  <br/>
  <pre>npm i <a href="https://www.npmjs.com/package/react-resources-store">axios-schema</a></pre>
  <br/>
  <br/>
</div>


Axios Schema make possible to define your schema in one place and then use `axios.request()` without the need to type output for each request. It also add new types like `urlParams`, `params` and `data`.

## Example

```js
import { createAxiosTSInstance } from 'axios-schema'

const schema = {
  'GET users': {
    url: 'users',
    method: 'GET',
    params: {} as {
      page?: number,
      pageSize?: number,
    },
    data: null,
    response: {} as {
      id: string,
      username: string,
      email: string
    }[]
  },
  'PATCH users/:id': {
    url: (params: { id: string }) => `users/${params.id}`,
    method: 'PATCH',
    params: null,
    data: {} as {
      username?: string,
      email?: string
    },
    response: {} as {
      id: string,
      username: string,
      email: string
    }
  },
}

const api = createAxiosTSInstance({ baseURL: '...' }, schema)

const users = await api.request({
  routeName: 'GET users',
  urlParams: {
    page: 1,
    pageSize: 10,
  },
})
```

## TypeScript IntelliSense

* `routeName`  
![Route Name](./img/routeName.png)

* `data`  
![Data](./img/data.png)

* `params`  
![Params](./img/params.png)

* `urlParams`  
![URL Params](./img/urlParams.png)

* `response`  
![Response](./img/responseAwait.png)

## Things to know

### Required and Omited request properties
`axios-schema` required 2 new properties on axios request config and omit 2 others.

It required:
  * `routeName` - use to get correct config
  * `urlParams` - object with params for url

It omit:
  * `url`
  * `method`

Theses 2 keys are already define in the schema

### Schema keys names

Each keys of the `schema` object can be named like you want. In examples, names are `GET users`, `GET users/:id`, but you can named it `GET_users`, `users get`, `retrieve users`, `update users/id`, etc. Keys are use by TypeScript to find the correct route schema, so it's completely arbitrary


## Under the hood

`createAxiosTSInstance()` do 3 things:
* create Axios instance
* add interceptor
* type output

```js
export function createAxiosTSInstance<T, Instance = AxiosTSInstance<keyof T, T>>(
  axiosConfig: AxiosRequestConfig, schema: T
): Instance {

  const api: Instance = axios.create(axiosConfig)

  addAxiosTsInterceptor(api, schema)

  return api;
}
```