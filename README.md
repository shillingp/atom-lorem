# Lorem package

A simple and powerful lorem ipsum generator for [Atom editor][atom].

Ported with love from the [Lorem Ipsum][git-repo:brackets-lorem-ipsum] brackets plugin by [lkcampbell][git:lkcampbell]

![Lorem Overview](https://github.com/shillingp/atom-lorem/blob/master/resources/images/lorem-overview.gif?raw=true)


---

### How to Use
For basic lorem ipsum text using the default settings just use the keybind `alt+l`.

You can also add options to the lorem command with an underscore character followed by the option name. For example: `lorem_wrap40`. Multiple options can also be chained together. For example, typing `lorem_html_wrap40` and then pressing the `alt+l` will give you html formatted Lorem Ipsum text and a word wrap width of 40 characters. Using an unrecognized option will insert an error message into the document. Using more than one underscore character in a row (e.g. `lorem__html___p3`) will insert an error message into the document.

> **Note**: Options to the far right of the chain always have the highest priority. If two options in the chain conflict with each other, the option on the right will have precedence. For example, the command lorem_nowrap_wrap40 will insert Lorem Ipsum text with a word wrap width of 40 characters and the command lorem_wrap40_nowrap will insert Lorem Ipsum text with no word wrapping.

---

##### List of Current Options
**_p[count]:** Inserts a certain number of random Lorem Ipsum paragraphs into
the current document. The `count` option indicates how many paragraphs to insert.
For example, `lorem_p3` will insert three paragraphs into the document.
If the `count` option is not provided, one paragraph will be inserted.
If the type of Lorem Ipsum text is not specified, the extension will generate
paragraphs by default.

![Paragraph Example](https://github.com/shillingp/atom-lorem/blob/master/resources/images/lorem-p.gif?raw=true)

**_s[count]:** Inserts a certain number of random Lorem Ipsum sentences into
the current document. The `count` option indicates how many sentences to insert.
For example, `lorem_s3` will insert three sentences into the document.
If the `count` option is not provided, one sentence will be inserted.

![Sentence Example](https://github.com/shillingp/atom-lorem/blob/master/resources/images/lorem-s.gif?raw=true)

**_w[count]:** Inserts a certain number of random Lorem Ipsum words into the
current document. The `count` option indicates how many words to insert.
For example, `lorem_w40` will insert 40 random words into the document.
If the `count` option is not provided, one word will be inserted.

![Word Example](https://github.com/shillingp/atom-lorem/blob/master/resources/images/lorem-w.gif?raw=true)

**_short:** Makes all sentences or paragraphs short length.

**_medium:** Makes all sentences or paragraphs medium length.
If no size options are provided, the extension will use `_medium`
as the default option.

**_long:** Makes all sentences or paragraphs long length.

**_vlong:** Makes all sentences or paragraphs very long length.

![Sizes Example](https://github.com/shillingp/atom-lorem/blob/master/resources/images/lorem-sizes.gif?raw=true)

**_nowrap:** Inserts Lorem Ipsum text without any word wrapping.

**_wrap[width]:** Word wraps Lorem Ipsum text using the specified `width`
For example, `lorem_wrap40` will wrap the text at 40 characters. If a word wrap
option is not provided, the extension will use `_wrap80` as the default option.
If you want to turn word wrap off, use the `_nowrap` option.  This option has
no effect on the `_link`, `_ol`, or `_ul` options.

![Wrapping Example](https://github.com/shillingp/atom-lorem/blob/master/resources/images/lorem-wraps.gif?raw=true)

**_link[count]:** Inserts a certain number of random Lorem Ipsum HTML links into
the current document. The HTML link will always point to http://www.brackets.io.
The `count` option indicates how many links to insert. For example, `lorem_link3`
will insert three links, separated by page breaks, into the document. If the
`count` option is not provided, one link will be inserted. To avoid badly
formatted HTML, the `_link` option ignores any `_wrap` options and is always
set to `_nowrap`.

**_ol[count], _ul[count]:** Inserts a random Lorem Ipsum HTML list into
the current document. Use `_ol` for an ordered list and `_ul` for an unordered
list. The `count` option indicates how many list items to insert. For example,
`lorem_ol3` will insert an ordered list with three list items into the document.
If the `count` option is not provided, a list with one item will be inserted.
To avoid badly formatted HTML, both of these options ignore any `_wrap` options
and are always set to `_nowrap`.

**_fortune[count]:** For when you get sick of nonsensical Latin phrases, this
option will insert random fortunes (similar to the Unix fortune program) into
the current document.  The `count` option indicates how many fortunes to insert.
For example, `lorem_fortune3` will insert three fortunes into the document. If
the `count` option is not provided, one fortune will be inserted.

**_html:** Wraps Lorem Ipsum text in `<p></p>` tags so it displays correctly in
HTML. For options `_p`, `_s`, and `_fortune` each individual paragraph, sentence,
or fortune is wrapped. For options `_w` and `_link`, the entire collection of
words or links is wrapped. This option is not available for lists since lists
are not inline elements.

**_?, _help:** Displays help for the Lorem Ipsum extension.  If this option is used,
all other options will be ignored and no Lorem Ipsum text will be generated.

> **Note:** Any option that has a number associated with it (e.g. `_p3`, `_wrap40`)
can also be entered with the number portion in front of the option
(i.e. `_3p`, `_40wrap`) and it will work the same way.

---

### Contributing
This is my first atom package and I welcome all the help/support/feedback i can get so if you have any or would like to make a pull-request please feel free. Many thanks.

---

### License
MIT License: See `LICENSE` for more details.

[atom]: https://atom.io
[git:lkcampbell]: https://github.com/lkcampbell
[git-repo:brackets-lorem-ipsum]: https://github.com/lkcampbell/brackets-lorem-ipsum
