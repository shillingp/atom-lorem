'use babel';


import { shell } from "electron";
import { randNth, arrayOfSize } from "./helpers";
import * as w from "./words2";


export default class LoremIpsum {
  config = w.DEFAULT_CONFIG

  isNumber(value) {
    return (typeof value === "number") && isFinite(value)
  }

  wordWrap(str, width = 75, brk = "\n", cut = false) {
    if (!str) return false

    var regex = ".{1," + width + "}(\\s|$)"
      + (cut ? "|.{" + width + "}|.+$" : "|\\S+?(\\s|$)")

    return str.match(new RegExp(regex, "g")).join(brk);
  }
  // lorem_p2
  getRandomWord(size) {
    // let arrays = Object.create(allWords, ...w.wordLists)
    // return randNth(arrays[size]);

    let wordArray = [];
    switch (size) {
      case w.SIZE_ANY:
        wordArray = w.allWords;
        break;
      case w.SIZE_SHORT:
        wordArray = w.shortWords;
        break;
      case w.SIZE_MEDIUM:
        wordArray = w.mediumWords;
        break;
      case w.SIZE_LONG:
        wordArray = w.longWords;
        break;
      case w.SIZE_VERY_LONG:
        wordArray = w.veryLongWords;
        break;
      default:
        wordArray = w.allWords;
    }
    return randNth(wordArray);
  }
  //lorem_p2
  getRandomWords(count) {
    return arrayOfSize(count).map(() =>
      this.getRandomWord(w.SIZE_ANY)
    ).join(" ").trim()
  }

  getRandomFragment() {
    let pattern = randNth(w.fragmentPatterns)
    return arrayOfSize(pattern.length).map((_, i) =>
      this.getRandomWord(pattern[i])
    ).join(" ").trim()
  }

  getSentenceConnector() {
    return (Math.random() < 0.5) ?
      ", " : " " + this.getRandomWord(w.SIZE_SHORT) + " "
  }

  getRandomSentence(size) {
    let res;
    switch (size) {
      case w.SIZE_ANY:
        let randomSize = randNth(w.allSizes);
        res = this.getRandomSentence(randomSize)
        break;
      case w.SIZE_SHORT:
        res = this.getRandomFragment()
        break;
      case w.SIZE_MEDIUM:
      case w.SIZE_LONG:
      case w.SIZE_VERY_LONG:
        res = this.getRandomSentence(size - 1)
          + this.getSentenceConnector()
          + this.getRandomSentence(size - 1)
        break;
      default:
        res = getRandomSentence(DEFAULT_UNIT_SIZE)
    }
    return res
  }

  getRandomSentences(count, size) {
    return arrayOfSize(count).map(() =>
      this.getRandomSentence(size) + "\n\n"
    ).join("").trim()
  }

  getRandomParagraph(size) {
    const twice = s => [0, 0].map(() => this.getRandomParagraph(s))
    let res;
    switch (size) {
      case w.SIZE_SHORT:
        let count = 3 + Math.floor(Math.random() * 2);
        res = arrayOfSize(count).map(() =>
          this.getRandomSentence(size - 1) + "."
        ).join(" ").trim()
        break;
      case w.SIZE_MEDIUM:
      case w.SIZE_LONG:
      case w.SIZE_VERY_LONG:
        res = twice(size - 1)
        break;
      default:
        res = this.getRandomParagraph(w.DEFAULT_UNIT_SIZE)
    }
    return res
  }
  // lorem_p2
  getRandomParagraphs(count, size) {
    return arrayOfSize(count).map(() =>
      this.getRandomParagraph(size) + "\n\n"
    ).join("").trim();
  }
  // lorem_p2
  getRandomLinks(count) {

  }

  getRandomList(count, isOrdered) {

  }

  getRandomFortunes(count) {

  }

