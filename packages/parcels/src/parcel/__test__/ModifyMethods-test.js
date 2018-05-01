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
    tt.is(223, modifiedParcel && modifiedParcel.value(), 'chain returns modified parcel value');
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
        value: "???",
        key: "^"
    };
    tt.deepEqual(expectedData, updated);
});

test('Parcel.modifyValue() should return a new parcel with updated parcelData', (tt: Object) => {
    tt.plan(2);
    var data = {
        value: [123],
        handleChange
    };
    var parcel = new Parcel(data).get(0);
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

test('Parcel should addPreModifier', (tt: Object) => {
    tt.plan(4);

    var data = {
        value: 123,
        handleChange: (parcel) => {
            tt.is(parcel.id(), "~mv", "id() of handleChange parcel proves that preModifier have been applied already");
            tt.is(parcel.value(), 457, "handleChange parcel value proves that modifier has been applied");
        }
    };

    let parcel = new Parcel(data)
        .addPreModifier((parcel) => parcel.modifyValue(ii => ii + 1));

    tt.is(parcel.id(), "~mv", "id() of constructed parcel proves that preModifier have been applied already");
    tt.is(parcel.value(), 124, "constructed parcel value proves that modifier has been applied");
    parcel.onChange(456);
});


test('Parcel should addModifier', (tt: Object) => {
    var data = {
        value: [1,2,3],
        handleChange
    };

    let parcel = new Parcel(data)
        .addModifier((parcel) => parcel.modifyValue(ii => Array.isArray(ii) ? [...ii, 4] : ii + 10));

    tt.is(parcel.id(), "~am/~mv", "id() of parcel proves that modifier has been applied already");
    tt.deepEqual(parcel.value(), [1,2,3,4], "parcel value proves that modifier has been applied to current parcel");

    let element = parcel.get(0);

    tt.is(element.id(), "~am/~mv/#a/~mv", "id() of element parcel proves that modifier has been applied already");
    tt.deepEqual(element.value(), 11, "element parcel value proves that modifier has been applied to current parcel");
});

test('Parcel should addDescendantModifier', (tt: Object) => {
    var data = {
        value: [1,2,3],
        handleChange
    };

    let parcel = new Parcel(data)
        .addDescendantModifier((parcel) => parcel.modifyValue(ii => Array.isArray(ii) ? [...ii, 4] : ii + 10));

    tt.is(parcel.id(), "~am", "id() of parcel proves that modifier has NOT been applied already");
    tt.deepEqual(parcel.value(), [1,2,3], "parcel value proves that modifier has NOT been applied to current parcel");

    let element = parcel.get(0);

    tt.is(element.id(), "~am/#a/~mv", "id() of element parcel proves that modifier has been applied already");
    tt.deepEqual(element.value(), 11, "element parcel value proves that modifier has been applied to current parcel");
});

test('Parcel should addModifier with simple glob', (tt: Object) => {
    var data = {
        value: {
            abc: 123,
            def: 456
        },
        handleChange
    };

    let parcel = new Parcel(data)
        .addModifier({
            modifier: (parcel) => parcel.modifyValue(ii => ii + 1),
            glob: "abc"
        });

    tt.is(parcel.get('abc').id(), "~am/abc/~mv", "id() of abc parcel proves that modifier has been applied already");
    tt.is(parcel.get('abc').value(), 124, "abc parcel value proves that modifier has been applied");

    tt.is(parcel.get('def').id(), "~am/def", "id() of def parcel proves that modifier has NOT been applied");
    tt.is(parcel.get('def').value(), 456, "def parcel value proves that modifier has NOT been applied");
});

test('Parcel should addModifier with deep glob', (tt: Object) => {
    var data = {
        value: {
            abc: {
                ghi: 123
            },
            def: 456
        },
        handleChange
    };

    let parcel = new Parcel(data)
        .addModifier({
            modifier: (parcel) => parcel.modifyValue(ii => ii + 1),
            glob: "abc/ghi"
        });

    tt.is(parcel.getIn(['abc', 'ghi']).id(), "~am/abc/ghi/~mv", "id() of abc/ghi parcel proves that modifier has been applied already");
    tt.is(parcel.getIn(['abc', 'ghi']).value(), 124, "abc/ghi parcel value proves that modifier has been applied");

    tt.is(parcel.get('def').id(), "~am/def", "id() of def parcel proves that modifier has NOT been applied");
    tt.is(parcel.get('def').value(), 456, "def parcel value proves that modifier has NOT been applied");
});