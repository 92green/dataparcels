// @flow
import {Map, List} from 'immutable';
import test from 'ava';
import Parcel from '../Parcel';

const handleChange = ii => {};

test('ParcelTypes should correctly identify primitive values', tt => {
    var data = {
        handleChange,
        value: 123
    };
    tt.false(new Parcel(data).isParent());
    tt.false(new Parcel(data).isIndexed());
    tt.false(new Parcel(data).isChild());
    tt.false(new Parcel(data).isElement());
    tt.true(new Parcel(data).isTopLevel());
    tt.is(new Parcel(data)._parcelTypes.toTypeCode(), "ceipT");
});

test('ParcelTypes should correctly identify primitive date', tt => {
    var data = {
        handleChange,
        value: new Date()
    };
    tt.false(new Parcel(data).isParent());
    tt.false(new Parcel(data).isIndexed());
    tt.false(new Parcel(data).isChild());
    tt.false(new Parcel(data).isElement());
    tt.true(new Parcel(data).isTopLevel());
    tt.is(new Parcel(data)._parcelTypes.toTypeCode(), "ceipT");
});

test('ParcelTypes should correctly identify object values', tt => {
    var data = {
        handleChange,
        value: {
            a: "A"
        }
    };
    tt.true(new Parcel(data).isParent());
    tt.false(new Parcel(data).isIndexed());
    tt.false(new Parcel(data).isChild());
    tt.false(new Parcel(data).isElement());
    tt.true(new Parcel(data).isTopLevel());
    tt.is(new Parcel(data)._parcelTypes.toTypeCode(), "ceiPT");
});

test('ParcelTypes should correctly identify class instance values', tt => {
    class Thing {
        foo = "123"
    }
    var data = {
        handleChange,
        value: new Thing()
    };
    tt.false(new Parcel(data).isParent());
    tt.false(new Parcel(data).isIndexed());
    tt.false(new Parcel(data).isChild());
    tt.false(new Parcel(data).isElement());
    tt.true(new Parcel(data).isTopLevel());
    tt.is(new Parcel(data)._parcelTypes.toTypeCode(), "ceipT");
    // TODO - may have to allow unmutable to recognise class instances as ValueObjects for this to change
});

test('ParcelTypes should correctly identify Immutable.js Map values', tt => {
    var data = {
        handleChange,
        value: Map({
            a: "A"
        })
    };
    tt.true(new Parcel(data).isParent());
    tt.false(new Parcel(data).isIndexed());
    tt.false(new Parcel(data).isChild());
    tt.false(new Parcel(data).isElement());
    tt.true(new Parcel(data).isTopLevel());
    tt.is(new Parcel(data)._parcelTypes.toTypeCode(), "ceiPT");
});


test('ParcelTypes should correctly identify array values', tt => {
    var data = {
        handleChange,
        value: [1,2,3]
    };
    tt.true(new Parcel(data).isParent());
    tt.true(new Parcel(data).isIndexed());
    tt.false(new Parcel(data).isChild());
    tt.false(new Parcel(data).isElement());
    tt.true(new Parcel(data).isTopLevel());
    tt.is(new Parcel(data)._parcelTypes.toTypeCode(), "ceIPT");
});

test('ParcelTypes should correctly identify Immutable.js List values', tt => {
    var data = {
        handleChange,
        value: List([1,2,3])
    };
    tt.true(new Parcel(data).isParent());
    tt.true(new Parcel(data).isIndexed());
    tt.false(new Parcel(data).isChild());
    tt.false(new Parcel(data).isElement());
    tt.true(new Parcel(data).isTopLevel());
    tt.is(new Parcel(data)._parcelTypes.toTypeCode(), "ceIPT");
});

test('ParcelTypes should correctly identify child values', tt => {
    var data = {
        handleChange,
        value: {
            a: "A"
        }
    };
    tt.false(new Parcel(data).get("a").isParent());
    tt.false(new Parcel(data).get("a").isIndexed());
    tt.true(new Parcel(data).get("a").isChild());
    tt.false(new Parcel(data).get("a").isElement());
    tt.false(new Parcel(data).get("a").isTopLevel());
    tt.is(new Parcel(data).get("a")._parcelTypes.toTypeCode(), "Ceipt");
});

