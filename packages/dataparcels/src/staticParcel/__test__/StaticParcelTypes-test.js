// @flow
import {Map, List} from 'immutable';
import StaticParcel from '../StaticParcel';

test('StaticParcelTypes should correctly identify primitive values', () => {
    var value = 123;
    expect(new StaticParcel(value).isParent()).toBe(false);
    expect(new StaticParcel(value).isIndexed()).toBe(false);
    expect(new StaticParcel(value).isChild()).toBe(false);
    expect(new StaticParcel(value).isElement()).toBe(false);
    expect(new StaticParcel(value).isTopLevel()).toBe(true);
});

test('StaticParcelTypes should correctly identify date', () => {
    var value = new Date();
    expect(new StaticParcel(value).isParent()).toBe(false);
    expect(new StaticParcel(value).isIndexed()).toBe(false);
    expect(new StaticParcel(value).isChild()).toBe(false);
    expect(new StaticParcel(value).isElement()).toBe(false);
    expect(new StaticParcel(value).isTopLevel()).toBe(true);
});

test('StaticParcelTypes should correctly identify object values', () => {
    var value = {
        a: "A"
    };
    expect(new StaticParcel(value).isParent()).toBe(true);
    expect(new StaticParcel(value).isIndexed()).toBe(false);
    expect(new StaticParcel(value).isChild()).toBe(false);
    expect(new StaticParcel(value).isElement()).toBe(false);
    expect(new StaticParcel(value).isTopLevel()).toBe(true);
});

test('StaticParcelTypes should correctly identify class instance values', () => {
    class Thing {
        foo = "123"
    }
    var value = new Thing();
    expect(new StaticParcel(value).isParent()).toBe(false);
    expect(new StaticParcel(value).isIndexed()).toBe(false);
    expect(new StaticParcel(value).isChild()).toBe(false);
    expect(new StaticParcel(value).isElement()).toBe(false);
    expect(new StaticParcel(value).isTopLevel()).toBe(true);
});

test('StaticParcelTypes should correctly identify unmutable compatible class instance values', () => {
    class UnmutableCompatible {
        __UNMUTABLE_COMPATIBLE__ = true;
        foo = "123";
    }
    var value = new UnmutableCompatible();
    expect(new StaticParcel(value).isParent()).toBe(true);
    expect(new StaticParcel(value).isIndexed()).toBe(false);
    expect(new StaticParcel(value).isChild()).toBe(false);
    expect(new StaticParcel(value).isElement()).toBe(false);
    expect(new StaticParcel(value).isTopLevel()).toBe(true);
});


test('StaticParcelTypes should correctly identify Immutable.js Map values', () => {
    var value = Map({
        a: "A"
    });
    expect(new StaticParcel(value).isParent()).toBe(true);
    expect(new StaticParcel(value).isIndexed()).toBe(false);
    expect(new StaticParcel(value).isChild()).toBe(false);
    expect(new StaticParcel(value).isElement()).toBe(false);
    expect(new StaticParcel(value).isTopLevel()).toBe(true);
});


test('StaticParcelTypes should correctly identify array values', () => {
    var value = [1,2,3];
    expect(new StaticParcel(value).isParent()).toBe(true);
    expect(new StaticParcel(value).isIndexed()).toBe(true);
    expect(new StaticParcel(value).isChild()).toBe(false);
    expect(new StaticParcel(value).isElement()).toBe(false);
    expect(new StaticParcel(value).isTopLevel()).toBe(true);
});

test('StaticParcelTypes should correctly identify Immutable.js List values', () => {
    var value = List([1,2,3]);
    expect(new StaticParcel(value).isParent()).toBe(true);
    expect(new StaticParcel(value).isIndexed()).toBe(true);
    expect(new StaticParcel(value).isChild()).toBe(false);
    expect(new StaticParcel(value).isElement()).toBe(false);
    expect(new StaticParcel(value).isTopLevel()).toBe(true);
});

test('StaticParcelTypes should correctly identify child values', () => {
    var value = {
        a: "A"
    };
    expect(new StaticParcel(value).get("a").isParent()).toBe(false);
    expect(new StaticParcel(value).get("a").isIndexed()).toBe(false);
    expect(new StaticParcel(value).get("a").isChild()).toBe(true);
    expect(new StaticParcel(value).get("a").isElement()).toBe(false);
    expect(new StaticParcel(value).get("a").isTopLevel()).toBe(false);
});

