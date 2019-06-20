[![Build Status](https://travis-ci.org/lambig/parameter-reduction.svg?branch=master)](https://travis-ci.org/lambig/parameter-reduction)

# parameter-reduction

Tired of defining parameter for resolvers? This might be your friend.
## FEATURING

### Calling array methods
  * array methods
    * map
    * filter
    * sort
    * reduce
    * reduceRight
    * forEach
    * join
  * optional methods
    * map
    * filter
    * forEach

### Optional
  wraps single values and enables you to handle it like arrays.
  
### Utility methods
#### flatten
flattens array of arrays to array (reduce 1 dimension)
```javascript
const { flatten } = require("parameter-reduction");
flatten([[1, 2, 3], [4, 5, 6], [7, 8, 9]]) //returns [1, 2, 3, 4, 5, 6, 7, 8, 9]
```
#### sift
sift elements with multiple criterias, and reserve the rests.
```javascript
const { sift } = require("parameter-reduction");
sift([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  .by(
    n => n > 5,
    n => n < 0,
    n => !(n % 2),
    n => n === 5
    );
/*
 * returns
 * [
 *   [6, 7, 8, 9, 10], //
 *   [],
 *   [2, 4],
 *   [5],
 *   [1, 3]
 * ]
 */
```
#### siftBy
callback-friendly implement of sift, you can give criterias first.
```javascript
const { siftBy } = require("parameter-reduction");
Promise
  .resolve([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  .then(siftBy(
    n => n > 5,
    n => n < 0,
    n => !(n % 2),
    n => n === 5
  ));             
/*
 * resolves
 * [
 *   [6, 7, 8, 9, 10],
 *   [],
 *   [2, 4],
 *   [5],
 *   [1, 3]
 * ]
 */
```

## USAGE

### You can make this

```javascript
const add = increment => num => num + increment,
  byBeingOdd = num => num % 2,
  sum = (soFar, current) => soFar + current;

Promise.resolve([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  .then(arr => arr.map(add(1)))
  .then(arr => arr.filter(byBeingOdd))
  .then(arr => arr.reduce(sum));
```

### Like this!

```javascript
const { map, filter, reduce } = require("parameter-reduction"),
  add = increment => num => num + increment,
  byBeingOdd = num => num % 2,
  sum = (soFar, current) => soFar + current;

Promise.resolve([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  .then(map(add(1)))
  .then(filter(byBeingOdd))
  .then(reduce(sum));
```

### Handling single value?

```javascript
const add = increment => num => num + increment,
  byBeingOdd = num => num % 2;

Promise.resolve(5) //uh-oh. this is going to be a trouble someday.
  .then(elem => (byBeingOdd(elem) ? elem : null)) //what if null / undefined?
  .then(elem => add(1));
```

### No problem, you can do it like this.

```javascript
const { wrap, map, filter, unwrap } = require("parameter-reduction"),
  add = increment => num => num + increment,
  byBeingOdd = num => num % 2;

Promise.resolve(5) //now, concerns are separated.
  .then(wrap)
  .then(filter(byBeingOdd))
  .then(map(add(1)))
  .then(unwrap);
```
