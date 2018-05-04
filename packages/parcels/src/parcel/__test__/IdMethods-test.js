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
    tt.is("^", new Parcel(data).key());
    tt.is("a", new Parcel(data).get("a").key());
    tt.is("#a", new Parcel(data).getIn(["a",0]).key());
    tt.is("something@@@", new Parcel(data).get("something@@@").key());
    // tt.is("b", new Parcel(data).get("b").key()); TODO
    // tt.is("#a", new Parcel(data).getIn(["a",?????]).key()); TODO
});

test('Parcel.id() should return the Parcels id', (tt: Object) => {
    var data = {
        value: {
            a: [1,2,3],
            ['something@@@']: 123
        },
        handleChange
    };
    tt.is("^", new Parcel(data).id());
    tt.is("a", new Parcel(data).get("a").id());
    tt.is("a/#a", new Parcel(data).getIn(["a",0]).id());
    tt.is("something%40%40%40", new Parcel(data).get("something@@@").id());
    // tt.is("b", new Parcel(data).get("b").id()); TODO
    // tt.is("#a", new Parcel(data).getIn(["a",?????]).id()); TODO
    //tt.is(new Parcel(data).get("a").modifyValue(ii => ii).get(1).id(), "^.a.&uv&.#b"); TODO
});

test('Parcel.path() should return the Parcels path', (tt: Object) => {
    var data = {
        value: {
            a: [1,2,3],
            ['something@@@']: 123
        },
        handleChange
    };
    tt.deepEqual([], new Parcel(data).path());
    tt.deepEqual(["a"], new Parcel(data).get("a").path());
    tt.deepEqual(["a","#a"], new Parcel(data).getIn(["a",0]).path());
    tt.deepEqual(["something@@@"], new Parcel(data).get("something@@@").path());
    // tt.is("b", new Parcel(data).get("b").path()); TODO
    // tt.is("#a", new Parcel(data).getIn(["a",?????]).path()); TODO
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
    tt.deepEqual("^:ceiP", new Parcel(data)._typedPathString());
    tt.deepEqual("a:CeIP", new Parcel(data).get("a")._typedPathString());
    tt.deepEqual("a:CeIP/#a:CEip", new Parcel(data).getIn(["a",0])._typedPathString());
    tt.deepEqual("something%40%40%40:Ceip", new Parcel(data).get("something@@@")._typedPathString());
    // tt.is("b", new Parcel(data).get("b")._typedPathString()); TODO
    // tt.is("#a", new Parcel(data).getIn(["a",?????])._typedPathString()); TODO
    //tt.is(new Parcel(data).get("a").modifyValue(ii => ii).get(1).path(), "^.a.#b");
});
