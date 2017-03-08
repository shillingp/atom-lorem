"use babel";

// const dotimes = (num, fn) => [...Array(num + 1).keys()].slice(1).forEach(fn);

describe("Lorem: ", () => {
  let workspaceElement, editor, editorElement, loremIpsum;

  let runLorem = command => {
    editor.setText("lorem" + command);
    atom.commands.dispatch(editorElement, "lorem:catch-command");
    return editor.getText();
  };

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    jasmine.attachToDOM(workspaceElement);

    waitsForPromise(() => {
      return atom.packages
        .activatePackage("lorem")
        .then(pack => loremIpsum = pack.mainModule);
    });

    waitsForPromise(() => {
      return atom.workspace.open().then(_editor => {
        editor = _editor;
        editorElement = atom.views.getView(editor);
      });
    });
  });

  describe("Words:", () => {
    describe("When a count argument is given", () => {
      it("should generate a single word if no argument", () => {
        let word = runLorem("_w").split(" ");
        expect(word).toHaveLength(1);
      });

      it("should generate x number of words", () => {
        expect(runLorem("_w2").split(" ")).toHaveLength(2);
        expect(runLorem("_w5").split(" ")).toHaveLength(5);
        expect(runLorem("_w10").split(" ")).toHaveLength(10);
      });
    });

    describe("When a size argument is given", () => {
      it("should be between positive finite number", () => {
        let word = runLorem("_w1").length;
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
        let sentence = runLorem("_s1"), firstChar = sentence.charAt(0);

        expect(firstChar === firstChar.toUpperCase()).toBe(true);
        expect(sentence.charAt(sentence.length - 1)).toBe(".");
      });
    });

    describe("When a count argument is given", () => {
      it("should generate a single sentence if no argument given", () => {
        let sentence = runLorem("_s1").split("\n\n");
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
        let paragraph = runLorem("_p1"), firstChar = paragraph.charAt(0);

        expect(firstChar === firstChar.toUpperCase()).toBe(true);
        expect(paragraph.charAt(paragraph.length - 1)).toBe(".");
      });
    });

    describe("When a count argument is given", () => {
      it("should generate a single paragraph if no argument given", () => {
        let paragraph = runLorem("_p1").split("\n\n");
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
      let link = runLorem("_link1");

      expect(link).toMatch(/^<a href=".*">/g);
      expect(link).toMatch(/<\/a>$/g);
    });

    describe("When a count argument is given", () => {
      it("should generate x number of list items", () => {
        expect(runLorem("_link2").match(/<a.*>/g)).toHaveLength(2);
        expect(runLorem("_link5").match(/<a.*>/g)).toHaveLength(5);
        expect(runLorem("_link10").match(/<a.*>/g)).toHaveLength(10);
      });
    });
  });

  describe("Lists: ", () => {
    describe("Ordered Lists: ", () => {
      it("should begin and end with ol tags", () => {
        let list = runLorem("_ol1");

        expect(list).toMatch(/^<ol>/g);
        expect(list).toMatch(/<\/ol>$/g);
      });

      describe("when a count argument is given", () => {
        it("should generate x number of list items", () => {
          expect(runLorem("_ol2").match(/<li>/g)).toHaveLength(2);
          expect(runLorem("_ol5").match(/<li>/g)).toHaveLength(5);
          expect(runLorem("_ol10").match(/<li>/g)).toHaveLength(10);
        });
      });
    });

    describe("Unordered Lists: ", () => {
      it("should begin and end with ol tags", () => {
        let list = runLorem("_ul1");

        expect(list).toMatch(/^<ul>/);
        expect(list).toMatch(/<\/ul>$/);
      });

      describe("when a count argument is given", () => {
        it("should generate x number of list items", () => {
          expect(runLorem("_ul2").match(/<li>/g)).toHaveLength(2);
          expect(runLorem("_ul5").match(/<li>/g)).toHaveLength(5);
          expect(runLorem("_ul10").match(/<li>/g)).toHaveLength(10);
        });
      });
    });
  });

  describe("HTML: ", () => {
    describe("When used with word, sentence & paragraph", () => {
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
          runLorem(`_p1_vlong_wrap${size}`).split("\n")[0].trim().length;

        expect(wrapped(10)).toBeLessThan(11);
        expect(wrapped(20)).toBeLessThan(21);
        expect(wrapped(30)).toBeLessThan(31);
        expect(wrapped(40)).toBeLessThan(41);
      });
    });

    describe("No Wrap: ", () => {
      it("should not have any linebreaks if nowrap", () => {
        expect(runLorem("_p1_vlong_nowrap").match(/\n/g)).toBe(null);
      });
    });
  });

  describe("Help: ", () => {
    it("should not change the editor", () => {
      expect(runLorem("_help")).toEqual("lorem_help");
      expect(runLorem("_?")).toEqual("lorem_?");
    });
  });

  describe("Errors: ", () => {
    it("should create a notification", () => {
      let tests = ["_d", "_d2", "_hello"];
      atom.notifications.clear();

      tests.forEach(test => runLorem(test));
      expect(atom.notifications.getNotifications()).toHaveLength(tests.length);
    });

    it("should have different notification messages", () => {
      let tests = {
        "_": "Unrecognized option '_'.",
        "__": "Two or more underscore characters adjacent to each other.",
        "_d": "Unrecognized option '_d'."
      };

      Object.keys(tests).forEach(test => {
        atom.notifications.clear();
        runLorem(test);
        let notif = atom.notifications.getNotifications()[0];
        expect(notif.options.detail).toEqual(tests[test]);
      });
    });
  });
});
