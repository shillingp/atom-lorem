"use babel";

import { shell } from "electron";
import { SPLIT_REG_EXP, DEFAULT_CONFIG } from "./config-manager";
import {
  randNth,
  arrayOfSize,
  isNumber,
  wordWrap,
  errorMessage,
  displayConfigTable,
} from "./helpers";
import * as w from "./words";

export default class LoremIpsum {
  /**
   * @param {Integer} [size = 0]
   * @returns {String} Singlem word from a word list
   */
  getRandomWord(size = w.SIZE_ANY) {
    let arr = size === 0 ? w.allWords : w.wordLists[size - 1];
    return randNth(arr);
  }

  /**
   * @return {String} random series of strings
   */
  getRandomFragment() {
    let pattern = randNth(w.fragmentPatterns);
    return arrayOfSize(pattern.length)
      .map((_, i) => this.getRandomWord(pattern[i]))
      .join(" ")
      .trim();
  }

  /**
   * @return {String} connection between words
   */
  getSentenceInter() {
    return Math.random() < 0.5
      ? ", "
      : " " + this.getRandomWord(w.SIZE_SHORT) + " ";
  }

  /**
   * @param {Integer} size
   * @return {String} connect two sentences with an inter connection
   */
  getSentenceConnector(size) {
    const randSide = () => this.getRandomSentence(size - 1);
    return randSide() + this.getSentenceInter() + randSide();
  }

  /**
   * @param {Integer} size
   * @return {String} random sentence of size
   */
  getRandomSentence(size) {
    let res = null;
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

  /**
   * @param {Integer} size
   * @return {String} random paragraph of size
   */
  getRandomParagraph(size) {
    const twice = s => [0, 0].map(() => this.getRandomParagraph(s)).join("");

    if (size === w.SIZE_ANY) {
      return this.getRandomParagraph(w.DEFAULT_UNIT_SIZE);
    } else if (size === w.SIZE_SHORT) {
      let count = 3 + Math.floor(Math.random() * 2);
      return arrayOfSize(count)
        .map(
          () =>
            this.getRandomSentence(
              w.SIZE_ANY
            ).replace(/\b\w/, s => s.toUpperCase()) + ". "
        )
        .join("")
        .trim();
    } else {
      return twice(size - 1);
    }
  }

  /**
   * @param {Integer} count
   * @param {Integer} size
   * @return {String} string with count * words of length size
   */
  getRandomWords(count, size) {
    return arrayOfSize(count)
      .map(() => this.getRandomWord(size))
      .join(" ")
      .trim();
  }

  /**
   * @param {Integer} count
   * @param {Integer} size
   * @return {String} string with count * sentences of length size
   */
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

  /**
   * @param {Integer} count
   * @param {Integer} size
   * @return {String} string with count * paragraphs of length size
   */
  getRandomParagraphs(count, size) {
    return arrayOfSize(count)
      .map(() => this.getRandomParagraph(size))
      .join("\n\n")
      .trim();
  }

  /**
   * @param {Integer} count
   * @return {String} string with count * links
   */
  getRandomLinks(count) {
    return arrayOfSize(count)
      .map(
        () => `<a href="https://atom.io">
            ${this.getRandomFragment()}
          </a>`
      )
      .join("<br/>\n");
  }

  /**
   * @param {Integer} count
   * @param {Boolean} isOrdered
   * @return {String} string with count * list items
   */
  getRandomList(count, isOrdered) {
    const listType = str =>
      isOrdered ? `<ol>\n${str}\n</ol>` : `<ul>\n${str}\n</ul>`;

    return listType(
      arrayOfSize(count)
        .map(() => `<li>\n\t${this.getRandomFragment()}\n</li>`)
        .join("\n")
    );
  }

  /**
   * @param {String} command
   * @return {String} Lorem Ipsum text.
   */
  parseCommand(command) {
    // split the command into arguments and drop the "lorem"
    const commandArray = command.split(SPLIT_REG_EXP).slice(1);
    // Make a copy of the default configuration object
    const conf = Object.assign({}, DEFAULT_CONFIG);

    let finalText = null;

    // Loop through each argument to assign config values
    for (let i in commandArray) {
      if (!commandArray[i]) {
        if (commandArray.length === 1) {
          return errorMessage("Unrecognized option '_'.");
        } else {
          return errorMessage(
            "Two or more underscore characters adjacent to each other."
          );
        }
      }

      // assign variable depending on order of string and number
      let str, num;
      if (/^([a-z\?]+)(\d*)$/.test(commandArray[i])) {
        [, str, num] = commandArray[i].match(/^([a-z\?]+)(\d*)$/);
      } else if (/^(\d*)([a-z\?]+)$/.test(commandArray[i])) {
        [, num, str] = commandArray[i].match(/^(\d*)([a-z\?]+)$/);
      } else {
        return errorMessage(`Unrecognized option "_${commandArray[i]}".`);
      }
      const optionString = str;
      const optionInt = parseInt(num);

      const setIntProp = prop =>
        isNumber(optionInt) ? (conf[prop] = optionInt) : null;

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

    // log the configuration for developing
    // atom.inDevMode() ? console.log(conf) : null;
    atom.inDevMode() ? displayConfigTable(conf) : null;

    if (conf.showHelp) {
      shell.openExternal(w.HELP_URL);
      finalText = null;
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
          return null;
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
          finalText = finalText.replace(/\n{2,}/g, "\n</p>\n<p>\n");
        }

        finalText = "<p>\n" + finalText + "\n</p>";
      }
    }

    return finalText;
  }
}
