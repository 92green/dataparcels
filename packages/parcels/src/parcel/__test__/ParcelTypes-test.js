// @flow
import {Map, List} from 'immutable';
import test from 'ava';
import Parcel from '../Parcel';

const handleChange = ii => {};

test('Parcel should return a ValueParcel given a parcelData shaped object', tt => {
    var data = {
        handleChange,
        value: 123
    };
    tt.false(new Parcel(data).isParent());
    tt.false(new Parcel(data).isIndexed());
});

test('Parcel should return a ValueParcel given a parcelData shaped object with Date value', tt => {
    var data = {
        handleChange,
        value: new Date()
    };
    tt.false(new Parcel(data).isParent());
    tt.false(new Parcel(data).isIndexed());
});

test('Parcel should return a ParentParcel given a parcelData shaped object with an object value', tt => {
    var data = {
        handleChange,
        value: {
            a: "A"
        }
    };
    tt.true(new Parcel(data).isParent());
    tt.false(new Parcel(data).isIndexed());
});

test('Parcel should return a ValueParcel given a parcelData shaped object with class instance value', tt => {
    class Thing {
        foo = "123"
    }
    var data = {
        handleChange,
        value: new Thing()
    };
    tt.false(new Parcel(data).isParent());
    tt.false(new Parcel(data).isIndexed());
});

test('Parcel should return a ParentParcel given a parcelData shaped object with a Map value', tt => {
    var data = {
        handleChange,
        value: Map({
            a: "A"
        })
    };
    tt.true(new Parcel(data).isParent());
    tt.false(new Parcel(data).isIndexed());
});


test('Parcel should return an IndexedParcel given a parcelData shaped object with an Array value', tt => {
    var data = {
        handleChange,
        value: [1,2,3]
    };
    tt.true(new Parcel(data).isParent());
    tt.true(new Parcel(data).isIndexed());
});

test('Parcel should return an IndexedParcel given a parcelData shaped object with a List value', tt => {
    var data = {
        handleChange,
        value: List([1,2,3])
    };
    tt.true(new Parcel(data).isParent());
    tt.true(new Parcel(data).isIndexed());
});