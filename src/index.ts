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

export type Extends<Obj extends any, ExtendsObj> = Omit<ExtendsObj, keyof Obj>
