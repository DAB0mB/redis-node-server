export const call = <F extends (this: unknown, ...args: unknown[]) => unknown>(fn: F, thisArg: ThisParameterType<F>, ...args: ArgumentsType<F>): ReturnType<F> => {
  return fn.apply(thisArg, args);
};

export const apply = <F extends (this: unknown, ...args: unknown[]) => unknown>(fn: F, thisArg: ThisParameterType<F>, args: ArgumentsType<F>): ReturnType<F> => {
  return fn.apply(thisArg, args);
};

export type ArgumentsType<F extends Function> = F extends (...args: infer A) => any ? A : never;
