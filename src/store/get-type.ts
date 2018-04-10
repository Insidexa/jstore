export function getType(value: any): string {
  return ({}).toString.call(value).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}