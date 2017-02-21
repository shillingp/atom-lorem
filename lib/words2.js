'use babel';

export const SIZE_ANY        = 0;
export const SIZE_SHORT      = 1;
export const SIZE_MEDIUM     = 2;
export const SIZE_LONG       = 3;
export const SIZE_VERY_LONG  = 4;

export const DEFAULT_UNIT_TYPE   = "paragraph";
export const DEFAULT_UNIT_COUNT  = 1;
export const DEFAULT_UNIT_SIZE   = SIZE_MEDIUM;
export const DEFAULT_IS_WRAPPED  = true;
export const DEFAULT_WRAP_WIDTH  = 80;
export const DEFAULT_IS_HTML     = false;
export const DEFAULT_SHOW_HELP   = false;

export const DEFAULT_CONFIG = {
  unitType:   DEFAULT_UNIT_TYPE,
  unitCount:  DEFAULT_UNIT_COUNT,
  unitSize:   DEFAULT_UNIT_SIZE,
  isWrapped:  DEFAULT_IS_WRAPPED,
  wrapWidth:  DEFAULT_WRAP_WIDTH,
  isHTML:     DEFAULT_IS_HTML,
  showHelp:   DEFAULT_SHOW_HELP
};

// export const FORTUNE_FILE_ARRAY  = require("text!fortunes.txt").split("%");

export const HELP_URL = "https://github.com/lkcampbell/brackets-lorem-ipsum#how-to-use-lorem-ipsum-generator";

// --- Private members
export const allSizes = [ SIZE_SHORT, SIZE_MEDIUM, SIZE_LONG, SIZE_VERY_LONG ];

export const shortWords     = [ // Words with less than four letters
  "a", "ab", "ad", "an", "aut", "de", "do", "e", "ea", "est",
  "et", "eu", "ex", "hic", "id", "iis", "in", "ita", "nam", "ne",
  "non", "o", "qui", "quo", "se", "sed", "si", "te", "ubi", "ut"
];

export const mediumWords    = [ // Words with four to six letters
  "amet", "aliqua", "anim", "aute", "cillum", "culpa", "dolor",
  "dolore", "duis", "elit", "enim", "eram", "esse", "fore",
  "fugiat", "illum", "ipsum", "irure", "labore", "legam",
  "lorem", "magna", "malis", "minim", "multos", "nisi",
  "noster", "nulla", "quae", "quem", "quid", "quis", "quorum",
  "sint", "summis", "sunt", "tamen", "export constias", "velit", "veniam"
];

export const longWords      = [ // Words with seven to ten letters
  "admodum", "aliquip", "appellat", "arbitror", "cernantur",
  "commodo", "consequat", "cupidatat", "deserunt", "doctrina",
  "eiusmod", "excepteur", "expetendis", "fabulas", "incididunt",
  "incurreret", "ingeniis", "iudicem", "laboris", "laborum",
  "litteris", "mandaremus", "mentitum", "nescius", "nostrud",
  "occaecat", "officia", "offendit", "pariatur", "possumus",
  "probant", "proident", "quamquam", "quibusdam", "senserit",
  "singulis", "tempor", "ullamco", "vidisse", "voluptate"
];

export const veryLongWords  = [ // Words with more than ten letters
  "adipisicing", "arbitrantur", "cohaerescant", "comprehenderit",
  "concursionibus", "coniunctione", "consectetur", "despicationes",
  "distinguantur", "domesticarum", "efflorescere", "eruditionem",
  "exquisitaque", "exercitation", "familiaritatem", "fidelissimae",
  "firmissimum", "graviterque", "illustriora", "instituendarum",
  "imitarentur", "philosophari", "praesentibus", "praetermissum",
  "relinqueret", "reprehenderit", "sempiternum", "tractavissent",
  "transferrem", "voluptatibus"
];

