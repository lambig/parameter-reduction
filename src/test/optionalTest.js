"use strict";
/*
  eslint-disable
    no-unused-expressions,
    max-nested-callbacks,
    max-statements
*/
const Optional = require("../main/optional"),
      chai = require("chai"),
      expect = chai.expect,
      assert = chai.assert;

describe("optional", () => {
  describe("isSet", () => {
    it("returns true unless undefined or null is set", () => {
      const isSet = new Optional(false),
            isSetNaN = new Optional(NaN),
            isSetZero = new Optional(0),
            notSet = new Optional(),
            setNull = new Optional(null);

      expect(isSet.isSet).to.true;
      expect(isSetNaN.isSet).to.true;
      expect(isSetZero.isSet).to.true;
      expect(notSet.isSet).to.false;
      expect(setNull.isSet).to.false;
    });
  });
  describe("entries", () => {
    it("throws exception", () => {
      const optional = new Optional(1);
      try {
        optional.entries();
        assert.fail();
      } catch (e) {
        expect(e.name).equal("NotExecutableMethodError");
        expect(e.message).equal("Cannot provide iterator from single value.");
      }
    });
  });
  describe("entries", () => {
    it("throws exception", () => {
      const optional = new Optional(1);
      try {
        optional.entries();
        assert.fail("didn't throw");
      } catch (e) {
        expect(e.name).equal("NotExecutableMethodError");
        expect(e.message).equal("Cannot provide iterator from single value.");
      }
    });
  });
  describe("every", () => {
    it("returns true when value matches criteria", () => {
      const match = new Optional(1),
            unMatch = new Optional(0),
            unSet = new Optional(),
            criteria = e => e > 0;

      expect(match.every(criteria)).to.true;
      expect(unMatch.every(criteria)).to.false;
      expect(unSet.every(criteria)).to.false;
    });
  });
  describe("filter", () => {
    it("applies filter", () => {
      const match = new Optional(1),
            unMatch = new Optional(0),
            unSet = new Optional(),
            criteria = e => e > 0;

      expect(match.filter(criteria).value).to.equal(1);
      expect(unMatch.filter(criteria).value).to.undefined;
      expect(unSet.filter(criteria).value).to.undefined;
    });
  });
  describe("find", () => {
    it("finds value", () => {
      const match = new Optional(1),
            unMatch = new Optional(0),
            unSet = new Optional(),
            criteria = e => e > 0;

      expect(match.find(criteria)).to.equal(1);
      expect(unMatch.find(criteria)).to.undefined;
      expect(unSet.find(criteria)).to.undefined;
    });
  });
  describe("findIndex", () => {
    it("finds index", () => {
      const match = new Optional(1),
            unMatch = new Optional(0),
            unSet = new Optional(),
            criteria = e => e > 0;

      expect(match.findIndex(criteria)).to.equal(0);
      expect(unMatch.findIndex(criteria)).to.equal(-1);
      expect(unSet.findIndex(criteria)).to.equal(-1);
    });
  });
  describe("forEach", () => {
    it("executes action", () => {
      const match = new Optional(1),
            unSet = new Optional(),
            success = value => expect(value).to.equal(1);

      match.forEach(success);
      unSet.forEach(() => assert.fail("unexpected execution"));
    });
  });
  describe("concat", () => {
    it("value and arg", () => {
      const optional = new Optional(1),
            actual = optional.concat(2);
      expect(actual).to.deep.equal([1, 2]);
    });
    it("value and arg array", () => {
      const optional = new Optional(1),
            actual = optional.concat([2, 3]);
      expect(actual).to.deep.equal([1, 2, 3]);
    });
    it("empty value and arg", () => {
      const optional = new Optional(),
            actual = optional.concat(2);
      expect(actual).to.deep.equal([2]);
    });
    it("empty value and arg array", () => {
      const optional = new Optional(),
            actual = optional.concat([2, 3]);
      expect(actual).to.deep.equal([2, 3]);
    });
    it("value and empty arg", () => {
      const optional = new Optional(1),
            actual = optional.concat();
      expect(actual).to.deep.equal([1]);
    });
    it("empty value and arg", () => {
      const optional = new Optional(),
            actual = optional.concat();
      expect(actual).to.deep.equal([]);
    });
    it("empty value and arg array", () => {
      const optional = new Optional(),
            actual = optional.concat([2, 3]);
      expect(actual).to.deep.equal([2, 3]);
    });
    it("array value and arg", () => {
      const optional = new Optional([1]),
            actual = optional.concat(2);
      expect(actual).to.deep.equal([[1], 2]);
    });
    it("array value and arg array", () => {
      const optional = new Optional([1]),
            actual = optional.concat([2]);
      expect(actual).to.deep.equal([[1], 2]);
    });
  });
  describe("keys", () => {
    it("throws exception", () => {
      const optional = new Optional(1);
      try {
        optional.keys();
        assert.fail();
      } catch (e) {
        expect(e.name).equal("NotExecutableMethodError");
        expect(e.message).equal("Cannot provide iterator of keys from single value.");
      }
    });
  });
  describe("map", () => {
    it("maps value", () => {
      const match = new Optional(1),
            unSet = new Optional(),
            addOne = value => value + 1;

      expect(match.map(addOne).value).to.equal(2);
      expect(unSet.map(addOne).value).to.undefined;
    });
  });
  describe("reduce", () => {
    it("throws exception", () => {
      const optional = new Optional(1);
      try {
        optional.reduce();
        assert.fail();
      } catch (e) {
        expect(e.name).equal("NotExecutableMethodError");
        expect(e.message).equal("Cannot reduce single value.");
      }
    });
  });
  describe("reduceRight", () => {
    it("throws exception", () => {
      const optional = new Optional(1);
      try {
        optional.reduceRight();
        assert.fail();
      } catch (e) {
        expect(e.name).equal("NotExecutableMethodError");
        expect(e.message).equal("Cannot reduce single value.");
      }
    });
  });
  describe("some", () => {
    it("returns true when value matches criteria", () => {
      const match = new Optional(1),
            unMatch = new Optional(0),
            unSet = new Optional(),
            criteria = e => e > 0;

      expect(match.some(criteria)).to.true;
      expect(unMatch.some(criteria)).to.false;
      expect(unSet.some(criteria)).to.false;
    });
  });
  describe("values", () => {
    it("throws exception", () => {
      const optional = new Optional(1);
      try {
        optional.values();
        assert.fail();
      } catch (e) {
        expect(e.name).equal("NotExecutableMethodError");
        expect(e.message).equal("Cannot provide iterator of values from single value.");
      }
    });
  });
  describe("value", () => {
    it("returns value", () => {
      const isSet = new Optional(false),
            isSetNaN = new Optional(NaN),
            isSetZero = new Optional(0),
            notSet = new Optional(),
            setNull = new Optional(null);
      expect(isSet.value).to.equal(false);
      expect(isSetNaN.value).to.NaN;
      expect(isSetZero.value).to.equal(0);
      expect(notSet.value).to.undefined;
      expect(setNull.value).to.null;
    });
  });
});
