<div align="center">
  <h1>
    TS REST Schema
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
  It's time to type your HTTP request<br/>
  <br/>
  <br/>
  <pre>npm i <a href="https://www.npmjs.com/package/typescript-object-schema">typescript-object-schema</a></pre>
  <br/>
  <br/>
</div>

* [Motivation](#motivation)
* [Code examples](#examples)
  * [fetch](#fetch)
  * [axios](#examples)
* [IntelliSense examples](#intellisense-examples)
* [Things to know](#things-to-know)

## Motivation

API request have always the same data type: `url`, `method`, `query params`, `body`, and `response`. This package aim to easily define their types and default params.

Let's take an common request example:

```js
import axios from 'axios'

interface Article {
  ...
}

const article = await axios.request<Article>({
  url: `http://api.com/articles/${id}?accessToken=${token}`,
  method: 'PATCH',
  data: {
    title: 'new title'
  }
})
```

**Issues:**

- need to typed the return data on the fly
- no types for path params
- no type for query params
- no type for data

I use axios for the example, but it's the same for fetch(), or maybe others request libraries.

*Note*: in a real world, `accessToken` is not define here, but you got it.

## Proposal

Now, imagine a `request` method, fully typed, without need to define type on the fly:

```js
const article = await request({
  name: 'updateArticle',
  pathParams: {
    id: '...'
  },
  queryParams: {
    accessToken: '...'
  },
  data: {
    title: 'new title'
  }
})
```

If you have already work with TypeScript and GraphQL, you know what I am talking about, your API is fully typed thanks to tools like [graphql-code-generator](https://github.com/dotansimha/graphql-code-generator).  

But when you work with a REST API, you haven't always auto generated TS interfaces.

## Schema

Let's go to define our schema:

```ts
export const schema = {
  updateArticle: {
    url: (pathParams: { id: string; }) => `articles/${pathParams.id}`,
    method: 'PATCH',
    queryParams: {} as {
      accessToken: string;
    },
    data: {} as {
      title?: string;
      content?: string;
    },
    response: {} as {
      id: string;
      title: string;
      content: string;
      updatedAt: string;
    }
  }
}
```

This object schema will be used as plain JavaScript object and TypeScript definition, thanks to `as` keyword

## Request

Now, let's build our request function:

```js
import { AxiosRequestConfig, AxiosPromise } from 'axios'
import { Input, Output } from 'typescript-rest-schema'
import { schema } from './schema'

type Schema = typeof schema
type RequestName = keyof Schema
type ExtraConfig = AxiosRequestConfig
type RequestConfig<T> = Input<T, Schema, ExtraConfig>
type RequestOutput<T, X extends void> = AxiosPromise<Output<T, Schema>>

function request<T extends RequestName>(config: RequestConfig<T>): RequestOutput<T> {
  const { name, pathParams, queryParams, data, ...restConfig } = config
  const { url, method } = apiSchema[name]
  const urlWithPathParams = (typeof url === 'function' && pathParams)
    ? url(pathParams)
    : url as string

  return axios.request({
    url: urlWithPathParams,
    method,
    data,
    params: queryParams,
    ...restConfig
  })
}
```

Now, your `request` function is fully typed !

## API

* `Input<RequestName, Schema, ExtraConfig>`
* `Output<RequestName, Schema>`

## IntelliSense examples

*Note*: on the following screen shots, request names are not the same than the previous examples. You can use any name format for your resquest name.

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
