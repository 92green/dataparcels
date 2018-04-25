// @flow
import test from 'ava';
import React from 'react';
import {List, Map} from 'immutable';
import ParcelFactory from '../ParcelFactory';
import ValueParcel from '../parcel/ValueParcel';
import CollectionParcel from '../parcel/CollectionParcel';
import IndexedParcel from '../parcel/IndexedParcel';

test('ParcelFactory should return a ValueParcel given a parcelData shaped object', tt => {
    var data = {
        value: 123
    };
    tt.true(ParcelFactory(data) instanceof ValueParcel);
    tt.false(ParcelFactory(data) instanceof CollectionParcel);
    tt.false(ParcelFactory(data) instanceof IndexedParcel);
});

test('ParcelFactory should return a ValueParcel given a parcelData shaped object with Date value', tt => {
    var data = {
        value: new Date()
    };
    tt.true(ParcelFactory(data) instanceof ValueParcel);
    tt.false(ParcelFactory(data) instanceof CollectionParcel);
    tt.false(ParcelFactory(data) instanceof IndexedParcel);
});

test('ParcelFactory should return a CollectionParcel given a parcelData shaped object with an object value', tt => {
    var data = {
        value: {
            a: "A"
        }
    };
    tt.true(ParcelFactory(data) instanceof ValueParcel);
    tt.true(ParcelFactory(data) instanceof CollectionParcel);
    tt.false(ParcelFactory(data) instanceof IndexedParcel);
});

test('ParcelFactory should return a ValueParcel given a parcelData shaped object with class instance value', tt => {
    class Thing {
        foo = "123"
    }
    var data = {
        value: new Thing()
    };
    tt.true(ParcelFactory(data) instanceof ValueParcel);
    tt.false(ParcelFactory(data) instanceof CollectionParcel);
    tt.false(ParcelFactory(data) instanceof IndexedParcel);
});

test('ParcelFactory should return a CollectionParcel given a parcelData shaped object with a Map value', tt => {
    var data = {
        value: Map({
            a: "A"
        })
    };
    tt.true(ParcelFactory(data) instanceof ValueParcel);
    tt.true(ParcelFactory(data) instanceof CollectionParcel);
    tt.false(ParcelFactory(data) instanceof IndexedParcel);
});


test('ParcelFactory should return an IndexedParcel given a parcelData shaped object with an Array value', tt => {
    var data = {
        value: [1,2,3]
    };
    tt.true(ParcelFactory(data) instanceof ValueParcel);
    tt.true(ParcelFactory(data) instanceof CollectionParcel);
    tt.true(ParcelFactory(data) instanceof IndexedParcel);
});

test('ParcelFactory should return an IndexedParcel given a parcelData shaped object with a List value', tt => {
    var data = {
        value: List([1,2,3])
    };
    tt.true(ParcelFactory(data) instanceof ValueParcel);
    tt.true(ParcelFactory(data) instanceof CollectionParcel);
    tt.true(ParcelFactory(data) instanceof IndexedParcel);
});
