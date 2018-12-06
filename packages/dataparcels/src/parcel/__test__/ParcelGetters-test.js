// @flow
import Parcel from '../Parcel';

test('Parcel.data should return the Parcels data', () => {
    var data = {
        value: 123,
        child: undefined
    };

    var expectedData = {
        value: 123,
        child: undefined,
        key: '^',
        meta: {}
    };

    expect(expectedData).toEqual(new Parcel(data).data);
});

test('Parcel.value should return the Parcels value', () => {
    var data = {
        value: 123
    };
    expect(new Parcel(data).value).toBe(123);
});

test('Parcel.value should return the same instance of the Parcels value', () => {
    var myObject = {a:1,b:2};
    var data = {
        value: myObject
    };
    expect(new Parcel(data).value).toBe(myObject);
});

test('Parcel.meta should return meta', () => {
    var meta = {
        abc: 123,
        def: 456
    };

    var data = {
        value: 123,
        handleChange: (parcel) => {
            // the see if it is returned correctly
            expect(meta).toEqual(parcel.meta);
            expect(meta !== parcel.meta).toBe(true);
        }
    };

    // first set the meta
    var parcel = new Parcel(data).setMeta(meta);
});

test('Parcel.key should return the Parcels key', () => {
    var data = {
        value: {
            a: [1,2,3],
            ['something.:@']: 123
        }
    };
    expect(new Parcel(data).key).toBe("^");
    expect(new Parcel(data).get("a").key).toBe("a");
    expect(new Parcel(data).getIn(["a",0]).key).toBe("#a");
    expect(new Parcel(data).get("something.:@").key).toBe("something.:@");
    expect(new Parcel(data).get("b").key).toBe("b");
    // t.is("#a", new Parcel(data).getIn(["a",?????]).key); TODO
});

test('Parcel.id should return the Parcels id', () => {
    var data = {
        value: {
            a: [1,2,3],
            ['something.:@']: 123
        }
    };
    expect("^").toBe(new Parcel(data).id);
    expect("^.a").toBe(new Parcel(data).get("a").id);
    expect("^.~mv-364997092.a").toBe(new Parcel(data).modifyValueDown(ii => ii).get("a").id);
    expect("^.a.#a").toBe(new Parcel(data).getIn(["a",0]).id);
    expect("^.something%.%:%@").toBe(new Parcel(data).get("something.:@").id);
    expect("^.b").toBe(new Parcel(data).get("b").id);
    // t.is("#a", new Parcel(data).getIn(["a",?????]).id); TODO
});

test('Parcel.path should return the Parcels path', () => {
    var data = {
        value: {
            a: [1,2,3],
            ['something.:@']: 123
        }
    };
    expect([]).toEqual(new Parcel(data).path);
    expect(["a"]).toEqual(new Parcel(data).get("a").path);
    expect(["a"]).toEqual(new Parcel(data).modifyValueDown(ii => ii).get("a").path);
    expect(["a","#a"]).toEqual(new Parcel(data).getIn(["a",0]).path);
    expect(["something.:@"]).toEqual(new Parcel(data).get("something.:@").path);
    expect(["b"]).toEqual(new Parcel(data).get("b").path);
    // t.is("#a", new Parcel(data).getIn(["a",?????]).path); TODO
});
