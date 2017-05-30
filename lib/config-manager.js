"use babel";

export let DEFAULT_CONFIG;
export let SPLIT_REG_EXP;

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
  newValue = Object.assign({}, newValue);
  const { defaults, commands } = newValue;

  defaults.unitType = {
    Paragraph: "paragraph",
    Sentence: "sentence",
    Word: "word",
    Link: "link",
    "Ordered List": "orderedList",
    "Unordered List": "unorderedList",
  }[defaults.unitType];
  defaults.unitSize = {
    Any: 0,
    Short: 1,
    Medium: 2,
    Long: 3,
    "Very Long": 4,
  }[defaults.unitSize];

  DEFAULT_CONFIG = defaults;
  SPLIT_REG_EXP = escapeArrayToRegExp(commands.splitRegExp);
}

atom.packages.onDidActivatePackage(pack => {
  if (pack.name === "lorem") {
    watcher = atom.config.observe("lorem", updateConfig);
  }
});

atom.packages.onDidDeactivatePackage(pack => {
  if (pack.name === "lorem") {
    watcher.dispose();
  }
});
