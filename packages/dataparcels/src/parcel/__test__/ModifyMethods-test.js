// @flow
import Parcel from '../Parcel';
import type ChangeRequest from '../../change/ChangeRequest';

test('Parcel.modifyValue() should return a new parcel with updated parcelData', () => {
    expect.assertions(2);
    var data = {
        value: [123]
    };
    var parcel = new Parcel(data).get(0);
    var updated = parcel
        .modifyValue((value: *, parcelData: Parcel) => {
            expect(parcelData).toBe(parcel);
            return value + 1;
        })
        .data;

    var expectedData = {
        meta: {},
        child: undefined,
        value: 124,
        key: "#a"
    };
    expect(expectedData).toEqual(updated);
});

test('Parcel.modifyValue() should recognise if value changes types, and set value if type changes', () => {
    let handleChange = jest.fn();
    let parcel = new Parcel({
        value: 123,
        handleChange
    })
        .modifyValue(value => [])
        .push(123);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange.mock.calls[0][0].value).toEqual([123]);
});

test('Parcel.modifyChange() should allow you to change the payload of a changed parcel', () => {
    expect.assertions(1);

    var data = {
        value: 123,
        handleChange: (parcel: Parcel) => {
            let {value} = parcel.data;
            expect(457).toBe(value);
        }
    };

    new Parcel(data)
        .modifyChange((parcel: Parcel, changeRequest: ChangeRequest) => {
            parcel.set(changeRequest.data.value + 1);
        })
        .onChange(456);
});

test('Parcel.modifyChange() should allow you to stop a change by not calling dispatch', () => {
    var handleChange = jest.fn();

    var data = {
        value: 123,
        handleChange
    };

    new Parcel(data)
        .modifyChange((parcel: Parcel, changeRequest: ChangeRequest) => {
            // nothing here
        })
        .onChange(456);

    expect(handleChange).toHaveBeenCalledTimes(0);
});

test('Parcel.modifyChangeValue() should allow you to change the payload of a changed parcel with an updater', () => {
    expect.assertions(1);

    var data = {
        value: 123,
        handleChange: (parcel: Parcel) => {
            let {value} = parcel.data;
            expect(457).toBe(value);
        }
    };

    new Parcel(data)
        .modifyChangeValue(value => value + 1)
        .onChange(456);
});

test('Parcel.modifyChangeValue() should allow changes to meta through', () => {
    expect.assertions(2);

    var data = {
        value: 123,
        handleChange: (parcel: Parcel) => {
            let {value, meta} = parcel.data;
            expect(457).toBe(value);
            expect({abc: 123}).toEqual(meta);
        }
    };

    new Parcel(data)
        .modifyChangeValue(value => value + 1)
        .batch(parcel => {
            parcel.onChange(456);
            parcel.setMeta({
                abc: 123
            });
        });
});


test('Parcel.initialMeta() should work', () => {
    expect.assertions(3);

    let meta = {a:1, b:2};

    var data = {
        value: 123,
        handleChange: (parcel: Parcel) => {
            let {meta} = parcel.data;
            expect({a:1, b:3}).toEqual(meta);
            expect({a:1, b:3}).toEqual(parcel.initialMeta().meta);
        }
    };

    let parcel = new Parcel(data).initialMeta(meta);
    expect(meta).toEqual(parcel.meta);
    parcel.setMeta({
        b: 3
    });
});

test('Parcel.initialMeta() should merge', () => {
    expect.assertions(2);

    let meta = {a:1, b:2};
    let meta2 = {b:1, c:3}; // this b will be ignored because it will have already been set by the time this is applied

    var data = {
        value: 123,
        handleChange: (parcel: Parcel) => {
            let {meta} = parcel.data;
            expect({a:1, b:3, c:3}).toEqual(meta);
        }
    };

    let parcel = new Parcel(data).initialMeta(meta).initialMeta(meta2);
    expect({a:1, b:2, c:3}).toEqual(parcel.meta);
    parcel.setMeta({
        b: 3
    });
});
