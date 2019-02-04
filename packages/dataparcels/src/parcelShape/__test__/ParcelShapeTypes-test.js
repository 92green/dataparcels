// @flow
import {Map, List} from 'immutable';
import ParcelShape from '../ParcelShape';

test('ParcelShapeTypes should correctly identify primitive values', () => {
    var value = 123;
    expect(new ParcelShape(value).isParent()).toBe(false);
    expect(new ParcelShape(value).isIndexed()).toBe(false);
    expect(new ParcelShape(value).isChild()).toBe(false);
    expect(new ParcelShape(value).isElement()).toBe(false);
    expect(new ParcelShape(value).isTopLevel()).toBe(true);
});

test('ParcelShapeTypes should correctly identify date', () => {
    var value = new Date();
    expect(new ParcelShape(value).isParent()).toBe(false);
    expect(new ParcelShape(value).isIndexed()).toBe(false);
    expect(new ParcelShape(value).isChild()).toBe(false);
    expect(new ParcelShape(value).isElement()).toBe(false);
    expect(new ParcelShape(value).isTopLevel()).toBe(true);
});

test('ParcelShapeTypes should correctly identify object values', () => {
    var value = {
        a: "A"
    };
    expect(new ParcelShape(value).isParent()).toBe(true);
    expect(new ParcelShape(value).isIndexed()).toBe(false);
    expect(new ParcelShape(value).isChild()).toBe(false);
    expect(new ParcelShape(value).isElement()).toBe(false);
    expect(new ParcelShape(value).isTopLevel()).toBe(true);
});

test('ParcelShapeTypes should correctly identify class instance values', () => {
    class Thing {
        foo = "123"
    }
    var value = new Thing();
    expect(new ParcelShape(value).isParent()).toBe(false);
    expect(new ParcelShape(value).isIndexed()).toBe(false);
    expect(new ParcelShape(value).isChild()).toBe(false);
    expect(new ParcelShape(value).isElement()).toBe(false);
    expect(new ParcelShape(value).isTopLevel()).toBe(true);
});

test('ParcelShapeTypes should correctly identify unmutable compatible class instance values', () => {
    class UnmutableCompatible {
        __UNMUTABLE_COMPATIBLE__ = true;
        foo = "123";
    }
    var value = new UnmutableCompatible();
    expect(new ParcelShape(value).isParent()).toBe(true);
    expect(new ParcelShape(value).isIndexed()).toBe(false);
    expect(new ParcelShape(value).isChild()).toBe(false);
    expect(new ParcelShape(value).isElement()).toBe(false);
    expect(new ParcelShape(value).isTopLevel()).toBe(true);
});


test('ParcelShapeTypes should correctly identify Immutable.js Map values', () => {
    var value = Map({
        a: "A"
    });
    expect(new ParcelShape(value).isParent()).toBe(true);
    expect(new ParcelShape(value).isIndexed()).toBe(false);
    expect(new ParcelShape(value).isChild()).toBe(false);
    expect(new ParcelShape(value).isElement()).toBe(false);
    expect(new ParcelShape(value).isTopLevel()).toBe(true);
});


test('ParcelShapeTypes should correctly identify array values', () => {
    var value = [1,2,3];
    expect(new ParcelShape(value).isParent()).toBe(true);
    expect(new ParcelShape(value).isIndexed()).toBe(true);
    expect(new ParcelShape(value).isChild()).toBe(false);
    expect(new ParcelShape(value).isElement()).toBe(false);
    expect(new ParcelShape(value).isTopLevel()).toBe(true);
});

test('ParcelShapeTypes should correctly identify Immutable.js List values', () => {
    var value = List([1,2,3]);
    expect(new ParcelShape(value).isParent()).toBe(true);
    expect(new ParcelShape(value).isIndexed()).toBe(true);
    expect(new ParcelShape(value).isChild()).toBe(false);
    expect(new ParcelShape(value).isElement()).toBe(false);
    expect(new ParcelShape(value).isTopLevel()).toBe(true);
});

