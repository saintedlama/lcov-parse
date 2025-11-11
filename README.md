## LCOV file parser

Simple LCOV file parser

## Installation

    npm install lcov-parse

## TypeScript Support

This package is now written in TypeScript and includes full type definitions. You can use it in both JavaScript and TypeScript projects.

## Usage

**CommonJS/JavaScript:**
```javascript
var parse = require('lcov-parse');
```

**TypeScript/ESM:**
```typescript
import parse, { parseAsync, LcovFile } from 'lcov-parse';
```

**Basic usage:**
```javascript

    parse('./path/to/file.info', function(err, data) {
        //process the data here
    });

or

    parse(lcovString, function(err, data) {
        //process the data here
    });

**Promise-based API (TypeScript/Modern JS):**
```javascript
import { parseAsync } from 'lcov-parse';

try {
    const data = await parseAsync('./path/to/file.info');
    // process the data here
} catch (err) {
    console.error('Parse error:', err);
}
```


## Formatting

Using this as a guide: http://ltp.sourceforge.net/coverage/lcov/geninfo.1.php

It will return JSON like this:

```
 {
    "title": "Test #1",
    "file": "anim-base/anim-base-coverage.js",
    "functions": {
      "hit": 23,
      "found": 29,
      "details": [
        {
          "name": "(anonymous 1)",
          "line": 7,
          "hit": 6
        },
        {
          "name": "(anonymous 2)",
          "line": 620,
          "hit": 225
        },
        {
          "name": "_end",
          "line": 516,
          "hit": 228
        }
      ]
    }
    "lines": {
      "found": 181,
      "hit": 143,
      "details": [
        {
          "line": 7,
          "hit": 6
        },
        {
          "line": 29,
          "hit": 6
        }
      ]
    }
}
```


## Cli Usage

    lcov-parse ./lcov.info

or

    cat lcov.info | xargs -0 lcov-parse


## Development

This project uses modern development tools:

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Vitest** for testing

### Available Scripts

    npm run build        # Compile TypeScript to JavaScript
    npm run test         # Run tests in watch mode
    npm run test:run     # Run tests once
    npm run test:coverage # Run tests with coverage report
    npm run lint         # Check code with ESLint
    npm run lint:fix     # Fix linting issues automatically
    npm run format       # Format code with Prettier
    npm run format:check # Check if code is formatted

### Building

    npm run build

The compiled JavaScript will be in the `dist/` directory.

## Tests

    npm install && npm test


## CI/CD

This project uses GitHub Actions for continuous integration and deployment:

### Workflows

- **CI/CD** (`ci.yml`) - Runs tests, linting, and builds on multiple Node.js versions (16, 18, 20, 22) across Linux, Windows, and macOS
- **Security** (`security.yml`) - Runs security audits, CodeQL analysis, and dependency reviews
- **Release** (`release.yml`) - Handles automated releases using semantic versioning
- **Auto Label** (`auto-label.yml`) - Automatically labels pull requests based on file changes and size

### Badges

![CI/CD](https://github.com/saintedlama/lcov-parse/workflows/CI/CD/badge.svg)
![Security](https://github.com/saintedlama/lcov-parse/workflows/Security%20&%20Dependencies/badge.svg)

### Running CI Locally

You can run the same checks that run in CI:

```bash
npm run ci  # Runs lint, format check, build, and tests
```

### Release Process

Releases are automated using semantic versioning:

1. Push changes to `main`/`master` branch
2. GitHub Actions will analyze commit messages
3. If there are releasable changes, a new version will be published automatically

For manual releases, use the Release workflow in the GitHub Actions tab.

## Build Status

[![Build Status](https://secure.travis-ci.org/davglass/lcov-parse.png?branch=master)](http://travis-ci.org/davglass/lcov-parse)
