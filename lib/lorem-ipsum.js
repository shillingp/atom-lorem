"use babel";

import { shell } from "electron";
import {
  randNth,
  arrayOfSize,
  isNumber,
  wordWrap,
  errorMessage
} from "./helpers";
import * as w from "./words";

export default class LoremIpsum {
  getRandomWord(size = w.SIZE_ANY) {
    let arr = size === 0 ? w.allSizes : w.wordLists[size - 1];
    return randNth(arr);
  }

  getRandomFragment() {
    let pattern = randNth(w.fragmentPatterns);
    return arrayOfSize(pattern.length)
      .map((_, i) => this.getRandomWord(pattern[i]))
      .join(" ")
      .trim();
  }

  getSentenceInter() {
    return Math.random() < 0.5
      ? ", "
      : " " + this.getRandomWord(w.SIZE_SHORT) + " ";
  }

  getSentenceConnector(size) {
    const randSide = () => this.getRandomSentence(size - 1);
    return randSide() + this.getSentenceInter() + randSide();
  }

  getRandomSentence(size) {
    let res;
    switch (size) {
      case w.SIZE_ANY:
        let randomSize = randNth(w.allSizes);
        res = this.getRandomSentence(randomSize);
        break;
      case w.SIZE_SHORT:
        res = this.getRandomFragment();
        break;
      case w.SIZE_MEDIUM:
      case w.SIZE_LONG:
      case w.SIZE_VERY_LONG:
        res = this.getSentenceConnector(size);
        break;
      default:
        res = getRandomSentence(DEFAULT_UNIT_SIZE);
    }
    return res;
  }

  getRandomParagraph(size) {
    const twice = s => [0, 0].map(() => this.getRandomParagraph(s)).join("");

    if (size === w.SIZE_ANY) {
      return this.getRandomParagraph(w.DEFAULT_UNIT_SIZE);
    } else if (size === w.SIZE_SHORT) {
      let count = 3 + Math.floor(Math.random() * 2);
      return arrayOfSize(count)
        .map(
          () =>
            this
              .getRandomSentence(w.SIZE_ANY)
              .replace(/\b\w/, s => s.toUpperCase()) + ". "
        )
        .join("")
        .trim();
    } else {
      return twice(size - 1);
    }
  }

  getRandomWords(count, size) {
    return arrayOfSize(count)
      .map(() => this.getRandomWord(size))
      .join(" ")
      .trim();
  }

  getRandomSentences(count, size) {
    return arrayOfSize(count)
      .map(
        () =>
          this.getRandomSentence(size).replace(/\b\w/, s => s.toUpperCase()) +
          ". "
      )
      .join("\n\n")
      .trim();
  }

  getRandomParagraphs(count, size) {
    return arrayOfSize(count)
      .map(() => this.getRandomParagraph(size))
      .join("\n\n")
      .trim();
  }

  getRandomLinks(count) {
    return arrayOfSize(count)
      .map(
        () => `<a href="https://atom.io/">
  ${this.getRandomFragment()}
  </a>`
      )
      .join("<br/>\n");
  }

  getRandomList(count, isOrdered) {
    const listType = str =>
      isOrdered ? `<ol>\n${str}\n</ol>` : `<ul>\n${str}\n</ul>`;

    return listType(
      arrayOfSize(count)
        .map(() => `<li>\n\t${this.getRandomFragment()}\n</li>`)
        .join("\n")
    );
  }

