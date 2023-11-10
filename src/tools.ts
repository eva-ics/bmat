/**
 * Deeply merges an object
 *
 * @param {object} obj1 - object to be merged
 * @param {object} obj2 - object to merge with
 *
 * @returns {object}
 */
export const deepMerge = (obj1: object, obj2: object): object => {
  let result: any = { ...obj1 };
  for (const key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (
        typeof (obj2 as any)[key] === "object" &&
        (obj2 as any)[key] !== null &&
        !Array.isArray((obj2 as any)[key])
      ) {
        if (
          typeof result[key] === "object" &&
          result[key] !== null &&
          !Array.isArray(result[key])
        ) {
          result[key] = deepMerge(result[key], (obj2 as any)[key]);
        } else {
          result[key] = deepMerge({}, (obj2 as any)[key]);
        }
      } else {
        result[key] = (obj2 as any)[key];
      }
    }
  }
  return result;
};
