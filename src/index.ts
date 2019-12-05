export type ObjectParams<Obj extends any, Key extends string> =
  Obj[Key] extends (object | string | number | boolean)
    ? { [T in Key]: Obj[Key] }
    : Obj[Key] extends (void | null | object)
      ? { [T in Key]?: Obj[Key] }
      : { [T in Key]?: null }

export type FnParams<Obj extends any, KeyURLConfig extends keyof Obj, KeyValue extends string> =
  Obj[KeyURLConfig] extends Function
    ? Parameters<Obj[KeyURLConfig]>[0] extends object
        ? { [T in KeyValue]: Parameters<Obj[KeyURLConfig]>[0] }
        : { [T in KeyValue]?: null }
    : { [T in KeyValue]?: null }

export type PrimaryKey<KeyValue extends string, KeyName extends string> = {
  [T in KeyName]: KeyValue
}

export type Extends<Obj extends any, ExtendsObj> = Omit<ExtendsObj, keyof Obj>