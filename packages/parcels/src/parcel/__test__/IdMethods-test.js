// @flow
import Parcel from '../Parcel';

test('Parcel.key() should return the Parcels key', () => {
    var data = {
        value: {
            a: [1,2,3],
            ['something.:@']: 123
        }
    };
    expect("^").toBe(new Parcel(data).key());
    expect("a").toBe(new Parcel(data).get("a").key());
    expect("#a").toBe(new Parcel(data).getIn(["a",0]).key());
    expect("something.:@").toBe(new Parcel(data).get("something.:@").key());
    expect("b").toBe(new Parcel(data).get("b").key());
    // t.is("#a", new Parcel(data).getIn(["a",?????]).key()); TODO
});

test('Parcel.id() should return the Parcels id', () => {
    var data = {
        value: {
            a: [1,2,3],
            ['something.:@']: 123
        }
    };
    expect("^").toBe(new Parcel(data).id());
    expect("^.a").toBe(new Parcel(data).get("a").id());
    expect("^.~mv.a").toBe(new Parcel(data).modifyValue(ii => ii).get("a").id());
    expect("^.a.#a").toBe(new Parcel(data).getIn(["a",0]).id());
    expect("^.something%.%:%@").toBe(new Parcel(data).get("something.:@").id());
    expect("^.b").toBe(new Parcel(data).get("b").id());
    // t.is("#a", new Parcel(data).getIn(["a",?????]).id()); TODO
});

test('Parcel.path() should return the Parcels path', () => {
    var data = {
        value: {
            a: [1,2,3],
            ['something.:@']: 123
        }
    };
    expect([]).toEqual(new Parcel(data).path());
    expect(["a"]).toEqual(new Parcel(data).get("a").path());
    expect(["a"]).toEqual(new Parcel(data).modifyValue(ii => ii).get("a").path());
    expect(["a","#a"]).toEqual(new Parcel(data).getIn(["a",0]).path());
    expect(["something.:@"]).toEqual(new Parcel(data).get("something.:@").path());
    expect(["b"]).toEqual(new Parcel(data).get("b").path());
    // t.is("#a", new Parcel(data).getIn(["a",?????]).path()); TODO
});

test('Parcel._typedPathString() should return the Parcels typed path', () => {
    var data = {
        value: {
            a: [1,2,3],
            ['something.:@']: 123
        }
    };
    expect("^:ceiPT").toEqual(new Parcel(data)._typedPathString());
    expect("^:ceiPT").toEqual(new Parcel(data).modifyValue(ii => ii)._typedPathString());
    expect("^:ceiPT.a:CeIPt").toEqual(new Parcel(data).get("a")._typedPathString());
    expect("^:ceiPT.a:CeIPt").toEqual(new Parcel(data).modifyValue(ii => ii).get("a")._typedPathString());
    expect("^:ceiPT.a:CeIPt.#a:CEipt").toEqual(new Parcel(data).getIn(["a",0])._typedPathString());
    expect("^:ceiPT.something%.%:%@:Ceipt").toEqual(new Parcel(data).get("something.:@")._typedPathString());
    expect("^:ceiPT.b:Ceipt").toEqual(new Parcel(data).get("b")._typedPathString());
    // t.is("#a", new Parcel(data).getIn(["a",?????])._typedPathString()); TODO
});
