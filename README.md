[![Build Status](https://travis-ci.org/lambig/parameter-reduction.svg?branch=master)](https://travis-ci.org/lambig/parameter-reduction)

# parameter-reduction

Tired of defining parameter for resolvers? This might be your friend.

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
