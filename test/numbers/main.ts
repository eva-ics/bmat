const numbers = require("../../dist/numbers.cjs");

const parseNumber = numbers.parseNumber;

try {
  console.log(parseNumber(-2.1, { float: false }));
} catch (e) {
  console.error(e);
}
try {
  console.log(parseNumber(-2.1, { float: true }));
} catch (e) {
  console.error(e);
}
