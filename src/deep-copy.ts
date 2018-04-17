export function deepCopy<T>(object: T): T {
  return <T>JSON.parse(JSON.stringify(object));
}