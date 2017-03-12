"use babel";

export var DEFAULT_CONFIG;
export var SPLIT_REG_EXP;

const escapeRegExp = str =>
  str.replace(/[\[\]\/\{\}\(\)\*\+\?\.\\\^\$]/g, "\\$&");

let watcher;

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

  const reg = commandConf.splitRegExp.join("|");

  DEFAULT_CONFIG = currentConf;
  SPLIT_REG_EXP = new RegExp(escapeRegExp(reg));
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
