/**
 * @name makeGetterSetterEnumerable
 * @param thisArg class instance in the constructor
 * @param propName name of getter/setter
 */
// https://medium.com/geekculture/what-is-prototype-and-prototype-property-in-javascript-1ef9256d612f
// Warning !!! Mutates `instance`
export const setPropEnumerable = (
  thisArg: any,
  propName: string,
): void => {
  const prototype = Object.getPrototypeOf(thisArg);
  // Copy the descriptor from prototype
  const descriptor = Object.getOwnPropertyDescriptor(
    prototype,
    propName
  );
  if (descriptor) {
    descriptor.enumerable = true;
    // Assign getterSetter to the instance
    Object.defineProperty(thisArg, propName, descriptor);
  }
};
