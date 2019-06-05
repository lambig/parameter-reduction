"use strict";
let undef;
const values = new WeakMap();
const notSet = value => value === undef || value === null,
      filterize = (filtering, optional) => filtering(optional.value, 0, [optional.value]) ? optional : new Optional(),
      error = message => ({ name: "NotExecutableMethodError", message });

class Optional {
  constructor(value) {
    values.set(this, value);
  }
  get isSet() {
    return !notSet(this.value);
  }
  entries() {
    throw error("Cannot provide iterator from single value.");
  }
  every(evaluator) {
    return this.isSet ? [this.value].every(evaluator) : false;
  }
  filter(filtering) {
    return this.isSet ? filterize(filtering, this) : this;
  }
  find(evaluator) {
    return this.isSet ? [this.value].find(evaluator) : undef;
  }
  findIndex(evaluator) {
    return this.isSet ? [this.value].findIndex(evaluator) : -1;
  }
  forEach(action) {
    if (this.isSet) [this.value].forEach(action);
  }
  keys() {
    throw error("Cannot provide iterator of keys from single value.");
  }
  map(mapping) {
    return this.isSet ? new Optional([this.value].map(mapping)[0]) : this;
  }
  reduce() {
    throw error("Cannot reduce single value.");
  }
  reduceRight() {
    throw error("Cannot reduce single value.");
  }
  some(evaluator) {
    return this.every(evaluator);
  }
  values() {
    throw error("Cannot provide iterator of values from single value.");
  }
  get value() {
    return values.get(this);
  }
}

module.exports = Optional;
