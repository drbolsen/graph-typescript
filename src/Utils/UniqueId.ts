const k4 = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

export const uniqueId =
typeof window !== 'undefined' && window.crypto && (window.crypto as any).randomUUID
    ? (): string => {
        return (window.crypto as any).randomUUID();
      }
    : (): string => {
        return `${k4()}${k4()}-${k4()}-${k4()}-${k4()}-${k4()}${k4()}${k4()}`;
      };
