/**
 * Formats number to en locale, replacing thousand separator with a custom one if defined
 *
 * @param {number} [n] - number to format
 * @param {string} [t_sep] - thousand separator
 *
 * @returns {string|undefined}
 */
export const formatNumber = (
  n?: number,
  t_sep?: string
): string | undefined => {
  if (n !== undefined && n !== null) {
    let s = n.toLocaleString("en");
    if (t_sep !== undefined) {
      s = s.replaceAll(",", t_sep);
    }
    return s;
  }
};

/**
 * Generates a range array with a defined step
 *
 * @param {number} start - start number
 * @param {number} end - end number
 * @param {number} [step] - step (default: 1)
 *
 * @returns {Array<number>}
 */
export const rangeArray = (
  start: number,
  end: number,
  step?: number
): Array<number> => {
  const result = [];
  for (let i = start; i <= end; i += step || 1) {
    result.push(i);
  }
  return result;
};

export interface ParseNumberParams {
  min?: number;
  max?: number;
  float?: boolean;
  allow_undefined?: boolean;
  allow_nan?: boolean;
}

/**
 * Parses a number from string
 *
 * @param {string} value - a string to parse
 * @param {ParseNumberParams} [params] - parameters
 *
 * @returns {number|undefined}
 */
export const parseNumber = (
  value: string,
  params?: ParseNumberParams
): number | undefined => {
  if (value.length === 0 && params?.allow_undefined) {
    return undefined;
  }
  const val = parseFloat(value);
  if (isNaN(val)) {
    if (params?.allow_nan) {
      return val;
    }
    throw new Error("invalid number");
  }
  if (params?.min !== undefined && val < params.min) {
    throw new Error(`the value must be ${params.min} or greater`);
  }
  if (params?.max !== undefined && val > params.max) {
    throw new Error(`the value must be ${params.max} or less`);
  }
  if (!params?.float && val % 1) {
    throw new Error("the value must be integer");
  }
  return val;
};

/**
 * Calculate a user-given formula with x var for a single number or an array of
 * numbers
 *
 * @param {string} [formula] - formula
 * @param {number|number[]} [n] - x value(s)
 *
 * @returns {(number|undefined)[]|number|undefined}
 * @throws if the formula is invalid
 */
export const calculateFormula = (
  formula?: string,
  n?: number | (number | undefined | null)[] | null
): (number | undefined)[] | number | undefined => {
  return Array.isArray(n)
    ? calculateFormulaBulk(formula, n)
    : calculateFormulaSingle(formula, n);
};

const calculateFormulaSingle = (
  formula?: string,
  n?: number | null
): number | undefined => {
  if (n !== undefined && n !== null) {
    if (!formula || formula === "x") {
      return n;
    } else {
      return evaluateMath(formula, { x: n });
    }
  }
};

const calculateFormulaBulk = (
  formula?: string,
  n?: (number | undefined | null)[]
): (number | undefined)[] | undefined => {
  if (n !== undefined && n !== null) {
    return n.map((a) => {
      return calculateFormulaSingle(formula, a);
    });
  }
};

function evaluateMath(expr: string, scope: any): number {
  const expression = expr.replaceAll("^", "**");
  return new Function(
    ...Object.keys(scope),
    `'use strict'; return (${expression})`
  )(...Object.values(scope));
}
