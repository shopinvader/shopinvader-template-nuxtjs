export default function isEqual(a: any, b: any): boolean {
  // Check if both values are strictly equal, covers primitive types and same object references
  if (a === b) {
    return true
  }
  // If either value is not an object (including function type), they are not equal
  if (typeof a !== 'object' || typeof b !== 'object') {
    return false
  }
  // If either value is null, they are not equal (null is of type 'object')
  if (a === null || b === null) {
    return false
  }
  // If the number of properties is different, objects are not equal
  if (Object.keys(a).length !== Object.keys(b).length) {
    return false
  }
  // Recursively check equality for each key in object 'a'
  for (const key in a) {
    if (!isEqual(a[key], b[key])) {
      return false
    }
  }
  // If all checks passed, objects are considered equal
  return true
}
