## Comments

Comments are parsed from `/**...*/` at the moment, later the aim is to support other styles of comment declarations.

## Description

Whilst many [tags](#tags) allow for a description parameter it is recommended that the description starts the comment so that it is more prominent.

```javascript
/**
 *  Module description.
 *
 *  @module ModuleName
 */
```

If you only have a short description use the `description` tag parameter:

```javascript
/**
 *  @module ModuleName Short module description.
 */
```

