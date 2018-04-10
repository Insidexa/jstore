export class StrictTypeException extends Error {
  constructor(message: string = 'Prev type value not equals to current type of value') {
    super(message);
  }
}