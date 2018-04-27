// @flow
import test from 'ava';
import Parcel from '../Parcel';

const handleChange = ii => {};

test('Parcel.chain() should return the result of chains updater', (tt: Object) => {
    var data = {
        value: 123,
        handleChange
    };

    let parcel = new Parcel(data);
    let modifiedParcel = null;

    let chained = parcel.chain(ii => {
        tt.is(ii, parcel, 'chain is passed parcel');
        modifiedParcel = ii.modifyValue(ii => ii + 100);
        return modifiedParcel;
    });

    tt.is(modifiedParcel, chained, 'chain returns modified parcel');
    tt.is(223, modifiedParcel.value(), 'chain returns modified parcel value');
});

test('Parcel.modify() should return a new parcel with updated parcelData', (tt: Object) => {
    var data = {
        value: 123,
        key: "#a",
        handleChange
    };
    var updated = new Parcel(data)
        .modify((parcelData) => ({
            value: "???"
        }))
        .data();

    var expectedData = {
        value: "???"
    };
    tt.deepEqual(expectedData, updated);
});

test('Parcel.modifyValue() should return a new parcel with updated parcelData', (tt: Object) => {
    tt.plan(2);
    var data = {
        value: 123,
        handleChange
    };
    var parcel = new Parcel(data, {id: "#a", key: "#a"});
    var updated = parcel
        .modifyValue((value: *, parcelData: Parcel) => {
            tt.is(parcelData, parcel, "modifyValue is passed the Parcel as the second argument");
            return value + 1;
        })
        .data();

    var expectedData = {
        value: 124,
        key: "#a"
    };
    tt.deepEqual(expectedData, updated);
});

test('Parcel.modifyChange() should allow you to change the payload of a changed parcel', (tt: Object) => {
    tt.plan(1);

    var data = {
        value: 123,
        handleChange: (parcel: Parcel) => {
            let {value} = parcel.data();
            tt.is(value, 457, "original handleChange should receive updated value");
        }
    };

    new Parcel(data)
        .modifyChange(({parcel, newParcelData}: Object) => {
            parcel.setSelf(newParcelData.value + 1);
        })
        .onChange(456);
});

test('Parcel.modifyChange() should allow you to call apply to continue without modification', (tt: Object) => {
    tt.plan(1);

    var data = {
        value: 123,
        handleChange: (parcel: Parcel) => {
            let {value} = parcel.data();
            tt.is(value, 456, "original handleChange should receive updated value");
        }
    };

    new Parcel(data)
        .modifyChange(({apply}) => apply())
        .onChange(456);
});