export function compact<T extends Record<string, unknown>>(object: T) {
  const clone = Object.assign({}, object);

  for (let key in clone) {
    if (clone[key] === undefined) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete clone[key];
    }
  }

  return clone;
}
