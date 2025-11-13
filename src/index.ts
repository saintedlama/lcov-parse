/*
Copyright (c) 2012, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://yuilibrary.com/license/
*/
export type LineDetails = {
  line: number;
  hit: number;
};

export type FunctionDetails = {
  name: string;
  line: number;
  hit?: number;
};

export type BranchDetails = {
  line: number;
  block: number;
  branch: number;
  taken: number;
};

export type CoverageSection = {
  found: number;
  hit: number;
  details: LineDetails[] | FunctionDetails[] | BranchDetails[];
};

export type LcovFile = {
  title?: string;
  file: string;
  lines: {
    found: number;
    hit: number;
    details: LineDetails[];
  };
  functions: {
    found: number;
    hit: number;
    details: FunctionDetails[];
  };
  branches: {
    found: number;
    hit: number;
    details: BranchDetails[];
  };
};

export function parse(
  str: string,
  options: { warnOnUnknown: boolean } = { warnOnUnknown: false }
): LcovFile[] | undefined {
  const data: LcovFile[] = [];
  let item: LcovFile = {
    file: '',
    lines: {
      found: 0,
      hit: 0,
      details: [],
    },
    functions: {
      hit: 0,
      found: 0,
      details: [],
    },
    branches: {
      hit: 0,
      found: 0,
      details: [],
    },
  };

  ['end_of_record'].concat(str.split('\n')).forEach((line: string) => {
    line = line.trim();
    const allparts = line.split(':');
    const parts = [allparts.shift() || '', allparts.join(':')];
    let lines: string[];
    let fn: string[];

    const key = parts[0]?.toUpperCase() || '';
    const value = parts[1] || '';

    switch (key) {
      case 'TN':
        item.title = value.trim();
        break;
      case 'SF':
        item.file = parts.slice(1).join(':').trim();
        break;
      case 'FNF':
        item.functions.found = Number(value.trim());
        break;
      case 'FNH':
        item.functions.hit = Number(value.trim());
        break;
      case 'LF':
        item.lines.found = Number(value.trim());
        break;
      case 'LH':
        item.lines.hit = Number(value.trim());
        break;
      case 'DA':
        if (value) {
          lines = value.split(',');
          if (lines.length >= 2) {
            item.lines.details.push({
              line: Number(lines[0]),
              hit: Number(lines[1]),
            });
          }
        }
        break;
      case 'FN':
        if (value) {
          fn = value.split(',');
          if (fn.length >= 2 && fn[1]) {
            item.functions.details.push({
              name: fn[1],
              line: Number(fn[0]),
            });
          }
        }
        break;
      case 'FNDA':
        if (value) {
          fn = value.split(',');
          if (fn.length >= 2) {
            item.functions.details.some((i, k) => {
              if (i.name === fn[1] && i.hit === undefined) {
                const functionDetail = item.functions.details[k];
                if (functionDetail) {
                  functionDetail.hit = Number(fn[0]);
                }
                return true;
              }
              return false;
            });
          }
        }
        break;
      case 'BRDA':
        if (value) {
          fn = value.split(',');
          if (fn.length >= 4) {
            item.branches.details.push({
              line: Number(fn[0]),
              block: Number(fn[1]),
              branch: Number(fn[2]),
              taken: fn[3] === '-' ? 0 : Number(fn[3]),
            });
          }
        }
        break;
      case 'BRF':
        item.branches.found = Number(value);
        break;
      case 'BRH':
        item.branches.hit = Number(value);
        break;
      default:
        if (options?.warnOnUnknown && key !== 'END_OF_RECORD' && key !== '') {
          // eslint-disable-next-line no-console
          console.warn(`lcov-parse: Unknown LCOV key encountered: ${key}`);
        }
    }

    if (line.indexOf('end_of_record') > -1) {
      data.push(item);
      item = {
        file: '',
        lines: {
          found: 0,
          hit: 0,
          details: [],
        },
        functions: {
          hit: 0,
          found: 0,
          details: [],
        },
        branches: {
          hit: 0,
          found: 0,
          details: [],
        },
      };
    }
  });

  data.shift();

  if (data.length == 0) {
    return undefined;
  }

  return data;
}
