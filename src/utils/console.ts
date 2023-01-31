export const log = (...messages: unknown[]) => {
  console.log(new Date(), ...messages);
};

export const warn = (...messages: unknown[]) => {
  console.warn(new Date(), ...messages);
};

export const info = (...messages: unknown[]) => {
  console.info(new Date(), ...messages);
};

export const debug = (...messages: unknown[]) => {
  console.debug(new Date(), ...messages);
};

export const error = (...messages: unknown[]) => {
  console.error(new Date(), ...messages);
};
