// @flow
import Parcel from '../Parcel';
import type ChangeRequest from '../../change/ChangeRequest';

test('Parcel.pipe() should return the result of pipe\'s updaters', () => {
    var data = {
        value: 123,
    };

    let parcel = new Parcel(data);
    let modifiedParcel = null;

    let modified = parcel.pipe(
        ii => {
            expect(ii).toBe(parcel);
            modifiedParcel = ii.modifyValue(ii => ii + 100);
            return modifiedParcel;
        },
        ii => {
            expect(ii).toBe(modifiedParcel);
            modifiedParcel = ii.modifyValue(ii => ii + 100);
            return modifiedParcel;
        }
    );

    expect(modifiedParcel).toBe(modified);
    expect(323).toBe(modifiedParcel && modifiedParcel.value);
});


test('Parcel.modifyData() should return a new parcel with updated parcelData', () => {
    var data = {
        value: 123,
        key: "#a"
    };
    var updated = new Parcel(data)
        .modifyData((parcelData) => ({
            value: "???"
        }))
        .data;

    var expectedData = {
        meta: {},
        child: undefined,
        value: "???",
        key: "^"
    };
    expect(expectedData).toEqual(updated);
});

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
            parcel.setSelf(changeRequest.data.value + 1);
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

test('Parcel should addModifier', () => {
    var data = {
        value: [1,2,3]
    };

    let parcel = new Parcel(data)
        .addModifier((parcel) => parcel.modifyValue(ii => Array.isArray(ii) ? [...ii, 4] : ii + 10));

    expect([1,2,3,4]).toEqual(parcel.value);

    let element = parcel.get(0);
    expect(11).toEqual(element.value);
});

test('Parcel should addDescendantModifier', () => {
    var data = {
        value: [1,2,3]
    };

    let parcel = new Parcel(data)
        .addDescendantModifier((parcel) => parcel.modifyValue(ii => Array.isArray(ii) ? [...ii, 4] : ii + 10));

    expect([1,2,3]).toEqual(parcel.value);

    let element = parcel.get(0);
    expect(11).toEqual(element.value);
});

test('Parcel should addModifier with simple match', () => {
    var data = {
        value: {
            abc: 123,
            def: 456
        }
    };

    let parcel = new Parcel(data)
        .addModifier({
            modifier: (parcel) => parcel.modifyValue(ii => ii + 1),
            match: "abc"
        });

    expect(124).toBe(parcel.get('abc').value);
    expect(456).toBe(parcel.get('def').value);
});

test('Parcel should addModifier with deep match', () => {
    var data = {
        value: {
            abc: {
                ghi: 123
            },
            def: 456
        }
    };

    let parcel = new Parcel(data)
        .addModifier({
            modifier: (parcel) => parcel.modifyValue(ii => ii + 1),
            match: "abc.ghi"
        });

    expect(124).toBe(parcel.getIn(['abc', 'ghi']).value);
    expect(456).toBe(parcel.get('def').value);
});

test('Parcel should addModifier with globstar', () => {
    var data = {
        value: {
            abc: {
                ghi: 123
            },
            def: 456
        }
    };

    let parcel = new Parcel(data)
        .addModifier({
            modifier: (parcel) => parcel.modifyValue(ii => typeof ii === "number" ?  ii + 1 : {...ii, woo: true}),
            match: "**.*"
        });

    expect(124).toBe(parcel.getIn(['abc', 'ghi']).value);
    expect(457).toBe(parcel.get('def').value);
});

test('Parcel should addModifier with typed match', () => {
    var data = {
        value: {
            abc: {
                ghi: [1,2,3],
                jkl: 123
            },
            def: 456,
            mno: [4,5,6]
        }
    };

    let parcel = new Parcel(data)
        .addModifier({
            modifier: (parcel) => parcel.modifyValue(ii => [...ii, 999]),
            match: "**.*:Indexed"
        });

    expect([4,5,6,999]).toEqual(parcel.get('mno').value);
});
