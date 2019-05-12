export function cloneInstance<T>(original: T): T {
  return Object.assign(
    Object.create(Object.getPrototypeOf(original)),
    original
  );
}
