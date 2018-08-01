// @flow
import {Map, List} from 'immutable';
import test from 'ava';
import Parcel from '../Parcel';

test('ParcelTypes should correctly identify primitive values', t => {
    var data = {
        value: 123
    };
    t.false(new Parcel(data).isParent());
    t.false(new Parcel(data).isIndexed());
    t.false(new Parcel(data).isChild());
    t.false(new Parcel(data).isElement());
    t.true(new Parcel(data).isTopLevel());
    t.is(new Parcel(data)._parcelTypes.toTypeCode(), "ceipT");
});

test('ParcelTypes should correctly identify primitive date', t => {
    var data = {
        value: new Date()
    };
    t.false(new Parcel(data).isParent());
    t.false(new Parcel(data).isIndexed());
    t.false(new Parcel(data).isChild());
    t.false(new Parcel(data).isElement());
    t.true(new Parcel(data).isTopLevel());
    t.is(new Parcel(data)._parcelTypes.toTypeCode(), "ceipT");
});

test('ParcelTypes should correctly identify object values', t => {
    var data = {
        value: {
            a: "A"
        }
    };
    t.true(new Parcel(data).isParent());
    t.false(new Parcel(data).isIndexed());
    t.false(new Parcel(data).isChild());
    t.false(new Parcel(data).isElement());
    t.true(new Parcel(data).isTopLevel());
    t.is(new Parcel(data)._parcelTypes.toTypeCode(), "ceiPT");
});

test('ParcelTypes should correctly identify class instance values', t => {
    class Thing {
        foo = "123"
    }
    var data = {
        value: new Thing()
    };
    t.false(new Parcel(data).isParent());
    t.false(new Parcel(data).isIndexed());
    t.false(new Parcel(data).isChild());
    t.false(new Parcel(data).isElement());
    t.true(new Parcel(data).isTopLevel());
    t.is(new Parcel(data)._parcelTypes.toTypeCode(), "ceipT");
    // TODO - may have to allow unmutable to recognise class instances as ValueObjects for this to change
});

test('ParcelTypes should correctly identify Immutable.js Map values', t => {
    var data = {
        value: Map({
            a: "A"
        })
    };
    t.true(new Parcel(data).isParent());
    t.false(new Parcel(data).isIndexed());
    t.false(new Parcel(data).isChild());
    t.false(new Parcel(data).isElement());
    t.true(new Parcel(data).isTopLevel());
    t.is(new Parcel(data)._parcelTypes.toTypeCode(), "ceiPT");
});


test('ParcelTypes should correctly identify array values', t => {
    var data = {
        value: [1,2,3]
    };
    t.true(new Parcel(data).isParent());
    t.true(new Parcel(data).isIndexed());
    t.false(new Parcel(data).isChild());
    t.false(new Parcel(data).isElement());
    t.true(new Parcel(data).isTopLevel());
    t.is(new Parcel(data)._parcelTypes.toTypeCode(), "ceIPT");
});

test('ParcelTypes should correctly identify Immutable.js List values', t => {
    var data = {
        value: List([1,2,3])
    };
    t.true(new Parcel(data).isParent());
    t.true(new Parcel(data).isIndexed());
    t.false(new Parcel(data).isChild());
    t.false(new Parcel(data).isElement());
    t.true(new Parcel(data).isTopLevel());
    t.is(new Parcel(data)._parcelTypes.toTypeCode(), "ceIPT");
});

test('ParcelTypes should correctly identify child values', t => {
    var data = {
        value: {
            a: "A"
        }
    };
    t.false(new Parcel(data).get("a").isParent());
    t.false(new Parcel(data).get("a").isIndexed());
    t.true(new Parcel(data).get("a").isChild());
    t.false(new Parcel(data).get("a").isElement());
    t.false(new Parcel(data).get("a").isTopLevel());
    t.is(new Parcel(data).get("a")._parcelTypes.toTypeCode(), "Ceipt");
});

