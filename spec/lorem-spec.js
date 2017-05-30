"use babel";

import { arrayOfSize } from "../lib/helpers";
import { hasCommand, doTimes } from "./spec-helper";

describe("Lorem: ", () => {
  let workspaceElement, editor, editorElement;

  const runLoremCommand = () => {
    atom.commands.dispatch(editorElement, "lorem:catch-command");
    return editor.getText();
  };

  /**
   * @param {String} command
   * @returns {String} text content of editor
   */
  const runLorem = command => {
    editor.setText(command ? "lorem" + command : "");
    return runLoremCommand();
  };

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    jasmine.attachToDOM(workspaceElement);

    waitsForPromise(() => {
      return Promise.all([
        atom.packages.activatePackage("lorem"),
        atom.workspace.open().then(e => {
          editor = e;
          editorElement = atom.views.getView(editor);
        }),
      ]);
    });
  });

  afterEach(() => {
    atom.config.unset("lorem");
  });

  describe("activate", () => {
    it("should create the command 'catch-command'", () => {
      expect(hasCommand(editorElement, "lorem:catch-command")).toBeTruthy();
    });
  });

  describe("deactivate", () => {
    beforeEach(() => {
      atom.packages.deactivatePackage("lorem");
    });

    it("should destroy commands", () => {
      expect(hasCommand(editorElement, "lorem:catch-command")).toBeFalsy();
    });
  });

  describe("When no text editor", () => {
    beforeEach(() => {
      editor.destroy();
    });

    it("should not run", () => {
      expect(runLorem("_p2")).toEqual("lorem_p2");
    });
  });

  describe("Word Generator: ", () => {
    describe("Words:", () => {
      describe("When a count argument is given", () => {
        it("should generate a single word if no argument", () => {
          expect(runLorem("_w")).toMatch(/^\w+$/);
        });

        it("should generate x number of words", () => {
          expect(runLorem("_w2")).toMatch(/^(?:\w+ ?){2}$/);
          expect(runLorem("_w5")).toMatch(/^(?:\w+ ?){5}$/);
          expect(runLorem("_w10")).toMatch(/^(?:\w+ ?){10}$/);
        });
      });

      describe("When a size argument is given", () => {
        it("should be between positive finite number", () => {
          const word = runLorem("_w1").length;
          expect(word > 0 && isFinite(word));
        });

        it("should be between size limits", () => {
          expect(runLorem("_w1_short")).toMatch(/^\w{1,3}$/);
          expect(runLorem("_w1_medium")).toMatch(/^\w{4,6}$/);
          expect(runLorem("_w1_long")).toMatch(/^\w{7,10}$/);
          expect(runLorem("_w1_vlong")).toMatch(/^\w{10,}$/);
        });
      });
    });

    describe("Sentences: ", () => {
      describe("When a single sentence is generated", () => {
        it("should have a capital letter and end in a period", () => {
          const sentence = runLorem("_s1");
          const firstChar = sentence.charAt(0);

          expect(firstChar === firstChar.toUpperCase()).toBeTruthy();
          expect(sentence.charAt(sentence.length - 1)).toBe(".");
        });
      });

      describe("When a count argument is given", () => {
        it("should generate a single sentence if no argument given", () => {
          const sentence = runLorem("_s1").split("\n\n");
          expect(sentence).toHaveLength(1);
        });

        it("should generate x number of sentences", () => {
          expect(runLorem("_s2").split("\n\n")).toHaveLength(2);
          expect(runLorem("_s5").split("\n\n")).toHaveLength(5);
          expect(runLorem("_s10").split("\n\n")).toHaveLength(10);
        });
      });
    });

    describe("Paragraphs: ", () => {
      describe("When a single paragraph is generated", () => {
        it("should have a capital letter and end in a period", () => {
          const paragraph = runLorem("_p1");
          const firstChar = paragraph.charAt(0);

          expect(firstChar === firstChar.toUpperCase()).toBeTruthy();
          expect(paragraph.charAt(paragraph.length - 1)).toBe(".");
        });
      });

      describe("When a count argument is given", () => {
        it("should generate a single paragraph if no argument given", () => {
          const paragraph = runLorem("_p1").split("\n\n");
          expect(paragraph).toHaveLength(1);
        });

        it("should generate x number of paragraphs", () => {
          expect(runLorem("_p2").split("\n\n")).toHaveLength(2);
          expect(runLorem("_p5").split("\n\n")).toHaveLength(5);
          expect(runLorem("_p10").split("\n\n")).toHaveLength(10);
        });
      });
    });

    describe("Links: ", () => {
      it("should begin and end with a tags", () => {
        const link = runLorem("_link1");

        expect(link).toMatch(/^<a href=".*">/g);
        expect(link).toMatch(/<\/a>$/g);
      });

      describe("When a count argument is given", () => {
        it("should generate x number of list items", () => {
          expect(runLorem("_link2").match(/<a.*>/g)).toHaveLength(2);
          expect(runLorem("_link5").match(/<a.*>/g)).toHaveLength(5);
          expect(runLorem("_link10").match(/<a.*>/g)).toHaveLength(10);
        });

        it("should have a <br/> tag between each list item", () => {
          expect(runLorem("_link2").match(/<br\/>/g)).toHaveLength(1);
          expect(runLorem("_link5").match(/<br\/>/g)).toHaveLength(4);
          expect(runLorem("_link10").match(/<br\/>/g)).toHaveLength(9);
        });
      });
    });

    describe("Lists: ", () => {
      describe("Ordered Lists: ", () => {
        it("should begin and end with ol tags", () => {
          const list = runLorem("_ol1");

          expect(list).toMatch(/^<ol>/g);
          expect(list).toMatch(/<\/ol>$/g);
        });

        describe("when a count argument is given", () => {
          it("should generate x number of list items", () => {
            expect(runLorem("_ol2").match(/<li>/g)).toHaveLength(2);
            expect(runLorem("_ol5").match(/<li>/g)).toHaveLength(5);
            expect(runLorem("_ol10").match(/<li>/g)).toHaveLength(10);

            expect(runLorem("_2ol").match(/<li>/g)).toHaveLength(2);
            expect(runLorem("_5ol").match(/<li>/g)).toHaveLength(5);
            expect(runLorem("_10ol").match(/<li>/g)).toHaveLength(10);
          });
        });
      });

      describe("Unordered Lists: ", () => {
        it("should begin and end with ol tags", () => {
          const list = runLorem("_ul1");

          expect(list).toMatch(/^<ul>/);
          expect(list).toMatch(/<\/ul>$/);
        });

        describe("when a count argument is given", () => {
          it("should generate x number of list items", () => {
            expect(runLorem("_ul2").match(/<li>/g)).toHaveLength(2);
            expect(runLorem("_ul5").match(/<li>/g)).toHaveLength(5);
            expect(runLorem("_ul10").match(/<li>/g)).toHaveLength(10);

            expect(runLorem("_2ul").match(/<li>/g)).toHaveLength(2);
            expect(runLorem("_5ul").match(/<li>/g)).toHaveLength(5);
            expect(runLorem("_10ul").match(/<li>/g)).toHaveLength(10);
          });
        });
      });
    });

    describe("HTML: ", () => {
      describe("When used with word, sentence & paragraph", () => {
        it("should start and end with p tags", () => {
          expect(runLorem("_p1_html")).toMatch(/^<p>/);
          expect(runLorem("_p1_html")).toMatch(/<\/p>$/);
        });

        it("should only wrap words once", () => {
          expect(runLorem("_w1_html").match(/<p>/g)).toHaveLength(1);
          expect(runLorem("_w20_html").match(/<p>/g)).toHaveLength(1);
        });

        it("should wrap sentences and paragraphs x times", () => {
          expect(runLorem("_s5_html").match(/<p>/g)).toHaveLength(5);
          expect(runLorem("_s20_html").match(/<p>/g)).toHaveLength(20);

          expect(runLorem("_p5_html").match(/<p>/g)).toHaveLength(5);
          expect(runLorem("_p20_html").match(/<p>/g)).toHaveLength(20);
        });

        it("should not affect lists", () => {
          expect(runLorem("_ol5").match(/<p>/g)).toBe(null);
          expect(runLorem("_ul10").match(/<p>/g)).toBe(null);
        });
      });
    });

    describe("Wrap: ", () => {
      describe("When using wrap width argument", () => {
        it("should not exceed the wrap width", () => {
          const wrapped = size =>
            runLorem(`_p1_vlong_wrap${size}`)
              .split("\n")
              .every(str => str.trim().length <= size + 1);

          expect(wrapped(30)).toBeTruthy();
          expect(wrapped(40)).toBeTruthy();
          expect(wrapped(50)).toBeTruthy();
        });
      });

      describe("No Wrap: ", () => {
        it("should not have any linebreaks if nowrap", () => {
          expect(runLorem("_p1_vlong_nowrap").match(/\n/g)).toBe(null);
        });
      });
    });

    xdescribe("Help: ", () => {
      it("should not change the editors text", () => {
        expect(runLorem("_help")).toMatch(/^lorem/);
        expect(runLorem("_?")).toMatch(/^lorem/);
      });
    });

    describe("Argument Order: ", () => {
      const tests = ["w", "s", "p", "ol", "ul", "link", "wrap"];

      it("should not fail to run if string is first", () => {
        tests.forEach(test =>
          expect(runLorem(`_${test}2`)).not.toMatch(/^lorem/)
        );
      });

      it("should not fail to parse if number is first", () => {
        tests.forEach(test =>
          expect(runLorem(`_2${test}`)).not.toMatch(/^lorem/)
        );
      });
    });

    describe("Errors: ", () => {
      it("should create a notification for each error", () => {
        const tests = ["_d", "_d2", "_2d", "_error"];
        atom.notifications.clear();

        tests.forEach(test => runLorem(test));
        expect(atom.notifications.getNotifications()).toHaveLength(
          tests.length
        );
      });

      it("should have different notification messages", () => {
        const tests = {
          _: "Unrecognized option '_'.",
          __: "Two or more underscore characters adjacent to each other.",
          _d: "Unrecognized option '_d'.",
        };

        Object.keys(tests).forEach(test => {
          atom.notifications.clear();
          runLorem(test);
          const notif = atom.notifications.getNotifications()[0];
          expect(notif.options.detail).toEqual(tests[test]);
        });
      });

      it("should not change anything if it causes an error", () => {
        const tests = ["_", "__", "_d", "_2s2", "_p2_hello", "_lorem_p"];

        tests.forEach(test => {
          expect(runLorem(test)).toMatch(/^lorem/);
        });
      });
    });

    describe("Chaining arguments: ", () => {
      it("should prioritise rightmost argument", () => {
        expect(runLorem("_nowrap_wrap10")).toMatch(/\n/g);
        expect(runLorem("_wrap10_nowrap")).not.toMatch(/\n/g);

        expect(runLorem("_w5_w1")).toMatch(/^\w+$/);
        expect(runLorem("_w1_w5")).not.toMatch(/^\w+$/);
      });

      it("should parse and run multiple conflicting arguments", () => {
        const testStr = runLorem("_7s_w2_short_vlong_html");

        expect(testStr).not.toMatch(/^lorem/);
        expect(testStr).toMatch(/^<p>/);
        expect(testStr).toMatch(/<\/p>$/);
        expect(testStr).toMatch(/\w+ \w+/);

        expect(testStr.match(/(\w+) \w+/)[1].length).toBeGreaterThan(10);
      });
    });
  });

  describe("Multiple Cursors: ", () => {
    /**
     * @param {Integer} num
     * @param {String} cmd
     */
    const setCursorPositions = (num, cmd) => {
      editor.setText("\n".repeat(num - 1));
      arrayOfSize(num - 1).forEach((_, i) =>
        editor.addCursorAtBufferPosition([i, 0])
      );
      editor.insertText("lorem_s");
      return runLoremCommand();
    };

    it("should work", () => {
      expect(setCursorPositions(2, "lorem_s").split("\n")).toHaveLength(2);
      // expect(runLoremCommand().split("\n")).toHaveLength(2);
      expect(setCursorPositions(5, "lorem_s").split("\n")).toHaveLength(5);
      // expect(runLoremCommand().split("\n")).toHaveLength(5);
      expect(setCursorPositions(10, "lorem_s").split("\n")).toHaveLength(10);
      // expect(runLoremCommand().split("\n")).toHaveLength(10);
    });
  });

  describe("Configuration: ", () => {
    /**
     * @param {String} path
     * @param {Object} newProps
     * @returns {Boolean}
     */
    const updateConfig = (path, newProps) =>
      atom.config.set(path, { ...atom.config.get(path), ...newProps });

    it("should use the defaults to generate text", test => {
      updateConfig("lorem.defaults", {
        unitType: "Word",
        unitCount: 3,
        unitSize: "Very Long",
      });
      expect(runLorem()).toMatch(/^(?:\w{10,} ?){3}$/);

      updateConfig("lorem.defaults", {
        isHTML: true,
      });
      expect(runLorem()).toMatch(
        /^<p>[\s\n\t]+(?:(?:\w{10,} ?){3})[\s\n\t]+<\/p>$/
      );
    });

    describe("When seperators changed in config", () => {
      it("should ONLY allow the seperators defined in config", () => {
        updateConfig("lorem.commands", {
          splitRegExp: ["_", "-"],
        });
        expect(runLorem("_w1")).not.toMatch(/^lorem/);
        expect(runLorem("-w1")).not.toMatch(/^lorem/);
        expect(runLorem(":w1")).toMatch(/^lorem/);
        expect(runLorem(".w1")).toMatch(/^lorem/);

        updateConfig("lorem.commands", {
          splitRegExp: [":", "."],
        });
        expect(runLorem("_w1")).toMatch(/^lorem/);
        expect(runLorem("-w1")).toMatch(/^lorem/);
        expect(runLorem(":w1")).not.toMatch(/^lorem/);
        expect(runLorem(".w1")).not.toMatch(/^lorem/);
      });

      it("should allow all regex symbols as seperators", () => {
        const regexSymbols = [
          "[",
          "]",
          "/",
          "{",
          "}",
          "(",
          ")",
          "*",
          "+",
          "?",
          ".",
          "\\",
          "^",
          "$",
          "|",
        ];
        updateConfig("lorem.commands", {
          splitRegExp: regexSymbols,
        });

        regexSymbols.forEach(symbol =>
          expect(runLorem(`${symbol}w2`)).not.toMatch(/^lorem/)
        );
      });
    });
  });
});
