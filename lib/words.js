"use babel";

export const SIZE_ANY = 0;
export const SIZE_SHORT = 1;
export const SIZE_MEDIUM = 2;
export const SIZE_LONG = 3;
export const SIZE_VERY_LONG = 4;

export var DEFAULT_CONFIG;

// window.setTimeout(
//   () => {
//     const DEFAULT_UNIT_TYPE = ({
//       Paragraph: "paragraph",
//       Sentence: "sentence",
//       Word: "word",
//       Link: "link",
//       "Ordered List": "orderedList",
//       "Unordered List": "unorderedList"
//     })[atom.config.get("lorem.defaultUnitType")];
//     const DEFAULT_UNIT_SIZE = ({
//       Any: 0,
//       Short: 1,
//       Medium: 2,
//       Long: 3,
//       "Very Long": 4
//     })[atom.config.get("lorem.defaultUnitSize")];
//
//     const DEFAULT_UNIT_COUNT = atom.config.get("lorem.defaultUnitCount");
//     const DEFAULT_IS_WRAPPED = atom.config.get("lorem.defaultIsWrapped");
//     const DEFAULT_WRAP_WIDTH = atom.config.get("lorem.defaultWrapWidth");
//     const DEFAULT_IS_HTML = atom.config.get("lorem.defaultIsHTML");
//     const DEFAULT_SHOW_HELP = atom.config.get("lorem.defaultShowHelp");
//
//     DEFAULT_CONFIG = {
//       unitType: DEFAULT_UNIT_TYPE,
//       unitCount: DEFAULT_UNIT_COUNT,
//       unitSize: DEFAULT_UNIT_SIZE,
//       isWrapped: DEFAULT_IS_WRAPPED,
//       wrapWidth: DEFAULT_WRAP_WIDTH,
//       isHTML: DEFAULT_IS_HTML,
//       showHelp: DEFAULT_SHOW_HELP
//     };
//   },
//   100
// );
//
// atom.config.observe("lorem", (conf) => console.log(conf))
// atom.config.onDidChange("lorem", (conf) => console.log(conf))

function updateConfig() {
  const DEFAULT_UNIT_TYPE = ({
    Paragraph: "paragraph",
    Sentence: "sentence",
    Word: "word",
    Link: "link",
    "Ordered List": "orderedList",
    "Unordered List": "unorderedList"
  })[atom.config.get("lorem.defaultUnitType")];
  const DEFAULT_UNIT_SIZE = ({
    Any: 0,
    Short: 1,
    Medium: 2,
    Long: 3,
    "Very Long": 4
  })[atom.config.get("lorem.defaultUnitSize")];

  const DEFAULT_UNIT_COUNT = atom.config.get("lorem.defaultUnitCount");
  const DEFAULT_IS_WRAPPED = atom.config.get("lorem.defaultIsWrapped");
  const DEFAULT_WRAP_WIDTH = atom.config.get("lorem.defaultWrapWidth");
  const DEFAULT_IS_HTML = atom.config.get("lorem.defaultIsHTML");
  const DEFAULT_SHOW_HELP = atom.config.get("lorem.defaultShowHelp");

  DEFAULT_CONFIG = {
    unitType: DEFAULT_UNIT_TYPE,
    unitCount: DEFAULT_UNIT_COUNT,
    unitSize: DEFAULT_UNIT_SIZE,
    isWrapped: DEFAULT_IS_WRAPPED,
    wrapWidth: DEFAULT_WRAP_WIDTH,
    isHTML: DEFAULT_IS_HTML,
    showHelp: DEFAULT_SHOW_HELP
  };
}

window.setTimeout(updateConfig, 10);
atom.config.observe("lorem", updateConfig);

// export const FORTUNE_FILE_ARRAY  = require("text!fortunes.txt").split("%");

export const HELP_URL = "https://github.com/shillingp/atom-lorem#how-to-use";

// --- Private members
export const allSizes = [SIZE_SHORT, SIZE_MEDIUM, SIZE_LONG, SIZE_VERY_LONG];

const shortWords = [
  // Words with less than four letters
  "a", "ab", "ad", "an", "aut", "de", "do", "e", "ea", "est", "et",
  "eu", "ex", "hic", "id", "iis", "in", "ita", "nam", "ne", "non",
  "o", "qui", "quo", "se", "sed", "si", "te", "ubi", "ut"
];

const mediumWords = [
  // Words with four to six letters
  "amet", "aliqua", "anim", "aute", "cillum", "culpa", "dolor", "dolore", "duis",
  "elit", "enim", "eram", "esse", "fore", "fugiat", "illum", "ipsum", "irure",
  "labore", "legam", "lorem", "magna", "malis", "minim", "multos", "nisi",
  "noster", "nulla", "quae", "quem", "quid", "quis", "quorum", "sint", "summis",
  "sunt", "tamen", "export constias", "velit", "veniam"
];

const longWords = [
  // Words with seven to ten letters
  "admodum", "aliquip", "appellat", "arbitror", "cernantur", "commodo", "consequat",
  "cupidatat", "deserunt", "doctrina", "eiusmod", "excepteur", "expetendis", "fabulas",
  "incididunt", "incurreret", "ingeniis", "iudicem", "laboris", "laborum", "litteris",
  "mandaremus", "mentitum", "nescius", "nostrud", "occaecat", "officia", "offendit",
  "pariatur", "possumus", "probant", "proident", "quamquam", "quibusdam", "senserit",
  "singulis", "tempor", "ullamco", "vidisse", "voluptate"
];

const veryLongWords = [
  // Words with more than ten letters
  "adipisicing", "arbitrantur", "cohaerescant", "comprehenderit", "concursionibus",
  "coniunctione", "consectetur", "despicationes", "distinguantur", "domesticarum",
  "efflorescere", "eruditionem", "exquisitaque", "exercitation", "familiaritatem",
  "fidelissimae", "firmissimum", "graviterque", "illustriora", "instituendarum",
  "imitarentur", "philosophari", "praesentibus", "praetermissum", "relinqueret",
  "reprehenderit", "sempiternum", "tractavissent", "transferrem", "voluptatibus"
];

export const wordLists = [shortWords, mediumWords, longWords, veryLongWords];
export const allWords = [].concat.apply([], wordLists);

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
