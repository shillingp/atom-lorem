'use babel';


function arrayOfSize(size) {
  return Array.apply(null, {length: size});
}

function randNth(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}


export { arrayOfSize, randNth };
