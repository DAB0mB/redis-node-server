type AssertType = 'string' | 'number' | { prototype: unknown };
type Assert<T extends AssertType> = T extends 'number' ? number : T extends 'string' ? string : T extends { prototype: infer R } ? R : never;

export function assertGet<T extends AssertType>(object: unknown, type: T): Assert<T> {
  if (typeof type == 'string') {
    if (typeof object != type) {
      throw new Error(`Expected object to be a type of "${type}"`);
    }
    return object as Assert<T>;
  }
  if (typeof type == 'function') {
    if (!(object instanceof type)) {
      throw new Error(`Expected object to be an instance of "${type}"`);
    }
    return object as Assert<T>;
  }
  throw new Error(`Invalid assertion type "${type}"`);
}

export function assertThrow<T extends AssertType>(object: unknown, type: T): asserts object is Assert<T> {
  assertGet<T>(object, type);
}

export function assertExists<T>(object: T, name: string): asserts object is T {
  if (object == null) {
    throw new Error(`Object "${name}" does not exist`);
  }
}
