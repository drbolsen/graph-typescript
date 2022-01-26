export const isRequired = (argumentName: string): void => {
  throw new Error(`${argumentName} is a required.`);
};