  parseCommand(command) {
    const commandArray = command.split("_");
    let optionRegExp = null,
    optionResult = [],
    optionString = "",
    optionInt    = 0,
    finalText    = "";

    let config    = w.DEFAULT_CONFIG;

    let unitType  = w.DEFAULT_UNIT_TYPE,
        unitCount = w.DEFAULT_UNIT_COUNT,
        unitSize  = w.DEFAULT_UNIT_SIZE,
        isWrapped = w.DEFAULT_IS_WRAPPED,
        wrapWidth = w.DEFAULT_WRAP_WIDTH,
        isHTML    = w.DEFAULT_IS_HTML,
        showHelp  = w.DEFAULT_SHOW_HELP;

    for (let i = 1; i < commandArray.length; i++) {
      if (commandArray[i] === "") {
        if (i === (commandArray.length - 1)) {
          return "Error: Unrecognized option '_'."
        } else {
          return "Error: Two or more underscore characters adjacent to each other."
        }
      }

      optionRegExp  = /^([a-z\?]+)(\d*)$/
      optionResult  = commandArray[i].match(optionRegExp)

      if (optionResult) {
        optionString  = optionResult[1]
        optionInt     = parseInt(optionResult[2], 10)
      } else {
        optionRegExp = /^(\d*)([a-z\?]+)$/
        optionResult = commandArray[i].match(optionRegExp)

        if (optionResult) {
          optionString  = optionResult[2]
          optionInt     = parseInt(optionResult[1], 10)
        } else {
          return "Error: Unrecognized option '_" + commandArray[i] + "'."
        }
      }

      switch (optionString) {
        case "p":
          unitType = "paragraph";
          unitCount = this.isNumber(optionInt) ? optionInt : DEFAULT_UNIT_COUNT;
          break;
        case "w":
          unitType = "word";
          unitCount = this.isNumber(optionInt) ? optionInt : DEFAULT_UNIT_COUNT;
          break;
        case "s":
          unitType = "sentence";
          unitCount = this.isNumber(optionInt) ? optionInt : DEFAULT_UNIT_COUNT;
          break;
        case "short":
          unitSize = SIZE_SHORT
          break;
        case "medium":
          unitSize = SIZE_MEDIUM
          break;
        case "long":
          unitSize = SIZE_LONG
          break;
        case "vlong":
          unitSize = SIZE_VERY_LONG
          break;
        case "nowrap":
          isWrapped = true
          wrapWidth = this.isNumber(optionInt) ? optionInt : DEFAULT_WRAP_WIDTH
          break;
        case "link":
          unitType = "link"
          unitCount = this.isNumber(optionInt) ? optionInt : DEFAULT_UNIT_COUNT
          break;
        case "ol":
          unitType = "orderedList"
          unitCount = this.isNumber(optionInt) ? optionInt : DEFAULT_UNIT_COUNT
          break;
        case "ul":
          unitType = "unorderedList"
          unitCount = this.isNumber(optionInt) ? optionInt : DEFAULT_UNIT_COUNT
          break;
        // case "fortune":
        //   unitType = "fortune";
        //   unitCount = this.isNumber(optionInt) ? optionInt : DEFAULT_UNIT_COUNT
        //   break;
        case "html":
          isHTML = true
          break;
        case "?":
        case "help":
          showHelp = true
          break;
        default:
          return "Error: Unrecognized option '_" + commandArray[i] + "'."
      }

      if (showHelp) {
        // FIXME: Change to correct github link
        shell.openExternal("www.google.com")
        finalText = ""
      } else {
        switch (unitType) {
          case "paragraph":
            finalText = this.getRandomParagraphs(unitCount, unitSize)
            break;
          case "sentence":
            finalText = this.getRandomSentences(unitCount, unitSize)
            break;
          case "word":
            finalText = this.getRandomWords(unitCount)
            break;
          case "link":
            finalText = this.getRandomLinks(unitCount)
            break;
          case "orderedList":
            finalText = this.getRandomList(unitCount, true)
            break;
          case "unorderedList":
            finalText = this.getRandomList(unitCount, false)
            break;
          // case "fortune":
          //   finalText = this.getRandomFortunes(unitCount)
          //   break;
          default:
            finalText = this.getRandomParagraphs(DEFAULT_UNIT_COUNT, DEFAULT_UNIT_SIZE)
        }

        // To avoid badly formatted HTML, links and lists are never word wrapped
        if (/^(link|orderedList|unorderedList)$/.test(unitType)) {
          isWrapped = false
        }

        if (isWrapped) {
          if (wrapWidth && (wrapWidth > 0)) {
            finalText = this.wordWrap(finalText, wrapWidth)
          } else {
            finalText = this.wordWrap(finalText, DEFAULT_WRAP_WIDTH)
          }
        }

        // Ignore _html option for lists, should never be in paragraphs.
        if (/^(orderedList|unorderedList)$/.test(unitType)) {
          isHTML = false
        }

        if (isHTML) {
          if ((/^(paragraph|sentence|fortune)$/.test(unitType))) {
            // Wrap each individual paragraph, sentence, or fortune
            finalText = finalText.replace(/\n{2,}/g, "\n</p>\n\n<p>\n");
          }

          finalText = "<p>\n" + finalText + "\n</p>"
        }
      }

      return finalText
    }
  }
}