// export const allWords = _shortWords.concat(_mediumWords, _longWords, _veryLongWords);
export const wordLists = [shortWords, mediumWords, longWords, veryLongWords];
export const allWords = [].concat.apply([], wordLists);
export const mapped = allSizes
  .map((e, i) => [e, wordLists[i]])
  .reduce((o, [key, val]) => {
    o[key] = val;
    return o;
  });

// Sentence fragment patterns, based off of randomly selected Latin phrases.
// Used to build all sentences and paragraphs.
export const fragmentPatterns = [
  // Three words
  [SIZE_SHORT, SIZE_MEDIUM, SIZE_LONG],
  [SIZE_SHORT, SIZE_MEDIUM, SIZE_VERY_LONG],
  [SIZE_SHORT, SIZE_SHORT, SIZE_VERY_LONG],
  [SIZE_SHORT, SIZE_LONG, SIZE_VERY_LONG],
  [SIZE_MEDIUM, SIZE_LONG, SIZE_LONG],
  [SIZE_MEDIUM, SIZE_LONG, SIZE_VERY_LONG],
  [SIZE_MEDIUM, SIZE_SHORT, SIZE_LONG],
  [SIZE_LONG, SIZE_SHORT, SIZE_MEDIUM],
  [SIZE_LONG, SIZE_SHORT, SIZE_LONG],
  [SIZE_LONG, SIZE_MEDIUM, SIZE_LONG],

  // Four words
  [SIZE_SHORT, SIZE_SHORT, SIZE_MEDIUM, SIZE_LONG],
  [SIZE_SHORT, SIZE_MEDIUM, SIZE_SHORT, SIZE_MEDIUM],
  [SIZE_SHORT, SIZE_MEDIUM, SIZE_LONG, SIZE_LONG],
  [SIZE_SHORT, SIZE_MEDIUM, SIZE_LONG, SIZE_VERY_LONG],
  [SIZE_SHORT, SIZE_LONG, SIZE_SHORT, SIZE_LONG],
  [SIZE_MEDIUM, SIZE_LONG, SIZE_SHORT, SIZE_LONG],
  [SIZE_MEDIUM, SIZE_LONG, SIZE_SHORT, SIZE_VERY_LONG],
  [SIZE_LONG, SIZE_SHORT, SIZE_MEDIUM, SIZE_LONG],
  [SIZE_LONG, SIZE_MEDIUM, SIZE_LONG, SIZE_LONG],
  [SIZE_LONG, SIZE_VERY_LONG, SIZE_SHORT, SIZE_LONG],

  // Five words
  [SIZE_SHORT, SIZE_SHORT, SIZE_MEDIUM, SIZE_MEDIUM, SIZE_MEDIUM],
  [SIZE_SHORT, SIZE_MEDIUM, SIZE_MEDIUM, SIZE_SHORT, SIZE_LONG],
  [SIZE_SHORT, SIZE_MEDIUM, SIZE_MEDIUM, SIZE_MEDIUM, SIZE_LONG],
  [SIZE_MEDIUM, SIZE_SHORT, SIZE_SHORT, SIZE_MEDIUM, SIZE_LONG],
  [SIZE_MEDIUM, SIZE_SHORT, SIZE_LONG, SIZE_SHORT, SIZE_MEDIUM],
  [SIZE_MEDIUM, SIZE_LONG, SIZE_SHORT, SIZE_MEDIUM, SIZE_MEDIUM],
  [SIZE_MEDIUM, SIZE_VERY_LONG, SIZE_LONG, SIZE_MEDIUM, SIZE_LONG],
  [SIZE_LONG, SIZE_MEDIUM, SIZE_SHORT, SIZE_LONG, SIZE_VERY_LONG],
  [SIZE_LONG, SIZE_MEDIUM, SIZE_MEDIUM, SIZE_SHORT, SIZE_MEDIUM],
  [SIZE_LONG, SIZE_MEDIUM, SIZE_MEDIUM, SIZE_LONG, SIZE_MEDIUM]
];
