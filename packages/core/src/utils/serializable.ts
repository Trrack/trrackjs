type JsonArray = Array<AnyJson>;

type JsonMap = { [key: string]: AnyJson };

export type AnyJson = boolean | number | string | null | JsonArray | JsonMap;

export function toNull<T>(val: T) {
  return val === undefined ? null : val;
}

export function toDateJson(date: Date): string {
  return date.toJSON();
}

export function fromDateJson(date: string): Date {
  const parsedDate = new Date(date);

  if (parsedDate.getTime() === parsedDate.getTime()) return parsedDate;

  throw new Error(`Invalid date object detected ${date}`);
}

export interface ISerializable {
  toJson(): AnyJson;
}

export interface IDeserializable {
  fromJson(json: AnyJson): IDeserializable;
}
