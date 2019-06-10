"use strict";
const Optional = require("./optional");
let unDef;
const map = mapping => (value = []) => normalize(value).map(mapping);
const filter = filtering => (value = []) => normalize(value).filter(filtering),
      sort = sorter => (value = []) => value.slice().sort(sorter),
      reduce = (reduction, initial) => (value = []) => initial !== unDef ? value.reduce(reduction, initial) : value.reduce(reduction),
      reduceRight = (reduction, initial) => (value = []) =>
        initial !== unDef ? value.reduceRight(reduction, initial) : value.reduceRight(reduction),
      forEach = action => (value = []) => normalize(value).forEach(action);
const join = delimiter => (value = []) => value.join(delimiter);
/**
 * flatten array (minus one dimension)
 * @param {*} arrays n dimension array
 * @returns {array} n-1 dimension array
 */
const flatten = (arrays = []) => arrays.reduce((result, array = []) => result.concat(array), []);
/**
 * make argument Optional, and enables to accept map / filter functions
 */
const wrap = value => value instanceof Optional ? value : new Optional(value);
/**
 * get value from Optional
 */
const unwrap = value => value instanceof Optional ? value.value : value;
/**
 * sift array elements by multiple filters.
 * [0, 1, 2, 3, 4, 5].sift(
 *   prime,
 *   odd,
 *   greaterThan3
 * );
 * will return
 * [
 *   [2, 3, 5],
 *   [1],
 *   [4],
 *   [0] <- left
 * ]
 *
 * @param {*} array array you like to sift
 * @returns array of element arrays. array has with length of filters + 1(for left elements)
 */
const sift = (array = []) => {
  const separate = (ar, filter) =>
    ar.reduce(
      ([matched, unmatched], elem) => [filter(elem) ? matched.concat(elem) : matched, !filter(elem) ? unmatched.concat(elem) : unmatched],
      [[], []]
    );
  return {
    /**
     * do sift by filters
     * @param {Function} filters filter(s)
     */
    by: (...filters) => {
      const [matchedResult, left] = filters.reduce(
        ([result, l], filter) => {
          const [matched, unmatched] = separate(l, filter);
          return [result.concat([matched]), unmatched];
        },
        [[], array]
      );
      return matchedResult.concat([left]);
    }
  };
};
/**
 * Variation of sift. You can set filters first, and wait for the actual values.
 * @param  {...any} filters
 */
const siftBy = (...filters) => value => sift(value).by.apply(null, filters);

const normalize = value => {
        if (value instanceof Optional) return value;
        checkIterable(value);
        return value;
      },
      checkIterable = (value = {}) => {
        if (typeof value[Symbol.iterator] !== "function") throw error();
      },
      error = () => {
        const e = new Error("Not iterable nor optional object has given. You might want to 'wrap'.");
        e.name = "IllegalArgumentError";
        return e;
      };

module.exports = { wrap, unwrap, map, filter, sort, reduce, reduceRight, forEach, flatten, join, sift, siftBy };
