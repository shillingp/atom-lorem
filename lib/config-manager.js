"use babel";

export var DEFAULT_CONFIG;
export var SPLIT_REG_EXP;

function updateConfig() {
  const currentConf = atom.config.get("lorem.defaults");
  const splitRegExp = atom.config.get("lorem.commands.splitRegExp");

  if (currentConf) {
    currentConf.unitType = ({
      Paragraph: "paragraph",
      Sentence: "sentence",
      Word: "word",
      Link: "link",
      "Ordered List": "orderedList",
      "Unordered List": "unorderedList"
    })[currentConf.unitType];
    currentConf.unitSize = ({
      Any: 0,
      Short: 1,
      Medium: 2,
      Long: 3,
      "Very Long": 4
    })[currentConf.unitSize];

    DEFAULT_CONFIG = Object.assign({}, currentConf);
  }

  if (splitRegExp) {
    SPLIT_REG_EXP = new RegExp(splitRegExp.join("|"));
  }
}

atom.config.onDidChange("lorem", updateConfig);
