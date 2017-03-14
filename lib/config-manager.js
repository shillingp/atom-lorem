"use babel";

export var DEFAULT_CONFIG;
export var SPLIT_REG_EXP;

let watcher;

/**
 * @param {Array} splits
 * @returns {RegExp} a set of `splits` with escaped symbols
 */
const escapeArrayToRegExp = splits => {
  const reg = [...new Set(splits)]
    .map(c => c.replace(/[\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"))
    .join("|");

  return new RegExp(reg);
};

/**
 * @param {Object} newValue
 * @param {Object} newValue.defaults
 * @param {Object} newValue.commands
 */
function updateConfig(newValue) {
  const currentConf = Object.assign({}, newValue.defaults);
  const commandConf = Object.assign({}, newValue.commands);

  currentConf.unitType = ({
    Paragraph: "paragraph",
    Sentence: "sentence",
    Word: "word",
    Link: "link",
    "Ordered List": "orderedList",
    "Unordered List": "unorderedList",
  })[currentConf.unitType];
  currentConf.unitSize = ({
    Any: 0,
    Short: 1,
    Medium: 2,
    Long: 3,
    "Very Long": 4,
  })[currentConf.unitSize];

  DEFAULT_CONFIG = currentConf;
  SPLIT_REG_EXP = escapeArrayToRegExp(commandConf.splitRegExp);
}

atom.packages.onDidDeactivatePackage(({ name }) => {
  if (name == "lorem") {
    watcher.dispose();
  }
});

atom.packages.onDidActivatePackage(pack => {
  if (pack.name === "lorem") {
    watcher = atom.config.observe("lorem", updateConfig);
  }
});
