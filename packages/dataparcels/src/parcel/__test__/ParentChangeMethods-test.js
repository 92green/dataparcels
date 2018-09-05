// @flow
import Parcel from '../Parcel';
import map from 'unmutable/lib/map';

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
    expect.assertions(2);

    var data = {
        value: {
            a: "!!!"
        },
        handleChange: (parcel) => {
            let {value} = parcel.data;
            expect({a: "???"}).toEqual(value);
        }
    };

    new Parcel(data).update("a", ii => {
        expect("!!!").toBe(ii);
        return "???";
    });
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