  parseCommand(command) {
    // split the command into arguments and drop the "lorem"
    const commandArray = command.split("_").slice(1);

    let optionRegExp = null,
        optionResult = [],
        optionString = "",
        optionInt = 0,
        finalText = "";

    // Make a copy of the default configuration object
    const conf = Object.assign({}, w.DEFAULT_CONFIG);

    // Loop through each argument to assign config values
    for (let i = 0; i < commandArray.length; i++) {
      if (commandArray[i] === "") {
        if (i === commandArray.length - 1) {
          return errorMessage("Unrecognized option '_'.");
        } else {
          return errorMessage("Two or more underscore characters adjacent to each other.");
        }
      }

      let str, num;
      if (/^([a-z\?]+)(\d*)$/.test(commandArray[i])) {
        [, str, num] = commandArray[i].match(/^([a-z\?]+)(\d*)$/)
      } else if (/^(\d*)([a-z\?]+)$/.test(commandArray[i])) {
        [, num, str] = commandArray[i].match(/^(\d*)([a-z\?]+)$/)
      } else {
        return errorMessage(`Unrecognized option "_${commandArray[i]}".`)
      }
      optionString = str;
      optionInt = parseInt(num)


      const setIntProp = prop =>
        conf[prop] = isNumber(optionInt) ? optionInt : conf[prop];

      switch (optionString) {
        case "p":
          conf.unitType = "paragraph";
          setIntProp("unitCount");
          break;
        case "w":
          conf.unitType = "word";
          setIntProp("unitCount");
          break;
        case "s":
          conf.unitType = "sentence";
          setIntProp("unitCount");
          break;
        case "short":
          conf.unitSize = w.SIZE_SHORT;
          break;
        case "medium":
          conf.unitSize = w.SIZE_MEDIUM;
          break;
        case "long":
          conf.unitSize = w.SIZE_LONG;
          break;
        case "vlong":
          conf.unitSize = w.SIZE_VERY_LONG;
          break;
        case "wrap":
          conf.isWrapped = true;
          setIntProp("wrapWidth");
          break;
        case "nowrap":
          conf.isWrapped = false;
          break;
        case "link":
          conf.unitType = "link";
          setIntProp("unitCount");
          break;
        case "ol":
          conf.unitType = "orderedList";
          setIntProp("unitCount");
          break;
        case "ul":
          conf.unitType = "unorderedList";
          setIntProp("unitCount");
          break;
        case "html":
          conf.isHTML = true;
          break;
        case "?":
        case "help":
          conf.showHelp = true;
          break;
        default:
          return errorMessage(
            "Unrecognized option '_" + commandArray[i] + "'."
          );
      }
    }

    atom.devMode ? console.log(conf) : null;

    if (conf.showHelp) {
      // FIXME: Change to correct github link
      shell.openExternal(w.HELP_URL);
      finalText = "";
    } else {
      switch (conf.unitType) {
        case "paragraph":
          finalText = this.getRandomParagraphs(conf.unitCount, conf.unitSize);
          break;
        case "sentence":
          finalText = this.getRandomSentences(conf.unitCount, conf.unitSize);
          break;
        case "word":
          finalText = this.getRandomWords(conf.unitCount, conf.unitSize);
          break;
        case "link":
          finalText = this.getRandomLinks(conf.unitCount);
          break;
        case "orderedList":
          finalText = this.getRandomList(conf.unitCount, true);
          break;
        case "unorderedList":
          finalText = this.getRandomList(conf.unitCount, false);
          break;
        default:
          finalText = this.getRandomParagraphs(
            w.DEFAULT_UNIT_COUNT,
            w.DEFAULT_UNIT_SIZE
          );
      }

      // To avoid badly formatted HTML, links and lists are never word wrapped
      if (["link", "orderedList", "unorderedList"].includes(conf.unitType)) {
        conf.isWrapped = false;
      }

      if (conf.isWrapped) {
        if (conf.wrapWidth && conf.wrapWidth > 0) {
          finalText = wordWrap(finalText, conf.wrapWidth);
        } else {
          finalText = wordWrap(finalText, DEFAULT_WRAP_WIDTH);
        }
      }

      // Ignore _html option for lists, should never be in paragraphs.
      if (["orderedList", "unorderedList"].includes(conf.unitType)) {
        conf.isHTML = false;
      }

      if (conf.isHTML) {
        if (["paragraph", "sentence"].includes(conf.unitType)) {
          // Wrap each individual paragraph, sentence
          finalText = finalText.replace(/\n{2,}/g, "\n</p>\n\n<p>\n");
        }

        finalText = "<p>\n" + finalText + "\n</p>";
      }
    }

    return finalText;
  }
}
// Tests
//
// lorem_w
// lorem_s
// lorem_p
//
// lorem_w2
// lorem_s2
// lorem_p2
//
// lorem_2w
// lorem_2s
// lorem_2p
//
// lorem_w2_short
// lorem_s_short
// lorem_p_short
//
// lorem_wrap20_p2
// lorem_nowrap10
//
// lorem_w2_html
// lorem_s2_html
// lorem_p2_html
//
// Errors:
// lorem_2d
// lorem_2d2
// lorem_
// lorem__
