"use babel";

import { shell } from "electron";
import { randNth, arrayOfSize } from "./helpers";
import * as w from "./words";

export default class LoremIpsum {
  // TODO: use config to determine what has an has not been specified.
  config = w.DEFAULT_CONFIG;

  isNumber(value) {
    return typeof value === "number" && isFinite(value);
  }

  // From http://james.padolsey.com/javascript/wordwrap-for-javascript/
  wordWrap(str, width = w.DEFAULT_WRAP_WIDTH, brk = "\n", cut = false) {
    if (!str) return false;

    var regex = ".{1," +
      width +
      "}(\\s|$)" +
      (cut ? "|.{" + width + "}|.+$" : "|\\S+?(\\s|$)");

    return str.match(new RegExp(regex, "g")).join(brk);
  }

  getRandomWord(size = w.SIZE_ANY) {
    // FIXME: if no size is declared will use DEFAULT_UNIT_SIZE
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
  // lorem_link
  getRandomList(count, isOrdered) {
    const listType = str =>
      isOrdered ? `<ol>\n${str}\n</ol>` : `<ul>\n${str}\n</ul>`;

    return listType(
      arrayOfSize(count)
        .map(() => `<li>\n\t${this.getRandomFragment()}\n</li>`)
        .join("\n")
    );
  }
  // lorem_ul2
  getRandomFortunes(count) {
    return arrayOfSize(count)
      .map(() => randNth(w.FORTUNE_FILE_ARRAY).trim())
      .join("\n\n");
  }

  // parseCommand(command) {
  //   const commandArray = command.split("_");
  //   let optionRegExp = null,
  //     optionResult = [],
  //     optionString = "",
  //     optionInt = 0,
  //     finalText = "";
  //
  //   // let conf.unitType  = w.DEFAULT_UNIT_TYPE,
  //   //     conf.unitCount = w.DEFAULT_UNIT_COUNT,
  //   //     conf.unitSize  = w.DEFAULT_UNIT_SIZE,
  //   //     conf.isWrapped = w.DEFAULT_IS_WRAPPED,
  //   //     conf.wrapWidth = w.DEFAULT_WRAP_WIDTH,
  //   //     conf.isHTML    = w.DEFAULT_IS_HTML,
  //   //     conf.showHelp  = w.DEFAULT_SHOW_HELP;
  //
  //   let {
  //     conf.unitType,
  //     conf.unitCount,
  //     conf.unitSize,
  //     conf.isWrapped,
  //     conf.wrapWidth,
  //     conf.isHTML,
  //     conf.showHelp
  //   } = w.DEFAULT_CONFIG;
  //
  //   for (let i = 1; i < commandArray.length; i++) {
  //     if (commandArray[i] === "") {
  //       if (i === commandArray.length - 1) {
  //         return "Error: Unrecognized option '_'.";
  //       } else {
  //         return "Error: Two or more underscore characters adjacent to each other.";
  //       }
  //     }
  //
  //     optionRegExp = /^([a-z\?]+)(\d*)$/;
  //     optionResult = commandArray[i].match(optionRegExp);
  //
  //     if (optionResult) {
  //       optionString = optionResult[1];
  //       optionInt = parseInt(optionResult[2], 10);
  //     } else {
  //       optionRegExp = /^(\d*)([a-z\?]+)$/;
  //       optionResult = commandArray[i].match(optionRegExp);
  //
  //       if (optionResult) {
  //         optionString = optionResult[2];
  //         optionInt = parseInt(optionResult[1], 10);
  //       } else {
  //         return "Error: Unrecognized option '_" + commandArray[i] + "'.";
  //       }
  //     }
  //
  //     const setIntProp = prop => this.isNumber(optionInt) ? optionInt : prop;
  //
  //     switch (optionString) {
  //       case "p":
  //         conf.unitType = "paragraph";
  //         // conf.unitCount = this.isNumber(optionInt) ? optionInt : w.DEFAULT_UNIT_COUNT;
  //         conf.unitCount = setIntProp(conf.unitCount);
  //         break;
  //       case "w":
  //         conf.unitType = "word";
  //         // conf.unitCount = this.isNumber(optionInt) ? optionInt : w.DEFAULT_UNIT_COUNT;
  //         conf.unitCount = setIntProp(conf.unitCount);
  //         break;
  //       case "s":
  //         conf.unitType = "sentence";
  //         // conf.unitCount = this.isNumber(optionInt) ? optionInt : w.DEFAULT_UNIT_COUNT;
  //         conf.unitCount = setIntProp(conf.unitCount);
  //         break;
  //       case "short":
  //         conf.unitSize = w.SIZE_SHORT;
  //         break;
  //       case "medium":
  //         conf.unitSize = w.SIZE_MEDIUM;
  //         break;
  //       case "long":
  //         conf.unitSize = w.SIZE_LONG;
  //         break;
  //       case "vlong":
  //         conf.unitSize = w.SIZE_VERY_LONG;
  //         break;
  //       case "wrap":
  //         conf.isWrapped = true;
  //         // conf.wrapWidth = this.isNumber(optionInt) ? optionInt : w.DEFAULT_WRAP_WIDTH
  //         conf.wrapWidth = setIntProp(conf.wrapWidth);
  //         break;
  //       case "nowrap":
  //         conf.isWrapped = false;
  //         break;
  //       case "link":
  //         conf.unitType = "link";
  //         // conf.unitCount = this.isNumber(optionInt) ? optionInt : w.DEFAULT_UNIT_COUNT
  //         conf.unitCount = setIntProp(conf.unitCount);
  //         break;
  //       case "ol":
  //         conf.unitType = "orderedList";
  //         // conf.unitCount = this.isNumber(optionInt) ? optionInt : w.DEFAULT_UNIT_COUNT
  //         conf.unitCount = setIntProp(conf.unitCount);
  //         break;
  //       case "ul":
  //         conf.unitType = "unorderedList";
  //         // conf.unitCount = this.isNumber(optionInt) ? optionInt : w.DEFAULT_UNIT_COUNT
  //         conf.unitCount = setIntProp(conf.unitCount);
  //         break;
  //       // case "fortune":
  //       //   conf.unitType = "fortune";
  //       //   conf.unitCount = this.isNumber(optionInt) ? optionInt : w.DEFAULT_UNIT_COUNT
  //       //   conf.unitCount = setIntProp(conf.unitCount)
  //       //   break;
  //       case "html":
  //         conf.isHTML = true;
  //         break;
  //       case "?":
  //       case "help":
  //         conf.showHelp = true;
  //         break;
  //       default:
  //         return "Error: Unrecognized option '_" + commandArray[i] + "'.";
  //     }
  //   }
  //
  //   if (conf.showHelp) {
  //     // FIXME: Change to correct github link
  //     shell.openExternal("www.google.com");
  //     finalText = "";
  //   } else {
  //     switch (conf.unitType) {
  //       case "paragraph":
  //         finalText = this.getRandomParagraphs(conf.unitCount, conf.unitSize);
  //         break;
  //       case "sentence":
  //         finalText = this.getRandomSentences(conf.unitCount, conf.unitSize);
  //         break;
  //       case "word":
  //         finalText = this.getRandomWords(conf.unitCount, conf.unitSize);
  //         break;
  //       case "link":
  //         finalText = this.getRandomLinks(conf.unitCount);
  //         break;
  //       case "orderedList":
  //         finalText = this.getRandomList(conf.unitCount, true);
  //         break;
  //       case "unorderedList":
  //         finalText = this.getRandomList(conf.unitCount, false);
  //         break;
  //       // case "fortune":
  //       //   finalText = this.getRandomFortunes(conf.unitCount)
  //       //   break;
  //       default:
  //         finalText = this.getRandomParagraphs(
  //           w.DEFAULT_UNIT_COUNT,
  //           w.DEFAULT_UNIT_SIZE
  //         );
  //     }
  //
  //     // To avoid badly formatted HTML, links and lists are never word wrapped
  //     if (/^(link|orderedList|unorderedList)$/.test(conf.unitType)) {
  //       conf.isWrapped = false;
  //     }
  //
  //     if (conf.isWrapped) {
  //       if (conf.wrapWidth && conf.wrapWidth > 0) {
  //         finalText = this.wordWrap(finalText, conf.wrapWidth);
  //       } else {
  //         finalText = this.wordWrap(finalText, DEFAULT_WRAP_WIDTH);
  //       }
  //     }
  //
  //     // Ignore _html option for lists, should never be in paragraphs.
  //     if (/^(orderedList|unorderedList)$/.test(conf.unitType)) {
  //       conf.isHTML = false;
  //     }
  //
  //     if (conf.isHTML) {
  //       if (/^(paragraph|sentence|fortune)$/.test(conf.unitType)) {
  //         // Wrap each individual paragraph, sentence, or fortune
  //         finalText = finalText.replace(/\n{2,}/g, "\n</p>\n\n<p>\n");
  //       }
  //
  //       finalText = "<p>\n" + finalText + "\n</p>";
  //     }
  //   }
  //
  //   return finalText;
  // }

  parseCommand(command) {
    const commandArray = command.split("_");
    let optionRegExp = null,
      optionResult = [],
      optionString = "",
      optionInt = 0,
      finalText = "";

    const conf = w.DEFAULT_CONFIG;

    for (let i = 1; i < commandArray.length; i++) {
      if (commandArray[i] === "") {
        if (i === commandArray.length - 1) {
          return "Error: Unrecognized option '_'.";
        } else {
          return "Error: Two or more underscore characters adjacent to each other.";
        }
      }

      optionRegExp = /^([a-z\?]+)(\d*)$/;
      optionResult = commandArray[i].match(optionRegExp);

      if (optionResult) {
        optionString = optionResult[1];
        optionInt = parseInt(optionResult[2], 10);
      } else {
        optionRegExp = /^(\d*)([a-z\?]+)$/;
        optionResult = commandArray[i].match(optionRegExp);

        if (optionResult) {
          optionString = optionResult[2];
          optionInt = parseInt(optionResult[1], 10);
        } else {
          return "Error: Unrecognized option '_" + commandArray[i] + "'.";
        }
      }

      // const setIntProp = prop => this.isNumber(optionInt) ? optionInt :  prop;
      const setIntProp = prop =>
        conf[prop] = this.isNumber(optionInt) ? optionInt : prop;

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
        // case "fortune":
        //   conf.unitType = "fortune";
        //   setIntProp("unitCount")
        //   break;
        case "html":
          conf.isHTML = true;
          break;
        case "?":
        case "help":
          conf.showHelp = true;
          break;
        default:
          return "Error: Unrecognized option '_" + commandArray[i] + "'.";
      }
    }

    atom.devMode ? console.log(conf) : null;

    if (conf.showHelp) {
      // FIXME: Change to correct github link
      shell.openExternal("www.google.com");
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
        // case "fortune":
        //   finalText = this.getRandomFortunes(conf.unitCount)
        //   break;
        default:
          finalText = this.getRandomParagraphs(
            w.DEFAULT_UNIT_COUNT,
            w.DEFAULT_UNIT_SIZE
          );
      }

      // To avoid badly formatted HTML, links and lists are never word wrapped
      if (/^(link|orderedList|unorderedList)$/.test(conf.unitType)) {
        conf.isWrapped = false;
      }

      if (conf.isWrapped) {
        if (conf.wrapWidth && conf.wrapWidth > 0) {
          finalText = this.wordWrap(finalText, conf.wrapWidth);
        } else {
          finalText = this.wordWrap(finalText, DEFAULT_WRAP_WIDTH);
        }
      }

      // Ignore _html option for lists, should never be in paragraphs.
      if (/^(orderedList|unorderedList)$/.test(conf.unitType)) {
        conf.isHTML = false;
      }

      if (conf.isHTML) {
        if (/^(paragraph|sentence|fortune)$/.test(conf.unitType)) {
          // Wrap each individual paragraph, sentence, or fortune
          finalText = finalText.replace(/\n{2,}/g, "\n</p>\n\n<p>\n");
        }

        finalText = "<p>\n" + finalText + "\n</p>";
      }
    }

    return finalText;
  }
}
// lorem_w
// lorem_s
// lorem_p
//
// lorem_w2
// lorem_s2
// lorem_p2
//
// lorem_w_short
// lorem_s_short
// lorem_p_short
//
// lorem_wrap20_p2
// lorem_nowrap
//
// lorem_w2_html
// lorem_s2_html
// lorem_p2_html
