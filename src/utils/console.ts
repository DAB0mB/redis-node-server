export const writeLog = (...messages: unknown[]) => {
  console.log(new Date(), ...messages);
};

export const writeWarn = (...messages: unknown[]) => {
  console.warn(new Date(), ...messages);
};

export const writeInfo = (...messages: unknown[]) => {
  console.info(new Date(), ...messages);
};

export const writeDebug = (...messages: unknown[]) => {
  console.debug(new Date(), ...messages);
};

export const writeError = (...messages: unknown[]) => {
  console.error(new Date(), ...messages);
};
