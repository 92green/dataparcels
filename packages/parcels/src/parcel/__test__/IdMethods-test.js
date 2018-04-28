// @flow
import test from 'ava';
import Parcel from '../Parcel';

const handleChange = ii => {};

test('Parcel.key() should return the Parcels key', (tt: Object) => {
    var data = {
        value: {
            a: [1,2,3],
            ['something@@@']: 123
        },
        handleChange
    };
    tt.is(new Parcel(data).key(), "^");
    tt.is(new Parcel(data).get("a").key(), "a");
    tt.is(new Parcel(data).getIn(["a",0]).key(), "#a");
    tt.is(new Parcel(data).get("something@@@").key(), "something@@@");
});

test('Parcel.id() should return the Parcels id', (tt: Object) => {
    var data = {
        value: {
            a: [1,2,3],
            ['something@@@']: 123
        },
        handleChange
    };
    tt.is(new Parcel(data).id(), "^");
    tt.is(new Parcel(data).get("a").id(), "a");
    tt.is(new Parcel(data).getIn(["a",0]).id(), "a/#a");
    tt.is(new Parcel(data).get("something@@@").id(), "something%40%40%40");
    //tt.is(new Parcel(data).get("a").modifyValue(ii => ii).get(1).id(), "^.a.&uv&.#b");
});

test('Parcel.path() should return the Parcels path', (tt: Object) => {
    var data = {
        value: {
            a: [1,2,3],
            ['something@@@']: 123
        },
        handleChange
    };
    tt.deepEqual(new Parcel(data).path(), []);
    tt.deepEqual(new Parcel(data).get("a").path(), ["a"]);
    tt.deepEqual(new Parcel(data).getIn(["a",0]).path(), ["a","#a"]);
    tt.deepEqual(new Parcel(data).get("something@@@").path(), ["something@@@"]);
    //tt.is(new Parcel(data).get("a").modifyValue(ii => ii).get(1).path(), "^.a.#b");
});

test('Parcel._typedPathString() should return the Parcels typed path', (tt: Object) => {
    var data = {
        value: {
            a: [1,2,3],
            ['something@@@']: 123
        },
        handleChange
    };
    tt.deepEqual(new Parcel(data)._typedPathString(), "^:ceiP");
    tt.deepEqual(new Parcel(data).get("a")._typedPathString(), "a:ceIP");
    tt.deepEqual(new Parcel(data).getIn(["a",0])._typedPathString(), "a:ceIP/#a:ceip");
    tt.deepEqual(new Parcel(data).get("something@@@")._typedPathString(), "something%40%40%40:ceip");
    //tt.is(new Parcel(data).get("a").modifyValue(ii => ii).get(1).path(), "^.a.#b");
});