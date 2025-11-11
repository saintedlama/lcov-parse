# LCOV file parser

Simple LCOV file parser

## Installation

```bash
npm install https://github.com/saintedlama/lcov-parse
```

## TypeScript Support

This package is now written in TypeScript and includes full type definitions. You can use it in both JavaScript and TypeScript projects.

## Usage

```typescript
const { parse } = require('lcov-parse');

// Parse LCOV string data
const lcovString = `TN:Example Test
SF:src/example.js
FN:1,exampleFunction
FN:5,anotherFunction
FNDA:10,exampleFunction
FNDA:5,anotherFunction
FNF:2
FNH:2
BRDA:3,0,0,5
BRDA:3,0,1,2
BRF:2
BRH:2
DA:1,10
DA:2,8
DA:3,7
DA:5,5
DA:6,5
LF:5
LH:5
end_of_record`;

const result = parse(lcovString);
if (result) {
  console.log(`Parsed ${result.length} file(s)`);
  console.log(`File: ${result[0].file}`);
  console.log(`Line coverage: ${result[0].lines.hit}/${result[0].lines.found}`);
  console.log(`Function coverage: ${result[0].functions.hit}/${result[0].functions.found}`);
  console.log(`Branch coverage: ${result[0].branches.hit}/${result[0].branches.found}`);
}
```

## Supported LCOV Fields

This parser supports the following LCOV format fields:

- `TN:` - Test name (optional)
- `SF:` - Source file path
- `FN:` - Function name and line number
- `FNDA:` - Function execution count
- `FNF:` - Functions found
- `FNH:` - Functions hit
- `BRDA:` - Branch data (line, block, branch, taken)
- `BRF:` - Branches found
- `BRH:` - Branches hit
- `DA:` - Line execution count
- `LF:` - Lines found
- `LH:` - Lines hit

The parser processes data between `SF:` (source file) and `end_of_record` markers.
