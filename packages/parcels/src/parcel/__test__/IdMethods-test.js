// @flow
import test from 'ava';
import Parcel from '../Parcel';

test('Parcel.key() should return the Parcels key', (tt: Object) => {
    var data = {
        value: {
            a: [1,2,3],
            ['something.:@']: 123
        }
    };
    tt.is("^", new Parcel(data).key());
    tt.is("a", new Parcel(data).get("a").key());
    tt.is("#a", new Parcel(data).getIn(["a",0]).key());
    tt.is("something.:@", new Parcel(data).get("something.:@").key());
    tt.is("b", new Parcel(data).get("b").key());
    // tt.is("#a", new Parcel(data).getIn(["a",?????]).key()); TODO
});

test('Parcel.id() should return the Parcels id', (tt: Object) => {
    var data = {
        value: {
            a: [1,2,3],
            ['something.:@']: 123
        }
    };
    tt.is("^", new Parcel(data).id());
    tt.is("^.a", new Parcel(data).get("a").id());
    tt.is("^.~mv.a", new Parcel(data).modifyValue(ii => ii).get("a").id());
    tt.is("^.a.#a", new Parcel(data).getIn(["a",0]).id());
    tt.is("^.something%.%:%@", new Parcel(data).get("something.:@").id());
    tt.is("^.b", new Parcel(data).get("b").id());
    // tt.is("#a", new Parcel(data).getIn(["a",?????]).id()); TODO
});

test('Parcel.path() should return the Parcels path', (tt: Object) => {
    var data = {
        value: {
            a: [1,2,3],
            ['something.:@']: 123
        }
    };
    tt.deepEqual([], new Parcel(data).path());
    tt.deepEqual(["a"], new Parcel(data).get("a").path());
    tt.deepEqual(["a"], new Parcel(data).modifyValue(ii => ii).get("a").path());
    tt.deepEqual(["a","#a"], new Parcel(data).getIn(["a",0]).path());
    tt.deepEqual(["something.:@"], new Parcel(data).get("something.:@").path());
    tt.deepEqual(["b"], new Parcel(data).get("b").path());
    // tt.is("#a", new Parcel(data).getIn(["a",?????]).path()); TODO
});

test('Parcel._typedPathString() should return the Parcels typed path', (tt: Object) => {
    var data = {
        value: {
            a: [1,2,3],
            ['something.:@']: 123
        }
    };
    tt.deepEqual("^:ceiPT", new Parcel(data)._typedPathString());
    tt.deepEqual("^:ceiPT", new Parcel(data).modifyValue(ii => ii)._typedPathString());
    tt.deepEqual("^:ceiPT.a:CeIPt", new Parcel(data).get("a")._typedPathString());
    tt.deepEqual("^:ceiPT.a:CeIPt", new Parcel(data).modifyValue(ii => ii).get("a")._typedPathString());
    tt.deepEqual("^:ceiPT.a:CeIPt.#a:CEipt", new Parcel(data).getIn(["a",0])._typedPathString());
    tt.deepEqual("^:ceiPT.something%.%:%@:Ceipt", new Parcel(data).get("something.:@")._typedPathString());
    tt.deepEqual("^:ceiPT.b:Ceipt", new Parcel(data).get("b")._typedPathString());
    // tt.is("#a", new Parcel(data).getIn(["a",?????])._typedPathString()); TODO
});
