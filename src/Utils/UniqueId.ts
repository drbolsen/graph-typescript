const k4 = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

export const uniqueId =
  window && window.crypto && window.crypto.randomUUID
    ? (): string => {
        return window.crypto.randomUUID();
      }
    : (): string => {
        return `${k4()}${k4()}-${k4()}-${k4()}-${k4()}-${k4()}${k4()}${k4()}`;
      };
