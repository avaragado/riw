// @flow
// main entry point

import add from './add';

const xx = { a: 1, b: 2 };
const yy = { ...xx, c: 3 };

console.log('hello', yy, add(1, 2));
