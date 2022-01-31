let counter = 0;

export const setCounter = (v: number): void => {
  counter = v;
}

export const getNextId = (): number => {
  return ++counter;
}