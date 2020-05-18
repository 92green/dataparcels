// @flow
import Parcel from '../Parcel';
import GetAction from '../../util/__test__/GetAction-testUtil';

test('Parcel.dispatch() should pass handleChange to newly created parcel', () => {
    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: 123,
        handleChange
    });

    parcel.set(456);

    let [newParcel, changeRequest] = handleChange.mock.calls[0];

    expect(newParcel.value).toBe(456);
    expect(changeRequest.nextData.value).toBe(456);
    expect(changeRequest.prevData.value).toBe(123);

    newParcel.set(789);

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
        type: "basic.set",
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
            {"key": "#0"},
            {"key": "#1"}
        ],
        key: "^",
        meta: {},
        value: [[6], [2, 3, 4]]
    };

    var expectedDeepData = {
        child: undefined,
        meta: {},
        value: 6,
        key: '#0'
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

test('Parcel._setData() should set all parcelData', () => {
    expect.assertions(2);

    var expectedData = {
        child: undefined,
        meta: {foo: true},
        value: 444,
        key: '^'
    };

    var expectedAction = {
        type: "basic.setData",
        keyPath: [],
        payload: {
            value: 444,
            meta: {foo: true}
        }
    };

    new Parcel({
        value: 123,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data);
            expect(expectedAction).toEqual(GetAction(changeRequest));
        }
    })
        ._setData({
            value: 444,
            meta: {foo: true}
        });
});

test('Parcel.update() should call the Parcels handleChange function with the new parcelData', () => {

    let handleChange = jest.fn();
    let updater = jest.fn(({value}) => ({value: value + 1}));

    new Parcel({
        value: 123,
        handleChange
    }).update(updater);

    expect(updater.mock.calls[0][0].value).toBe(123);
    expect(handleChange.mock.calls[0][0].data.value).toBe(124);
});

test('Parcel._setInput() should work like set but take the value from event.currentTarget.value', () => {
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
        type: "basic.set",
        keyPath: [],
        payload: 456
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data);
            expect(expectedAction).toEqual(GetAction(changeRequest));
        }
    })._setInput({
        currentTarget: {
            value: 456
        }
    });
});

test('Parcel._setCheckbox() should work like set but take the value from event.currentTarget.checked', () => {

    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: false,
        handleChange
    });

    parcel._setCheckbox({
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
        type: "basic.setMeta",
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
