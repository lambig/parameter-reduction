"use strict";
/*
  eslint-disable
    no-unused-expressions,
    max-nested-callbacks,
    max-statements
*/
const {
        wrap,
        unwrap,
        map,
        filter,
        sort,
        reduce,
        reduceRight,
        forEach,
        concat,
        head,
        tail,
        init,
        last,
        flatten,
        join,
        sift,
        siftBy
      } = require("../main/parameterReduction"),
      chai = require("chai"),
      expect = chai.expect;

describe("parameterReduction", () => {
  const greaterThan = num => el => el > num,
        add = num => el => el + num,
        throwError = message => () => {
          throw new Error(message);
        };
  describe("single", () => {
    it("handling optional", () =>
      Promise.resolve(1)
        .then(wrap)
        .then(filter(greaterThan(0)))
        .then(map(add(1)))
        .then(unwrap)
        .then(v => expect(v).equal(2)));
    it("handling optional", () =>
      Promise.resolve(-1)
        .then(wrap)
        .then(filter(greaterThan(0))) //returns empty optional
        .then(map(add(1))) // do nothing
        .then()
        .then(unwrap)
        .then(v => expect(v).to.undefined));
    it("doing action with value", done => {
      Promise.resolve(false)
        .then(wrap)
        .then(forEach(done));
    });
    it("not doing action without value", () =>
      Promise.resolve(false)
        .then(wrap)
        .then(filter(e => !!e))
        .then(forEach(throwError("unexpected invocation of foreach action"))));
    it("double wrapping / unwrapping causes no harm", () =>
      Promise.resolve({ val: 1 })
        .then(wrap)
        .then(wrap)
        .then(
          map(o => {
            o.val += 1;
            return o;
          })
        )
        .then(unwrap)
        .then(unwrap)
        .then(({ val }) => expect(val).to.equal(2)));
    it("without wrapping ends up an error", () => {
      Promise.resolve(false)
        .then(filter(e => !!e))
        .then(throwError("didn't throw an expected error"))
        .catch(({ name, message }) => {
          expect(name).to.equal("IllegalArgumentError");
          expect(message).to.equal("Not iterable nor optional object has given. You might want to 'wrap'.");
        });
    });
  });
  describe("array", () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    describe("map", () => {
      it("mapping", () =>
        Promise.resolve(input)
          .then(map(n => n + 1))
          .then(actual => expect(actual).to.deep.equal([2, 3, 4, 5, 6, 7, 8, 9, 10, 11])));
      it("no values", () =>
        Promise.resolve([])
          .then(map(n => n + 1))
          .then(actual => expect(actual).to.deep.equal([])));
    });
    describe("filter", () => {
      it("filtering", () =>
        Promise.resolve(input)
          .then(filter(n => n % 2))
          .then(actual => expect(actual).to.deep.equal([1, 3, 5, 7, 9])));
      it("no values", () =>
        Promise.resolve([])
          .then(filter(n => n % 2))
          .then(actual => expect(actual).to.deep.equal([])));
    });
    describe("sort", () => {
      it("sorting", () =>
        Promise.resolve(input)
          .then(sort((a, b) => b - a))
          .then(actual => expect(actual).to.deep.equal([10, 9, 8, 7, 6, 5, 4, 3, 2, 1])));
      it("no values", () =>
        Promise.resolve([])
          .then(sort((a, b) => b - a))
          .then(actual => expect(actual).to.deep.equal([])));
    });
    describe("reduce", () => {
      it("reducing", () =>
        Promise.resolve(input)
          .then(reduce((r, e) => r + e))
          .then(actual => expect(actual).to.equal(55)));
      it("reducing with initial", () =>
        Promise.resolve(input)
          .then(reduce((r, e) => r + e, ""))
          .then(actual => expect(actual).to.equal("12345678910")));
      it("no values with initial", () =>
        Promise.resolve([])
          .then(reduce((r, e) => r + e, ""))
          .then(actual => expect(actual).to.equal("")));
      it("no values nor initial", () =>
        Promise.resolve([])
          .then(reduce((r, e) => r + e))
          .then(throwError("Unexpected invocation"))
          .catch(({ name, message }) => {
            expect(name).to.equal("TypeError");
            expect(message).to.equal("Reduce of empty array with no initial value");
          }));
    });
    describe("reduceRight", () => {
      it("reducing", () =>
        Promise.resolve(input)
          .then(reduceRight((r, e) => r + e))
          .then(actual => expect(actual).to.equal(55)));
      it("reducing with initial", () =>
        Promise.resolve(input)
          .then(reduceRight((r, e) => r + e, ""))
          .then(actual => expect(actual).to.equal("10987654321")));
      it("no values with initial", () =>
        Promise.resolve([])
          .then(reduceRight((r, e) => r + e, ""))
          .then(actual => expect(actual).to.equal("")));
      it("no values nor initial", () =>
        Promise.resolve([])
          .then(reduceRight((r, e) => r + e))
          .then(throwError("Unexpected invocation"))
          .catch(({ name, message }) => {
            expect(name).to.equal("TypeError");
            expect(message).to.equal("Reduce of empty array with no initial value");
          }));
    });

    describe("concat", () => {
      it("concatenation", () =>
        Promise.resolve(input)
          .then(concat(11))
          .then(concat([12, 13]))
          .then(actual => expect(actual).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])));
    });
    describe("head", () => {
      it("getting head", () =>
        Promise.resolve(input)
          .then(head)
          .then(actual => expect(actual).to.equal(1)));
      it("single element", () =>
        Promise.resolve([1])
          .then(head)
          .then(actual => expect(actual).to.equal(1)));
      it("empty", () =>
        Promise.resolve([])
          .then(head)
          .then(actual => expect(actual).to.undefined));
    });
    describe("tail", () => {
      it("getting tail", () =>
        Promise.resolve(input)
          .then(tail)
          .then(actual => expect(actual).to.deep.equal([2, 3, 4, 5, 6, 7, 8, 9, 10])));
      it("single element", () =>
        Promise.resolve([1])
          .then(tail)
          .then(actual => expect(actual).to.deep.equal([])));
      it("empty", () =>
        Promise.resolve([])
          .then(tail)
          .then(actual => expect(actual).to.deep.equal([])));
    });
    describe("last", () => {
      it("getting last", () =>
        Promise.resolve(input)
          .then(last)
          .then(actual => expect(actual).to.equal(10)));
      it("single element", () =>
        Promise.resolve([1])
          .then(last)
          .then(actual => expect(actual).to.equal(1)));
      it("empty", () =>
        Promise.resolve([])
          .then(last)
          .then(actual => expect(actual).to.undefined));
    });
    describe("init", () => {
      it("getting init", () =>
        Promise.resolve(input)
          .then(init)
          .then(actual => expect(actual).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9])));
      it("single element", () =>
        Promise.resolve([1])
          .then(init)
          .then(actual => expect(actual).to.deep.equal([])));
      it("empty", () =>
        Promise.resolve([])
          .then(init)
          .then(actual => expect(actual).to.deep.equal([])));
    });
    describe("join", () => {
      it("joining", () =>
        Promise.resolve(input)
          .then(join(","))
          .then(actual => expect(actual).to.equal("1,2,3,4,5,6,7,8,9,10")));
      it("no values", () =>
        Promise.resolve([])
          .then(join(","))
          .then(actual => expect(actual).to.equal("")));
    });
    describe("flaten", () => {
      it("flattening", () =>
        Promise.resolve([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
          .then(flatten)
          .then(actual => expect(actual).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9])));
      it("no values", () =>
        Promise.resolve([])
          .then(flatten)
          .then(actual => expect(actual).to.deep.equal([])));
      it("empty element", () =>
        Promise.resolve([[], [], []])
          .then(flatten)
          .then(actual => expect(actual).to.deep.equal([])));
    });
    describe("sift", () => {
      it("sifting", () => {
        const actual = sift(input).by(
          n => n > 5, //
          n => n < 0,
          n => !(n % 2),
          n => n === 5
        );

        expect(actual).to.deep.equal([
          [6, 7, 8, 9, 10], //
          [],
          [2, 4],
          [5],
          [1, 3]
        ]);
      });
      it("no filters", () => {
        const actual = sift(input).by();

        expect(actual).to.deep.equal([input]);
      });
      it("no values", () => {
        const actual = sift([]).by(
          n => n > 5, //
          n => n < 0,
          n => !(n % 2),
          n => n === 5
        );

        expect(actual).to.deep.equal([
          [], //
          [],
          [],
          [],
          []
        ]);
      });
    });
    describe("siftBy", () => {
      it("sifting", () => {
        const actual = siftBy(
          n => n > 5, //
          n => n < 0,
          n => !(n % 2),
          n => n === 5
        )(input);

        expect(actual).to.deep.equal([
          [6, 7, 8, 9, 10], //
          [],
          [2, 4],
          [5],
          [1, 3]
        ]);
      });
      it("no filters", () => {
        const actual = siftBy()(input);
        expect(actual).to.deep.equal([input]);
      });
      it("no values", () => {
        const actual = siftBy(
          n => n > 5, //
          n => n < 0,
          n => !(n % 2),
          n => n === 5
        )([]);

        expect(actual).to.deep.equal([
          [], //
          [],
          [],
          [],
          []
        ]);
      });
    });
  });
});
