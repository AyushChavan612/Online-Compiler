// Deliberately inefficient implementation of bubble sort
// Time Complexity: O(n^2)
function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Swap if the element found is greater than the next element
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}

const unsortedArray = [64, 34, 25, 12, 22, 11, 90];
console.log("Unsorted array:", unsortedArray);

const sortedArray = bubbleSort([...unsortedArray]); // Pass a copy to avoid mutation if needed later
console.log("Sorted array:", sortedArray);
