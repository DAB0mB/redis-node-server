export type FunctionType = (this: unknown, ...args: unknown[]) => unknown;
export type ArgumentsType<F extends FunctionType> = F extends (...args: infer A) => unknown ? A : never;

export const call = <F extends FunctionType>(fn: F, thisArg: ThisParameterType<F>, ...args: ArgumentsType<F>): ReturnType<F> => {
  return fn.apply(thisArg, args);
};

export const apply = <F extends FunctionType>(fn: F, thisArg: ThisParameterType<F>, args: ArgumentsType<F>): ReturnType<F> => {
  return fn.apply(thisArg, args);
};