test('ParcelTypes should correctly identify element values', t => {
    var data = {
        value: [1,2,3]
    };
    t.false(new Parcel(data).get(0).isParent());
    t.false(new Parcel(data).get(0).isIndexed());
    t.true(new Parcel(data).get(0).isChild());
    t.true(new Parcel(data).get(0).isElement());
    t.false(new Parcel(data).get(0).isTopLevel());
    t.is(new Parcel(data).get(0)._parcelTypes.toTypeCode(), "CEipt");
});

test('ParcelTypes should correctly identify top level values after modifiers', t => {
    var data = {
        value: [1,2,3]
    };
    t.true(new Parcel(data).modifyValue(ii => ii).isTopLevel());
});

// method creators

test('Correct methods are created for primitive values', t => {
    var data = {
        value: 123
    };
    t.notThrows(() => new Parcel(data).value());
    t.true(t.throws(() => new Parcel(data).has('a'), Error).message.indexOf(`Cannot call .has() on Parcel`) !== -1);
    t.true(t.throws(() => new Parcel(data).pop(), Error).message.indexOf(`Cannot call .pop() on Parcel`) !== -1);
    t.true(t.throws(() => new Parcel(data).deleteSelf(), Error).message.indexOf(`Cannot call .deleteSelf() on Parcel`) !== -1);
    t.true(t.throws(() => new Parcel(data).swapNextWithSelf(), Error).message.indexOf(`Cannot call .swapNextWithSelf() on Parcel`) !== -1);
});

test('Correct methods are created for object values', t => {
    var data = {
        value: {a: 123}
    };
    t.notThrows(() => new Parcel(data).value());
    t.notThrows(() => new Parcel(data).has('a'));
    t.true(t.throws(() => new Parcel(data).pop(), Error).message.indexOf(`Cannot call .pop() on Parcel`) !== -1);
    t.true(t.throws(() => new Parcel(data).deleteSelf(), Error).message.indexOf(`Cannot call .deleteSelf() on Parcel`) !== -1);
    t.true(t.throws(() => new Parcel(data).swapNextWithSelf(), Error).message.indexOf(`Cannot call .swapNextWithSelf() on Parcel`) !== -1);
});

test('Correct methods are created for array values', t => {
    var data = {
        value: [1,2,3]
    };
    t.notThrows(() => new Parcel(data).value());
    t.notThrows(() => new Parcel(data).has('a'));
    t.notThrows(() => new Parcel(data).pop());
    t.true(t.throws(() => new Parcel(data).deleteSelf(), Error).message.indexOf(`Cannot call .deleteSelf() on Parcel`) !== -1);
    t.true(t.throws(() => new Parcel(data).swapNextWithSelf(), Error).message.indexOf(`Cannot call .swapNextWithSelf() on Parcel`) !== -1);
});

test('Correct methods are created for object child values', t => {
    var data = {
        value: {a: 123}
    };
    t.notThrows(() => new Parcel(data).get("a").value());
    t.true(t.throws(() => new Parcel(data).get("a").has('a'), Error).message.indexOf(`Cannot call .has() on Parcel`) !== -1);
    t.true(t.throws(() => new Parcel(data).get("a").pop(), Error).message.indexOf(`Cannot call .pop() on Parcel`) !== -1);
    t.notThrows(() => new Parcel(data).get("a").deleteSelf());
    t.true(t.throws(() => new Parcel(data).get("a").swapNextWithSelf(), Error).message.indexOf(`Cannot call .swapNextWithSelf() on Parcel`) !== -1);
});

test('Correct methods are created for array element values', t => {
    var data = {
        value: [1,2,3]
    };
    t.notThrows(() => new Parcel(data).get(0).value());
    t.true(t.throws(() => new Parcel(data).get(0).has('a'), Error).message.indexOf(`Cannot call .has() on Parcel`) !== -1);
    t.true(t.throws(() => new Parcel(data).get(0).pop(), Error).message.indexOf(`Cannot call .pop() on Parcel`) !== -1);
    t.notThrows(() => new Parcel(data).get(0).deleteSelf());
    t.notThrows(() => new Parcel(data).get(0).swapNextWithSelf());
});

