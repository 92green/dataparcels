// @flow
import Parcel from '../../parcel/Parcel';

let MakeParcelNode = (data) => new Parcel(data).toParcelNode();

test('ParcelNode.data should return the ParcelNodes data', () => {
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

    expect(expectedData).toEqual(MakeParcelNode(data).data);
});

test('ParcelNode.value should return the ParcelNodes value', () => {
    var data = {
        value: 123
    };
    expect(MakeParcelNode(data).value).toBe(123);
});

test('ParcelNode.value should return the same instance of the ParcelNodes value', () => {
    var myObject = {a:1,b:2};
    var data = {
        value: myObject
    };
    expect(MakeParcelNode(data).value).toBe(myObject);
});

test('ParcelNode.key should return the ParcelNodes key', () => {
    var data = {
        value: {
            a: [1,2,3],
            ['something.:@']: 123
        }
    };
    expect("^").toBe(MakeParcelNode(data).key);
    expect("a").toBe(MakeParcelNode(data).get("a").key);
    expect("#a").toBe(MakeParcelNode(data).getIn(["a",0]).key);
    expect("something.:@").toBe(MakeParcelNode(data).get("something.:@").key);
    expect("b").toBe(MakeParcelNode(data).get("b").key);
    // t.is("#a", new Parcel(data).getIn(["a",?????]).key); TODO
});