test('ParcelTypes should correctly identify element values', tt => {
    var data = {
        handleChange,
        value: [1,2,3]
    };
    tt.false(new Parcel(data).get(0).isParent());
    tt.false(new Parcel(data).get(0).isIndexed());
    tt.true(new Parcel(data).get(0).isChild());
    tt.true(new Parcel(data).get(0).isElement());
    tt.false(new Parcel(data).get(0).isTopLevel());
    tt.is(new Parcel(data).get(0)._parcelTypes.toTypeCode(), "CEipt");
});

test('ParcelTypes should correctly identify top level values after modifiers', tt => {
    var data = {
        handleChange,
        value: [1,2,3]
    };
    tt.true(new Parcel(data).modifyValue(ii => ii).isTopLevel());
});

// method creators

test('Correct methods are created for primitive values', tt => {
    var data = {
        handleChange,
        value: 123
    };
    tt.notThrows(() => new Parcel(data).value());
    tt.true(tt.throws(() => new Parcel(data).has('a'), Error).message.indexOf(`Cannot call .has() on Parcel`) !== -1);
    tt.true(tt.throws(() => new Parcel(data).pop(), Error).message.indexOf(`Cannot call .pop() on Parcel`) !== -1);
    tt.true(tt.throws(() => new Parcel(data).deleteSelf(), Error).message.indexOf(`Cannot call .deleteSelf() on Parcel`) !== -1);
    tt.true(tt.throws(() => new Parcel(data).swapNextWithSelf(), Error).message.indexOf(`Cannot call .swapNextWithSelf() on Parcel`) !== -1);
});

test('Correct methods are created for object values', tt => {
    var data = {
        handleChange,
        value: {a: 123}
    };
    tt.notThrows(() => new Parcel(data).value());
    tt.notThrows(() => new Parcel(data).has('a'));
    tt.true(tt.throws(() => new Parcel(data).pop(), Error).message.indexOf(`Cannot call .pop() on Parcel`) !== -1);
    tt.true(tt.throws(() => new Parcel(data).deleteSelf(), Error).message.indexOf(`Cannot call .deleteSelf() on Parcel`) !== -1);
    tt.true(tt.throws(() => new Parcel(data).swapNextWithSelf(), Error).message.indexOf(`Cannot call .swapNextWithSelf() on Parcel`) !== -1);
});

test('Correct methods are created for array values', tt => {
    var data = {
        handleChange,
        value: [1,2,3]
    };
    tt.notThrows(() => new Parcel(data).value());
    tt.notThrows(() => new Parcel(data).has('a'));
    tt.notThrows(() => new Parcel(data).pop());
    tt.true(tt.throws(() => new Parcel(data).deleteSelf(), Error).message.indexOf(`Cannot call .deleteSelf() on Parcel`) !== -1);
    tt.true(tt.throws(() => new Parcel(data).swapNextWithSelf(), Error).message.indexOf(`Cannot call .swapNextWithSelf() on Parcel`) !== -1);
});

test('Correct methods are created for object child values', tt => {
    var data = {
        handleChange,
        value: {a: 123}
    };
    tt.notThrows(() => new Parcel(data).get("a").value());
    tt.true(tt.throws(() => new Parcel(data).get("a").has('a'), Error).message.indexOf(`Cannot call .has() on Parcel`) !== -1);
    tt.true(tt.throws(() => new Parcel(data).get("a").pop(), Error).message.indexOf(`Cannot call .pop() on Parcel`) !== -1);
    tt.notThrows(() => new Parcel(data).get("a").deleteSelf());
    tt.true(tt.throws(() => new Parcel(data).get("a").swapNextWithSelf(), Error).message.indexOf(`Cannot call .swapNextWithSelf() on Parcel`) !== -1);
});

test('Correct methods are created for array element values', tt => {
    var data = {
        handleChange,
        value: [1,2,3]
    };
    tt.notThrows(() => new Parcel(data).get(0).value());
    tt.true(tt.throws(() => new Parcel(data).get(0).has('a'), Error).message.indexOf(`Cannot call .has() on Parcel`) !== -1);
    tt.true(tt.throws(() => new Parcel(data).get(0).pop(), Error).message.indexOf(`Cannot call .pop() on Parcel`) !== -1);
    tt.notThrows(() => new Parcel(data).get(0).deleteSelf());
    tt.notThrows(() => new Parcel(data).get(0).swapNextWithSelf());
});