test('StaticParcelTypes should correctly identify element values', () => {
    var value = [1,2,3];
    expect(new StaticParcel(value).get(0).isParent()).toBe(false);
    expect(new StaticParcel(value).get(0).isIndexed()).toBe(false);
    expect(new StaticParcel(value).get(0).isChild()).toBe(true);
    expect(new StaticParcel(value).get(0).isElement()).toBe(true);
    expect(new StaticParcel(value).get(0).isTopLevel()).toBe(false);
});

test('StaticParcelTypes should correctly identify child values with getIn', () => {
    var value = {
        b: {
            a: "A"
        }
    };
    expect(new StaticParcel(value).getIn(["b","a"]).isParent()).toBe(false);
    expect(new StaticParcel(value).getIn(["b","a"]).isIndexed()).toBe(false);
    expect(new StaticParcel(value).getIn(["b","a"]).isChild()).toBe(true);
    expect(new StaticParcel(value).getIn(["b","a"]).isElement()).toBe(false);
    expect(new StaticParcel(value).getIn(["b","a"]).isTopLevel()).toBe(false);
});

test('StaticParcelTypes should correctly identify element values with getIn', () => {
    var value = {
        b: [1,2,3]
    };

    expect(new StaticParcel(value).getIn(["b",0]).isParent()).toBe(false);
    expect(new StaticParcel(value).getIn(["b",0]).isIndexed()).toBe(false);
    expect(new StaticParcel(value).getIn(["b",0]).isChild()).toBe(true);
    expect(new StaticParcel(value).getIn(["b",0]).isElement()).toBe(true);
    expect(new StaticParcel(value).getIn(["b",0]).isTopLevel()).toBe(false);
});

// // method creators

// // test('Correct methods are created for primitive values', () => {
// //     var value = 123;
// //     expect(() => new StaticParcel(value).set('A')).not.toThrow();
// //     expect(() => new StaticParcel(value).has('a')).toThrowError(`.has() is not a function`);
// //     expect(() => new StaticParcel(value).pop()).toThrowError(`.pop() is not a function`);
// //     expect(() => new StaticParcel(value).delete()).toThrowError(`.delete() cannot be called with 0 arguments`);
// //     expect(() => new StaticParcel(value).swapNext()).toThrowError(`.swapNext() cannot be called with 0 arguments`);
// // });

// // test('Correct methods are created for object values', () => {
// //     var value = {a: 123};
// //     expect(() => new StaticParcel(value).set('A')).not.toThrow();
// //     expect(() => new StaticParcel(value).has('a')).not.toThrow();
// //     expect(() => new StaticParcel(value).pop()).toThrowError(`.pop() is not a function`);
// //     expect(() => new StaticParcel(value).delete()).toThrowError(`.delete() cannot be called with 0 arguments`);
// //     expect(() => new StaticParcel(value).swapNext()).toThrowError(`.swapNext() cannot be called with 0 arguments`);
// // });

// // test('Correct methods are created for array values', () => {
// //     var value = [1,2,3];
// //     expect(() => new StaticParcel(value).set('A')).not.toThrow();
// //     expect(() => new StaticParcel(value).has('a')).not.toThrow();
// //     expect(() => new StaticParcel(value).pop()).not.toThrow();
// //     expect(() => new StaticParcel(value).delete()).toThrowError(`.delete() cannot be called with 0 arguments`);
// //     expect(() => new StaticParcel(value).swapNext()).toThrowError(`.swapNext() cannot be called with 0 arguments`);
// // });

// // test('Correct methods are created for object child values', () => {
// //     var value = {a: 123};
// //     expect(() => new StaticParcel(value).get("a").set('A')).not.toThrow();
// //     expect(() => new StaticParcel(value).get("a").has('a')).toThrowError(`.has() is not a function`);
// //     expect(() => new StaticParcel(value).get("a").pop()).toThrowError(`.pop() is not a function`);
// //     expect(() => new StaticParcel(value).get("a").delete()).not.toThrow();
// //     expect(() => new StaticParcel(value).get("a").swapNext()).toThrowError(`.swapNext() cannot be called with 0 arguments`);
// // });

// // test('Correct methods are created for array element values', () => {
// //     var value = [1,2,3];
// //     expect(() => new StaticParcel(value).get(0).set('A')).not.toThrow();
// //     expect(() => new StaticParcel(value).get(0).has('a')).toThrowError(`.has() is not a function`);
// //     expect(() => new StaticParcel(value).get(0).pop()).toThrowError(`.pop() is not a function`);
// //     expect(() => new StaticParcel(value).get(0).delete()).not.toThrow();
// //     expect(() => new StaticParcel(value).get(0).swapNext()).not.toThrow();
// // });

