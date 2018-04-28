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
    tt.is(new Parcel(data)._parcelTypes.toTypeCode(), "ceip");
});

test('ParcelTypes should correctly identify primitive date', tt => {
    var data = {
        handleChange,
        value: new Date()
    };
    tt.false(new Parcel(data).isParent());
    tt.false(new Parcel(data).isIndexed());
    tt.is(new Parcel(data)._parcelTypes.toTypeCode(), "ceip");
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
    tt.is(new Parcel(data)._parcelTypes.toTypeCode(), "ceiP");
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
    tt.is(new Parcel(data)._parcelTypes.toTypeCode(), "ceip");
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
    tt.is(new Parcel(data)._parcelTypes.toTypeCode(), "ceiP");
});


test('ParcelTypes should correctly identify array values', tt => {
    var data = {
        handleChange,
        value: [1,2,3]
    };
    tt.true(new Parcel(data).isParent());
    tt.true(new Parcel(data).isIndexed());
    tt.is(new Parcel(data)._parcelTypes.toTypeCode(), "ceIP");
});

test('ParcelTypes should correctly identify Immutable.js List values', tt => {
    var data = {
        handleChange,
        value: List([1,2,3])
    };
    tt.true(new Parcel(data).isParent());
    tt.true(new Parcel(data).isIndexed());
    tt.is(new Parcel(data)._parcelTypes.toTypeCode(), "ceIP");
});

test('Correct methods are created for primitive values', tt => {
    var data = {
        handleChange,
        value: 123
    };
    tt.notThrows(() => new Parcel(data).value());
    tt.true(tt.throws(() => new Parcel(data).has('a'), Error).message.indexOf(`Cannot call .has() on Parcel`) !== -1);
    tt.true(tt.throws(() => new Parcel(data).pop(), Error).message.indexOf(`Cannot call .pop() on Parcel`) !== -1);
});

test('Correct methods are created for object values', tt => {
    var data = {
        handleChange,
        value: {a: 123}
    };
    tt.notThrows(() => new Parcel(data).value());
    tt.notThrows(() => new Parcel(data).has('a'));
    tt.true(tt.throws(() => new Parcel(data).pop(), Error).message.indexOf(`Cannot call .pop() on Parcel`) !== -1);
});

test('Correct methods are created for array values', tt => {
    var data = {
        handleChange,
        value: [1,2,3]
    };
    tt.notThrows(() => new Parcel(data).value());
    tt.notThrows(() => new Parcel(data).has('a'));
    tt.notThrows(() => new Parcel(data).pop());
});