test('ParcelShapeTypes should correctly identify child values', () => {
    var value = {
        a: "A"
    };
    expect(new ParcelShape(value).get("a").isParent()).toBe(false);
    expect(new ParcelShape(value).get("a").isIndexed()).toBe(false);
    expect(new ParcelShape(value).get("a").isChild()).toBe(true);
    expect(new ParcelShape(value).get("a").isElement()).toBe(false);
    expect(new ParcelShape(value).get("a").isTopLevel()).toBe(false);
});

test('ParcelShapeTypes should correctly identify element values', () => {
    var value = [1,2,3];
    expect(new ParcelShape(value).get(0).isParent()).toBe(false);
    expect(new ParcelShape(value).get(0).isIndexed()).toBe(false);
    expect(new ParcelShape(value).get(0).isChild()).toBe(true);
    expect(new ParcelShape(value).get(0).isElement()).toBe(true);
    expect(new ParcelShape(value).get(0).isTopLevel()).toBe(false);
});

test('ParcelShapeTypes should correctly identify child values with getIn', () => {
    var value = {
        b: {
            a: "A"
        }
    };
    expect(new ParcelShape(value).getIn(["b","a"]).isParent()).toBe(false);
    expect(new ParcelShape(value).getIn(["b","a"]).isIndexed()).toBe(false);
    expect(new ParcelShape(value).getIn(["b","a"]).isChild()).toBe(true);
    expect(new ParcelShape(value).getIn(["b","a"]).isElement()).toBe(false);
    expect(new ParcelShape(value).getIn(["b","a"]).isTopLevel()).toBe(false);
});

test('ParcelShapeTypes should correctly identify element values with getIn', () => {
    var value = {
        b: [1,2,3]
    };

    expect(new ParcelShape(value).getIn(["b",0]).isParent()).toBe(false);
    expect(new ParcelShape(value).getIn(["b",0]).isIndexed()).toBe(false);
    expect(new ParcelShape(value).getIn(["b",0]).isChild()).toBe(true);
    expect(new ParcelShape(value).getIn(["b",0]).isElement()).toBe(true);
    expect(new ParcelShape(value).getIn(["b",0]).isTopLevel()).toBe(false);
});

// method creators

test('Correct methods are created for primitive values', () => {
    var value = 123;
    expect(() => new ParcelShape(value).set('A')).not.toThrow();
    expect(() => new ParcelShape(value).has('a')).toThrowError(`.has() is not a function`);
    expect(() => new ParcelShape(value).pop()).toThrowError(`.pop() is not a function`);
});

test('Correct methods are created for object values', () => {
    var value = {a: 123};
    expect(() => new ParcelShape(value).set('A')).not.toThrow();
    expect(() => new ParcelShape(value).has('a')).not.toThrow();
    expect(() => new ParcelShape(value).pop()).toThrowError(`.pop() is not a function`);
});

test('Correct methods are created for array values', () => {
    var value = [1,2,3];
    expect(() => new ParcelShape(value).set('A')).not.toThrow();
    expect(() => new ParcelShape(value).has('a')).not.toThrow();
    expect(() => new ParcelShape(value).pop()).not.toThrow();
});

test('Correct methods are created for object child values', () => {
    var value = {a: 123};
    expect(() => new ParcelShape(value).get("a").set('A')).not.toThrow();
    expect(() => new ParcelShape(value).get("a").has('a')).toThrowError(`.has() is not a function`);
    expect(() => new ParcelShape(value).get("a").pop()).toThrowError(`.pop() is not a function`);
});

test('Correct methods are created for array element values', () => {
    var value = [1,2,3];
    expect(() => new ParcelShape(value).get(0).set('A')).not.toThrow();
    expect(() => new ParcelShape(value).get(0).has('a')).toThrowError(`.has() is not a function`);
    expect(() => new ParcelShape(value).get(0).pop()).toThrowError(`.pop() is not a function`);
});

