# Markdown API

<? @include readme/badges.md ?>

> API documentation generator

Declarative, extensible, language neutral and fast API comments to commonmark compliant markdown.

Designed for small to medium sized libraries, for large projects use one of the many other documentation tools. Uses `javascript` for fenced code blocks by default but you can [configure](#conf) this library for any language.

See [EXAMPLE.md](/EXAMPLE.md) or the [api](#api) for example output.

<? @include {=readme} install.md usage.md comments.md tags.md cues.md ?>

<? @exec mkapi index.js lib/*.js --title=API --level=2 ?>

<? @include {=readme} license.md links.md ?>
