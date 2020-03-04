<div align="center">
  <h1>
    TypeScript Object Schema
    <br/>
    <br/>
  </h1>
  <br/>
  <a href="https://www.npmjs.com/package/typescript-object-schema">
    <img src="https://img.shields.io/npm/v/typescript-object-schema.svg" alt="npm package" />
  </a>
  <br/>
  <br/>
  <br/>
  Use the powerful of TypeScript Intellisense<br/>
  <br/>
  <br/>
  <pre>npm i <a href="https://www.npmjs.com/package/typescript-object-schema">typescript-object-schema</a></pre>
  <br/>
  <br/>
</div>

* [Motivation](#motivation)
* [Tutorial](#tutorial)
* [Code examples](#examples)
  * [fetch](#fetch)
  * [axios](#examples)
* [IntelliSense examples](#intellisense-examples)
* [Things to know](#things-to-know)

## Motivation

TypeScript is a powerful assistant when your are developping, with autocomplete suggestion and complilation errors. I made some utils to define a schema object and then avoid to always import types or interfaces if your shema doesn't change.

## Tutorial

My use case come from HTTP request pattern. Our REST API schema is always the same and can be define in one place in the application. Let's see our requirement for make HTTP request:

- the request need an `url` to work correctly.
- the request have a specific `method`, like GET, POST, PATCH...
- the url can contain `path params`, like a resource id.
- the url can contain `query params`, like a pagination
- the request can contain `data` (or `body`)
- the request contain a `response`, with always the same data types

Some of these data are dynamics, and others never change. `url` and `method` never change, while `path params`, `query params`, `data` and `response` depends on the context.

Let's define our schema:

```ts
const schema = {
  'PATCH users/:id': {
    url: (pathParams: { id: string }) => `users/${pathParams.id}`,
    method: 'PATCH',
    queryParams: null,
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
```

*Wait, what is that object ? Is a plain JavaScript object or a TypeScript definition ?*

It's both !

Technicaly, it's a plain JavaScript object, but it's also used as TypeScript definition for some keys with the powerful of `as` TypeScript keyword.

Now, let's build a `request()` function, base on native `fetch` browser:

```js
import queryString from 'query-string'

function request(config) {
  const {
    url,
    method,
    data,
    queryParams,
    ...restConfig
  } = config

  const baseURL = 'https://api.com'
  const queryParamsStr = queryString.stringify(queryParams)
  let fullURL = `${baseURL}/${url}`
  if (Object.keys(queryParamsStr).length) {
    fullURL += `?${queryParamsStr}`
  }

  return fetch(fullURL, {
    method,
    body: JSON.stringify(data),
    ...restConfig
  }).then(res => res.json())
}
```

It's a very basic function with some data handling, like stringify `query params` and `data`, concat `baseURL` and return a promise with plain JavaScript object.

Currently, TypeScript doesn't know anything about the request schema. It could be usefull if TS can autocomplete config data depends on the request ?

`typescript-object-schema` provide 2 utils types to build a powerfull config schema:

```js
import { GetConfig, GetOutput } from 'typescript-object-schema'
```

```ts
type Schema = typeof shema
type RouteName = keyof Schema
type FetchParams = NonNullable<Parameters<typeof fetch>[1]>

function request<T extends RouteName>(config: GetConfig<Schema, T, FetchParams>): Promise<GetOutput<T, Schema>> {
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
  } = apiSchema[name]

  const finalQueryParams = {
    ...defaultQueryParams,
    ...queryParams,
  }

  const urlWithPathParams = typeof url === 'function' && pathParams
    ? url(pathParams)
    : url

  const baseURL = 'https://api.com'
  const queryParamsStr = queryString.stringify(finalQueryParams)
  let fullURL = `${baseURL}/${urlWithPathParams}`
  if (Object.keys(queryParamsStr).length) {
    fullURL += `?${queryParamsStr}`
  }

  return fetch(fullURL, {
    method,
    body: JSON.stringify(data),
    ...restConfig
  }).then(res => res.json())
}
```

Now TypeScript can infer and automcomplete the config and response.

Usages:

```ts
const updatedUser = await request({
  name: 'PATCH users/:id',
  data: {
    email: '...',
  }
})
```

## IntelliSense examples

* `name`  
![Name](./img/name.png)

* `data`  
![Data](./img/data.png)

* `queryParams`  
![queryParams](./img/queryParams.png)

* `response`  
![Response](./img/response.png)

* `othersProperties`  
![Response](./img/othersProperties.png)

## Things to know

### Schema keys names

Each keys of the `schema` object can be named like you want. In examples, names are `GET users`, `GET users/:id`, but you can named it `GET_users`, `users get`, `retrieve users`, `update users/id`, etc. Keys are use by TypeScript to find the correct route schema, so it's completely arbitrary. TypeScript will autocomplete keys for you, so even with a complicated format like `GET users/:id`, you don't have to remember it.
