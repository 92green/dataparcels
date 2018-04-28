// @flow
import test from 'ava';
import Parcel from '../Parcel';

const handleChange = ii => {};

test('Parcel.key() should return the Parcels key', (tt: Object) => {
    var data = {
        value: 123,
        handleChange
    };
    tt.is(new Parcel(data).key(), "^");
});

test('Parcel.id() should return the Parcels id', (tt: Object) => {
    var data = {
        value: {
            a: [1,2,3]
        },
        handleChange
    };
    tt.is(new Parcel(data).id(), "^");
    tt.is(new Parcel(data).get("a").id(), "a");
    tt.is(new Parcel(data).getIn(["a",0]).id(), "a/#a");
    // TODO - test url encoding
    //tt.is(new Parcel(data).get("a").modifyValue(ii => ii).get(1).id(), "^.a.&uv&.#b");
});

test('Parcel.path() should return the Parcels path', (tt: Object) => {
    var data = {
        value: {
            a: [1,2,3]
        },
        handleChange
    };
    tt.deepEqual(new Parcel(data).path(), []);
    tt.deepEqual(new Parcel(data).get("a").path(), ["a"]);
    tt.deepEqual(new Parcel(data).getIn(["a",0]).path(), ["a","#a"]);
    //tt.is(new Parcel(data).get("a").modifyValue(ii => ii).get(1).path(), "^.a.#b");
});