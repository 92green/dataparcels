// @flow
import test from 'ava';
import Parcel from '../Parcel';

test('Parcel.key() should return the Parcels key', (t: Object) => {
    var data = {
        value: {
            a: [1,2,3],
            ['something.:@']: 123
        }
    };
    t.is("^", new Parcel(data).key());
    t.is("a", new Parcel(data).get("a").key());
    t.is("#a", new Parcel(data).getIn(["a",0]).key());
    t.is("something.:@", new Parcel(data).get("something.:@").key());
    t.is("b", new Parcel(data).get("b").key());
    // t.is("#a", new Parcel(data).getIn(["a",?????]).key()); TODO
});

test('Parcel.id() should return the Parcels id', (t: Object) => {
    var data = {
        value: {
            a: [1,2,3],
            ['something.:@']: 123
        }
    };
    t.is("^", new Parcel(data).id());
    t.is("^.a", new Parcel(data).get("a").id());
    t.is("^.~mv.a", new Parcel(data).modifyValue(ii => ii).get("a").id());
    t.is("^.a.#a", new Parcel(data).getIn(["a",0]).id());
    t.is("^.something%.%:%@", new Parcel(data).get("something.:@").id());
    t.is("^.b", new Parcel(data).get("b").id());
    // t.is("#a", new Parcel(data).getIn(["a",?????]).id()); TODO
});

test('Parcel.path() should return the Parcels path', (t: Object) => {
    var data = {
        value: {
            a: [1,2,3],
            ['something.:@']: 123
        }
    };
    t.deepEqual([], new Parcel(data).path());
    t.deepEqual(["a"], new Parcel(data).get("a").path());
    t.deepEqual(["a"], new Parcel(data).modifyValue(ii => ii).get("a").path());
    t.deepEqual(["a","#a"], new Parcel(data).getIn(["a",0]).path());
    t.deepEqual(["something.:@"], new Parcel(data).get("something.:@").path());
    t.deepEqual(["b"], new Parcel(data).get("b").path());
    // t.is("#a", new Parcel(data).getIn(["a",?????]).path()); TODO
});

test('Parcel._typedPathString() should return the Parcels typed path', (t: Object) => {
    var data = {
        value: {
            a: [1,2,3],
            ['something.:@']: 123
        }
    };
    t.deepEqual("^:ceiPT", new Parcel(data)._typedPathString());
    t.deepEqual("^:ceiPT", new Parcel(data).modifyValue(ii => ii)._typedPathString());
    t.deepEqual("^:ceiPT.a:CeIPt", new Parcel(data).get("a")._typedPathString());
    t.deepEqual("^:ceiPT.a:CeIPt", new Parcel(data).modifyValue(ii => ii).get("a")._typedPathString());
    t.deepEqual("^:ceiPT.a:CeIPt.#a:CEipt", new Parcel(data).getIn(["a",0])._typedPathString());
    t.deepEqual("^:ceiPT.something%.%:%@:Ceipt", new Parcel(data).get("something.:@")._typedPathString());
    t.deepEqual("^:ceiPT.b:Ceipt", new Parcel(data).get("b")._typedPathString());
    // t.is("#a", new Parcel(data).getIn(["a",?????])._typedPathString()); TODO
});
