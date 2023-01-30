// eslint-disable-next-line @typescript-eslint/ban-types
export const call = <F extends (this: unknown, ...args: unknown[]) => unknown>(fn: F, thisArg: ThisParameterType<F>, ...args: ArgumentsType<F>): ReturnType<F> => {
  return fn.apply(thisArg, args);
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const apply = <F extends (this: unknown, ...args: unknown[]) => unknown>(fn: F, thisArg: ThisParameterType<F>, args: ArgumentsType<F>): ReturnType<F> => {
  return fn.apply(thisArg, args);
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type ArgumentsType<F extends Function> = F extends (...args: infer A) => unknown ? A : never;
