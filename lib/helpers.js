'use babel';


function arraySize(size) {
  return Array.apply(null, {length: size});
}

function arrayOfSize(size) {
  return Array.apply(null, {length: size});
}

function randNth(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}


export { arraySize, arrayOfSize, randNth };
