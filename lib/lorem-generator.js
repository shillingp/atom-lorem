'use babel';

import { randNth, arraySize } from "./helpers";
import { searchReg, bindings, base, sizes, allSizes, mapped, allWords, fragmentPatterns } from "./words";


export default class LoremGen {
  constructor() {
    this.counter = 0;
    this.config = base;
  }

  errorMessage(arg) {
    // Want this to be an in built atom warning
    return `Error: Invalid option "_${arg}"`;
  }

  randFragment() {
    var pattern = randNth(fragmentPatterns)
    return arraySize(pattern.length).map((_, i) =>
      this.randWord(pattern[i])
    ).join(" ").trim();
  }

  sentenceInter() {
    return Math.random() < 0.5 ?
      ", " : " " + this.randWord(sizes.s) + " "
  }

  sentenceConnector(size) {
    const randSide = () => this.randSentence(size - 1)
    return randSide() + this.sentenceInter() + randSide();
  }



  randWord(size) {
    var arr = size === 0 ? allWords : mapped[size];
    return randNth(arr);
  }

  randSentence(size) {
    switch (size) {
      case 0:
        size = randNth(allSizes);
        return this.randSentence(size);
      case 1:
        return this.randFragment();
      default:
        return this.sentenceConnector(size)
    }
  }

  randParagraph(size) {
    const twice = x => [0, 0].map(() =>
      this.randParagraph(x)).join("")

    if (size === 1) {
      // Make this number random
      return arraySize(4).map(() =>
        this.randSentence(sizes.a)
          .replace(/\b\w/, s => s.toUpperCase()) + ". "
      ).join("");
    } else {
      return twice(size - 1)
    }
  }

hello

  randWords(count) {
    return arraySize(count).map(() =>
      this.randWord(sizes.a) + " "
    ).join("").trim();
  }

  randSentences(count, size) {
    return arraySize(count).map(() =>
      this.randSentence(size)
        .replace(/\b\w/, s => s.toUpperCase()) + ". \n\n"
    ).join("").trim();
  }

  randParagraphs(count, size) {
    return arraySize(count).map(() =>
      this.randParagraph(size) + "\n\n"
    ).join("").trim();
  }



  runCommand({ type, count, size }) {
    console.log(this.config);
    switch (type) {
      case "paragraph":
        return this.randParagraphs(count, size);
      case "sentence":
        return this.randSentences(count, size);
      case "word":
        return this.randWords(count);
      default:
        return this.errorMessage(type)
    }
  }

  callArgs(char, num, arg) {
    char === "" ? [char, num] = [num, char] : null;
    num !== "" ? this.config.count = Number(num) : null;

    var form = bindings[char] || {};
    this.config = { ...this.config, ...form };

    this.counter--
    if (this.counter === 0) {
      return this.runCommand(this.config);
    }
  }

  parseArgs(arg) {
    var [_, char, num] = arg.match(/^([a-z\?]+)(\d*)$/) ||
      arg.match(/^(\d*)([a-z\?]+)$/) || "___";
    /^(\d*)([a-z\?]+)$/.test(arg) ? [char, num] = [num, char] : null

    return char === "_" ? this.errorMessage(arg) : this.callArgs(char, num, arg);
  }

  parseCommand(com) {
    var commandArr = com.split("_").slice(1);
    this.counter = commandArr.length
    return commandArr.map(arg =>
      this.parseArgs(arg)
    ).join("").trim();
  }

  checkCommand(ed) {
    var coords = ed.getCursorBufferPosition();
    ed.selectToBeginningOfWord();
    // coords.column !== 0 ? ed.selectToBeginningOfWord() : null;
    var wordRange = ed.getSelectedText();
    var reMatch = wordRange.match(searchReg) || null;

    var res;
    if (reMatch && coords.column !== 0) {
      if (coords.column !== 0) {
        var res = this.parseCommand(reMatch[0])
      }
    } else {
      ed.moveRight();
      res = this.runCommand(base)
    }
    ed.insertText(res, {
      select: true,
      autoIndent: true,
    });
  }
}

// lorem_p
// lorem_p2
// lorem_2p

// lorem_p_short
// lorem_p3_medium
// lorem_3p_vlong

// lorem_s
// lorem_s5
// lorem_5s

// lorem_w
// lorem_w2
// lorem_2w
// lorem_w_vlong
