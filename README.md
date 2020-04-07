# @nteract/markdown

This package contains components that allow us to render Markdown text per the Commonmark specification. It also supports rendering in-line and block math using the LaTeX syntax.

## Installation

```
$ yarn add @nteract/markdown
```

```
$ npm install --save @nteract/markdown
```

## Usage

The example below shows how we can use this package to render Commonmark-specified Markdown with LaTeX math.

```javascript
import MarkdownRender from "@nteract/markdown";

export default () => {
  return (
    <MarkdownRender
      source={`Just some $\delta_{\alpha}$ math and __formatting__.`}
    />
  );
};
```

## Documentation

You can view the reference documentation for `@nteract/markdown` in the the [examples](./examples.md).

## Support

If you experience an issue while using this package or have a feature request, please file an issue on the [issue board](https://github.com/nteract/markdown/issues).

## License

[BSD-3-Clause](https://choosealicense.com/licenses/bsd-3-clause/)
