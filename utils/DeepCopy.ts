/**
 * @return make a deep copy of a given object, copying also methods
 * Thanks to https://javascript.plainenglish.io/deep-clone-an-object-and-preserve-its-type-with-typescript-d488c35e5574
 */
export default function deepCopy<T>(source: T): T {
  return Array.isArray(source)
    ? source.map((item) => deepCopy(item))
    : source instanceof Date
      ? new Date(source.getTime())
      : source && typeof source === 'object'
        ? Object.getOwnPropertyNames(source).reduce(
            (o, prop) => {
              Object.defineProperty(o, prop, Object.getOwnPropertyDescriptor(source, prop)!)
              o[prop] = deepCopy((source as { [key: string]: any })[prop])
              return o
            },
            Object.create(Object.getPrototypeOf(source))
          )
        : (source as T)
}
