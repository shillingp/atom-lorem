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

  getRandomWord(size = w.SIZE_ANY) {
    // FIXME: if no size is declared will use DEFAULT_UNIT_SIZE
    let arr = size === 0 ? w.allSizes : w.wordLists[size - 1]
    return randNth(arr);
  }

  getRandomFragment() {
    let pattern = randNth(w.fragmentPatterns)
    return arrayOfSize(pattern.length).map((_, i) =>
      this.getRandomWord(pattern[i])
    ).join(" ").trim()
  }

  getSentenceInter() {
    return (Math.random() < 0.5) ?
      ", " : " " + this.getRandomWord(w.SIZE_SHORT) + " "
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
        res = this.getRandomSentence(randomSize)
        break;
      case w.SIZE_SHORT:
        res = this.getRandomFragment()
        break;
      case w.SIZE_MEDIUM:
      case w.SIZE_LONG:
      case w.SIZE_VERY_LONG:
        res = this.getSentenceConnector(size)
        break;
      default:
        res = getRandomSentence(DEFAULT_UNIT_SIZE)
    }
    return res
  }

  getRandomParagraph(size) {
    const twice = s => [0, 0].map(() =>
      this.getRandomParagraph(s)).join("")

    if (size === w.SIZE_ANY) {
      return this.getRandomParagraph(w.DEFAULT_UNIT_SIZE)
    } else if (size === w.SIZE_SHORT) {
      let count = 3 + Math.floor(Math.random() * 2);
      return arrayOfSize(count).map(() =>
        this.getRandomSentence(w.SIZE_ANY)
          .replace(/\b\w/, s => s.toUpperCase()) + ". "
      ).join("").trim()
    } else {
      return twice(size - 1)
    }
  }

  getRandomWords(count, size) {
    return arrayOfSize(count).map(() =>
      this.getRandomWord(size)
    ).join(" ").trim()
  }

  getRandomSentences(count, size) {
    return arrayOfSize(count).map(() =>
      this.getRandomSentence(size)
        .replace(/\b\w/, s => s.toUpperCase()) + ". "
    ).join("\n\n").trim()
  }

  getRandomParagraphs(count, size) {
    return arrayOfSize(count).map(() =>
      this.getRandomParagraph(size)
    ).join("\n\n").trim();
  }

  getRandomLinks(count) {
    return arrayOfSize(count).map(() =>
      `<a href="https://atom.io/">
  ${this.getRandomFragment()}
</a>`
    ).join("<br/>\n");
  }
  // lorem_link
  getRandomList(count, isOrdered) {
    const listType = (str) =>
      isOrdered ? `<ol>\n${str}\n</ol>` : `<ul>\n${str}\n</ul>`

    return listType(
      arrayOfSize(count).map(() =>
        `<li>\n\t${this.getRandomFragment()}\n</li>`
      ).join("\n")
    )
  }
  // lorem_ul2
  getRandomFortunes(count) {
    return arrayOfSize(count).map(() =>
      randNth(w.FORTUNE_FILE_ARRAY)
        .trim()
    ).join("\n\n")
  }

  parseCommand(command) {
    const commandArray = command.split("_");
    let optionRegExp = null,
    optionResult = [],
    optionString = "",
    optionInt    = 0,
    finalText    = "";

    // let config    = w.DEFAULT_CONFIG;

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
          unitCount = this.isNumber(optionInt) ? optionInt : w.DEFAULT_UNIT_COUNT;
          break;
        case "w":
          unitType = "word";
          unitCount = this.isNumber(optionInt) ? optionInt : w.DEFAULT_UNIT_COUNT;
          break;
        case "s":
          unitType = "sentence";
          unitCount = this.isNumber(optionInt) ? optionInt : w.DEFAULT_UNIT_COUNT;
          break;
        case "short":
          unitSize = w.SIZE_SHORT
          break;
        case "medium":
          unitSize = w.SIZE_MEDIUM
          break;
        case "long":
          unitSize = w.SIZE_LONG
          break;
        case "vlong":
          unitSize = w.SIZE_VERY_LONG
          break;
        case "wrap":
          isWrapped = true
          wrapWidth = this.isNumber(optionInt) ? optionInt : w.DEFAULT_WRAP_WIDTH
          break;
        case "nowrap":
          isWrapped = false;
          break;
        case "link":
          unitType = "link"
          unitCount = this.isNumber(optionInt) ? optionInt : w.DEFAULT_UNIT_COUNT
          break;
        case "ol":
          unitType = "orderedList"
          unitCount = this.isNumber(optionInt) ? optionInt : w.DEFAULT_UNIT_COUNT
          break;
        case "ul":
          unitType = "unorderedList"
          unitCount = this.isNumber(optionInt) ? optionInt : w.DEFAULT_UNIT_COUNT
          break;
        // case "fortune":
        //   unitType = "fortune";
        //   unitCount = this.isNumber(optionInt) ? optionInt : w.DEFAULT_UNIT_COUNT
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
            finalText = this.getRandomWords(unitCount, unitSize)
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
            finalText = this.getRandomParagraphs(w.DEFAULT_UNIT_COUNT, w.DEFAULT_UNIT_SIZE)
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
          if (/^(paragraph|sentence|fortune)$/.test(unitType)) {
            // Wrap each individual paragraph, sentence, or fortune
            finalText = finalText.replace(/\n{2,}/g, "\n</p>\n\n<p>\n");
          }

          finalText = "<p>\n" + finalText + "\n</p>";
        }
      }
    }

    return finalText
  }
}


// lorem_w
// lorem_s
// lorem_p

// lorem_w2
// lorem_s2
// lorem_p2

// lorem_w_short
// lorem_s_short
// lorem_p_short

// lorem_wrap20_p2
// lorem_nowrap

// lorem_w2_html
// lorem_s2_html
// lorem_p2_html
