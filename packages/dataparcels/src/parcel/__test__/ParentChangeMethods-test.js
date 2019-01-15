// @flow
import Parcel from '../Parcel';
import map from 'unmutable/lib/map';
import ParcelShape from '../../parcelShape/ParcelShape';

test('ParentParcel.set(key) should call the Parcels handleChange function with the new parcelData', () => {
    expect.assertions(1);

    var data = {
        value: {
            a: "!!!"
        },
        handleChange: (parcel) => {
            let {value} = parcel.data;
            expect({a: "???"}).toEqual(value);
        }
    };

    new Parcel(data).set("a", "???");
});

test('ParentParcel.update(key) should call the Parcels handleChange function with the new parcelData', () => {
    let updater = jest.fn(ii => ii + 1);
    let handleChange = jest.fn();

    new Parcel({
        value: {
            abc: 123
        },
        handleChange
    }).update("abc", updater);

    expect(updater.mock.calls[0][0]).toBe(123);
    expect(handleChange.mock.calls[0][0].data.value).toEqual({
        abc: 124
    });
});

test('ParentParcel.updateShape(key) should call the Parcels handleChange function with the new parcelData', () => {
    let updater = jest.fn(parcelShape => parcelShape.push(4));
    let handleChange = jest.fn();

    new Parcel({
        value: {
            abc: [1,2,3]
        },
        handleChange
    }).updateShape("abc", updater);

    expect(updater.mock.calls[0][0] instanceof ParcelShape).toBe(true);
    expect(handleChange.mock.calls[0][0].data.value).toEqual({
        abc: [1,2,3,4]
    });
});

test('ParentParcel.delete(key) should delete', () => {
    var handleChange = jest.fn();

    new Parcel({
        value: {
            abc: 123,
            def: 456
        },
        handleChange
    }).delete("abc");

    var expectedValue = {
        def: 456
    };

    expect(handleChange.mock.calls[0][0].value).toEqual(expectedValue);
});

test('ParentParcel.setIn(keyPath) should call the Parcels handleChange function with the new parcelData', () => {
    expect.assertions(1);

    var data = {
        value: {
            a: {
                b: "!!!"
            }
        },
        handleChange: (parcel) => {
            let {value} = parcel.data;
            expect({a: {b: "???"}}).toEqual(value);
        }
    };

    new Parcel(data).setIn(["a", "b"], "???");
});

test('ParentParcel.updateIn(keyPath) should call the Parcels handleChange function with the new parcelData', () => {
    expect.assertions(2);

    var data = {
        value: {
            a: {
                b: "!!!"
            }
        },
        handleChange: (parcel) => {
            let {value} = parcel.data;
            expect({a: {b: "???"}}).toEqual(value);
        }
    };

    new Parcel(data).updateIn(["a", "b"], ii => {
        expect("!!!").toBe(ii);
        return "???";
    });
});

test('ParentParcel.updateShapeIn(keyPath) should call the Parcels handleChange function with the new parcelData', () => {
    let updater = jest.fn(parcelShape => parcelShape.push(4));
    let handleChange = jest.fn();

    new Parcel({
        value: {
            abc: {
                def: [1,2,3]
            }
        },
        handleChange
    }).updateShapeIn(["abc", "def"], updater);

    expect(updater.mock.calls[0][0] instanceof ParcelShape).toBe(true);
    expect(handleChange.mock.calls[0][0].data.value).toEqual({
        abc: {
            def: [1,2,3,4]
        }
    });
});

test('ParentParcel.deleteIn(keyPath) should delete deeply', () => {
    var data = {
        value: {
            a: {
                b: "!!!"
            }
        },
        handleChange: (parcel) => {
            let {value} = parcel.data;
            expect(value).toEqual({a: {}});
        }
    };

    new Parcel(data).deleteIn(["a", "b"]);
});
