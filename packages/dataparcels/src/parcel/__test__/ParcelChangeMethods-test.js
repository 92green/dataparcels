// @flow
import Parcel from '../Parcel';
import GetAction from '../../util/__test__/GetAction-testUtil';
import ParcelShape from '../../parcelShape/ParcelShape';
import asShape from '../../parcelShape/asShape';
import ParcelNode from '../../parcelNode/ParcelNode';
import asNode from '../../parcelNode/asNode';
import asChildNodes from '../../parcelNode/asChildNodes';
import TestValidateValueUpdater from '../../util/__test__/TestValidateValueUpdater-testUtil';

test('Parcel.dispatch() should pass handleChange to newly created parcel', () => {
    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: 123,
        handleChange
    });

    parcel.onChange(456);

    let [newParcel, changeRequest] = handleChange.mock.calls[0];

    expect(newParcel.value).toBe(456);
    expect(changeRequest.nextData.value).toBe(456);
    expect(changeRequest.prevData.value).toBe(123);

    newParcel.onChange(789);

    let [newParcel2, changeRequest2] = handleChange.mock.calls[1];

    expect(newParcel2.value).toBe(789);
    expect(changeRequest2.nextData.value).toBe(789);
    expect(changeRequest2.prevData.value).toBe(456);
});

test('Parcel.set() should call the Parcels handleChange function with the new parcelData', () => {
    expect.assertions(3);

    var data = {
        value: 123
    };

    var expectedData = {
        child: undefined,
        meta: {},
        value: 456,
        key: '^'
    };

    var expectedAction = {
        type: "set",
        keyPath: [],
        payload: 456
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data);
            expect(expectedData).toEqual(changeRequest.nextData);
            expect(expectedAction).toEqual(GetAction(changeRequest));
        }
    }).set(456);
});

test('Parcel.set() should remove and replace child data when setting a deep data structure', () => {
    expect.assertions(2);

    var data = {
        value: [[1,2,3],[4]]
    };

    var expectedData = {
        child: [
            {"key": "#a"},
            {"key": "#b"}
        ],
        key: "^",
        meta: {},
        value: [[6], [2, 3, 4]]
    };

    var expectedDeepData = {
        child: undefined,
        meta: {},
        value: 6,
        key: '#a'
    };

    new Parcel({
        ...data,
        handleChange: (parcel) => {
            expect(parcel.data).toEqual(expectedData);
            let deep = parcel.getIn([0,0]).data;
            expect(deep).toEqual(expectedDeepData);
        }
    }).set([[6],[2,3,4]]);
});

test('Parcel.update() should call the Parcels handleChange function with the new parcelData', () => {

    let handleChange = jest.fn();
    let updater = jest.fn(ii => ii + 1);

    new Parcel({
        value: 123,
        handleChange
    }).update(updater);

    expect(updater.mock.calls[0][0]).toBe(123);
    expect(handleChange.mock.calls[0][0].data.value).toBe(124);
});

test('Parcel.update() should validate value updater', () => {
    TestValidateValueUpdater(
        expect,
        (value, updater) => new Parcel({value}).update(updater)
    );
});

test('Parcel.update(asShape()) should call the Parcels handleChange function with the new parcelData', () => {

    let handleChange = jest.fn();
    let updater = jest.fn(parcelShape => parcelShape.push(4));

    new Parcel({
        value: [1,2,3],
        handleChange
    }).update(asShape(updater));

    expect(updater.mock.calls[0][0] instanceof ParcelShape).toBe(true);
    expect(handleChange.mock.calls[0][0].data.value).toEqual([1,2,3,4]);
});

test('Parcel.update(asShape()) should work with a returned primitive', () => {

    let handleChange = jest.fn();
    let updater = jest.fn(() => 123);

    new Parcel({
        value: [1,2,3],
        handleChange
    }).update(ParcelShape.update(updater));

    expect(handleChange.mock.calls[0][0].data.value).toEqual(123);
});

test('Parcel.update(asShape()) should work with a returned collection containing parcels for children', () => {

    let handleChange = jest.fn();
    let updater = jest.fn(parcelShape => parcelShape.children().reverse());

    new Parcel({
        value: [1,2,3],
        handleChange
    }).update(ParcelShape.update(updater));

    expect(handleChange.mock.calls[0][0].data.value).toEqual([3,2,1]);
});

test('Parcel.update(asNode()) should call the Parcels handleChange function with the new parcelData', () => {

    let handleChange = jest.fn();
    let updater = jest.fn(node => node.setMeta({foo: true}));

    new Parcel({
        value: [1,2,3],
        handleChange
    }).update(asNode(updater));

    expect(updater.mock.calls[0][0] instanceof ParcelNode).toBe(true);
    expect(handleChange.mock.calls[0][0].data.meta).toEqual({foo: true});
    expect(handleChange.mock.calls[0][0].data.value).toEqual([1,2,3]);
});

test('Parcel.update(asChildNodes()) should call the Parcels handleChange function with the new parcelData', () => {

    let handleChange = jest.fn();
    let updater = jest.fn(arr => [...arr, 4]);

    new Parcel({
        value: [1,2,3],
        handleChange
    }).update(asChildNodes(updater));

    expect(updater.mock.calls[0][0][0] instanceof ParcelNode).toBe(true);
    expect(handleChange.mock.calls[0][0].data.value).toEqual([1,2,3,4]);
});



test('Parcel.onChange() should work like set that only accepts a single argument', () => {
    expect.assertions(2);

    var data = {
        value: 123
    };

    var expectedData = {
        child: undefined,
        meta: {},
        value: 456,
        key: '^'
    };

    var expectedAction = {
        type: "set",
        keyPath: [],
        payload: 456
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data);
            expect(expectedAction).toEqual(GetAction(changeRequest));
        }
    }).onChange(456);
});

test('Parcel.onChangeDOM() should work like onChange but take the value from event.currentTarget.value', () => {
    expect.assertions(2);

    var data = {
        value: 123
    };

    var expectedData = {
        child: undefined,
        meta: {},
        value: 456,
        key: '^'
    };

    var expectedAction = {
        type: "set",
        keyPath: [],
        payload: 456
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data);
            expect(expectedAction).toEqual(GetAction(changeRequest));
        }
    }).onChangeDOM({
        currentTarget: {
            value: 456
        }
    });
});

test('Parcel.onChangeDOMCheckbox() should work like onChange but take the value from event.currentTarget.checked', () => {

    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: false,
        handleChange
    });

    parcel.onChangeDOMCheckbox({
        currentTarget: {
            checked: true
        }
    });

    expect(handleChange.mock.calls[0][0].value).toBe(true);
});

test('Parcel.setMeta() should call the Parcels handleChange function with the new meta merged in', () => {
    expect.assertions(3);

    var data = {
        value: 123
    };

    var expectedMeta = {
        abc: 123
    };

    var expectedMeta2 = {
        abc: 123,
        def: 456
    };

    var expectedAction = {
        type: "setMeta",
        keyPath: [],
        payload: {
            abc: 123
        }
    };

    var changes = 0;

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            changes++;

            if(changes === 1) {
                expect(expectedMeta).toEqual(parcel.meta);
                expect(expectedAction).toEqual(GetAction(changeRequest));
                parcel.setMeta({
                    def: 456
                });

            } else if(changes === 2) {
                expect(expectedMeta2).toEqual(parcel.meta);
            }
        }
    }).setMeta({
        abc: 123
    });
});
