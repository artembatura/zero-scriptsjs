export function cloneInstance(original: object) {
  return Object.assign(
    Object.create(Object.getPrototypeOf(original)),
    original
  );
}
