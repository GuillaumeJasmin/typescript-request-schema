export type ObjectParams<Obj extends any, Key extends string, KeyValue extends string = Key> =
  Obj[Key] extends (object | string | number | boolean)
    ? { [T in KeyValue]: Obj[Key] }
    : Obj[Key] extends (void | null | object)
      ? { [T in KeyValue]?: Obj[Key] }
      : { [T in KeyValue]?: null }

export type FnParams<Obj extends any, KeyURLConfig extends keyof Obj, KeyValue extends string> =
  Obj[KeyURLConfig] extends Function
    ? Parameters<Obj[KeyURLConfig]>[0] extends object
        ? { [T in KeyValue]: Parameters<Obj[KeyURLConfig]>[0] }
        : { [T in KeyValue]?: null }
    : { [T in KeyValue]?: null }

export const methods = {
  DELETE: 'DELETE',
  GET: 'GET',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS',
  PATCH: 'PATCH',
  POST: 'POST',
  PUT: 'PUT',
}

type Method = string

interface ConfInterface {
  RouteNameKey: string;
  PathParamsKey: string;
  QueryParamsKey: string;
  URLKey: string;
  DataKey: string;
  ResponseKey: string;
  MethodKey: string;
}

export interface DefaultConf {
  RouteNameKey: 'name';
  PathParamsKey: 'pathParams';
  QueryParamsKey: 'queryParams';
  URLKey: 'url';
  DataKey: 'data';
  ResponseKey: 'response';
  MethodKey: 'method';
}

type InputConfigItem<Conf extends ConfInterface> =
  { method: Method; }
  & { [Key in Conf['URLKey']]: string | ((params: any) => string)  }
  & { [Key in Conf['QueryParamsKey']]: object | null | void }
  & { [Key in Conf['DataKey']]: object | null | void }
  & { [Key in Conf['ResponseKey']]: object | null | void }

interface InputConfig<Conf extends ConfInterface> {
  [key: string]: InputConfigItem<Conf>
}

export type GetConfig<
  Schema extends InputConfig<UserConf>,
  SchemaKeys extends keyof Schema,
  OtherProperties,
  UserConf extends ConfInterface = DefaultConf,
> =
  { [key in UserConf['RouteNameKey']]: SchemaKeys }
    & FnParams<Schema[SchemaKeys], UserConf['URLKey'], UserConf['PathParamsKey']>
    & ObjectParams<Schema[SchemaKeys], UserConf['QueryParamsKey']>
    & ObjectParams<Schema[SchemaKeys], UserConf['DataKey']>
    & Omit<
      OtherProperties,
        | UserConf['RouteNameKey']
        | UserConf['URLKey']
        | UserConf['PathParamsKey']
        | UserConf['QueryParamsKey']
        | UserConf['DataKey']
        | UserConf['MethodKey']
      >

export type GetOutput<RouteName extends any, TSchema extends any> = TSchema[RouteName]['response']

export function validSchema(item: InputConfig<DefaultConf>) {}
