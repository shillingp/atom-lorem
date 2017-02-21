'use babel';


const sizes = {
  a: 0,
  s: 1,
  m: 2,
  l: 3,
  vl: 4
};

const allSizes = [sizes.s, sizes.m, sizes.l, sizes.vl];

const base = {
  type: "paragraph",
  count: 1,
  size: 2
};

const bindings = {
  p: {type: "paragraph"},
  s: {type: "sentence"},
  w: {type: "word"},
  short: {size: sizes.s},
  medium: {size: sizes.m},
  long: {size: sizes.l},
  vlong: {size: sizes.vl}
};

const searchReg = /lorem_.\S*/;

const fragmentPatterns = [
  // Three words
  ["s", "m", "l"], ["s", "m", "vl"], ["s", "s", "vl"],
  ["s", "l", "vl"], ["m", "l", "l"], ["m", "l", "vl"],
  ["m", "s", "l"], ["l", "s", "m"], ["l", "s", "l"],
  ["l", "m", "l"],
  //, Four, words
  ["s", "s", "m", "l"], ["s", "m", "s", "m"],
  ["s", "m", "l", "l"], ["s", "m", "l", "vl"],
  ["s", "l", "s", "l"], ["m", "l", "s", "l"],
  ["m", "l", "s", "vl"], ["l", "s", "m", "l"],
  ["l", "m", "l", "l"], ["l", "vl", "s", "l"],
  //, Five, words
  ["s", "s", "m", "m", "m"], ["s", "m", "m", "s", "l"],
  ["s", "m", "m", "m", "l"], ["m", "s", "s", "m", "l"],
  ["m", "s", "l", "s", "m"], ["m", "l", "s", "m", "m"],
  ["m", "vl", "l", "m", "l"], ["l", "m", "s", "l", "vl"],
  ["l", "m", "m", "s", "m"], ["l", "m", "m", "l", "m"]
].map(arr => arr.map(i => sizes[i]));

const shortWords = ["a", "ab", "ad", "an", "aut", "de", "do", "e", "ea", "est", "et", "eu", "ex", "hic", "id", "iis", "in", "ita", "nam", "ne", "non", "o", "qui", "quo", "se", "sed", "si", "te", "ubi", "ut"];
const mediumWords = ["amet", "aliqua", "anim", "aute", "cillum", "culpa", "dolor", "dolore", "duis", "elit", "enim", "eram", "esse", "fore", "fugiat", "illum", "ipsum", "irure", "labore", "legam", "lorem", "magna", "malis", "minim", "multos", "nisi", "noster", "nulla", "quae", "quem", "quid", "quis", "quorum", "sint", "summis", "sunt", "tamen", "varias", "velit", "veniam"];
const longWords = ["admodum", "aliquip", "appellat", "arbitror", "cernantur", "commodo", "consequat", "cupidatat", "deserunt", "doctrina", "eiusmod", "excepteur", "expetendis", "fabulas", "incididunt", "incurreret", "ingeniis", "iudicem", "laboris", "laborum", "litteris", "mandaremus", "mentitum", "nescius", "nostrud", "occaecat", "officia", "offendit", "pariatur", "possumus", "probant", "proident", "quamquam", "quibusdam", "senserit", "singulis", "tempor", "ullamco", "vidisse", "voluptate"];
const veryLongWords = ["adipisicing", "arbitrantur", "cohaerescant", "comprehenderit", "concursionibus", "coniunctione", "consectetur", "despicationes", "distinguantur", "domesticarum", "efflorescere", "eruditionem", "exquisitaque", "exercitation", "familiaritatem", "fidelissimae", "firmissimum", "graviterque", "illustriora", "instituendarum", "imitarentur", "philosophari", "praesentibus", "praetermissum", "relinqueret", "reprehenderit", "sempiternum", "tractavissent", "transferrem", "voluptatibus"];

const wordLists = [shortWords, mediumWords, longWords, veryLongWords];
const allWords = [].concat.apply([], wordLists);
const mapped = allSizes
  .map((e, i) => [e, wordLists[i]])
  .reduce((o, [key, val]) => {
    o[key] = val; return o;
  }, {});


export { searchReg, bindings, base, sizes, allSizes, mapped, allWords, fragmentPatterns };
