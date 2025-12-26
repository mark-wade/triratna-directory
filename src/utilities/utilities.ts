export function arraysEqual(arr1: string[], arr2: string[]) {
  if (arr1.length !== arr2.length) return false;
  const sortedArr2 = arr2.sort();
  return arr1.sort().every((value, index) => value === sortedArr2[index]);
}

export function arrayContainsAny(arr1: string[], arr2: string[]) {
  for (const v of arr2) {
    if (arr1.includes(v)) {
      return true;
    }
  }
  
  return false;
}