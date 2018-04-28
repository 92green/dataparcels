// @flow
import test from 'ava';
import Parcel from '../Parcel';

const handleChange = ii => {};

test('Parcel.data() should return the Parcels data', (tt: Object) => {
    var data = {
        value: 123,
        handleChange
    };

    var expectedData = {
        key: '^',
        value: 123
    };

    tt.deepEqual(expectedData, new Parcel(data).data());
});

test('Parcel.data() should strip the returned Parcel data', (tt: Object) => {
    var data = {
        value: 123,
        handleChange
    };

    var expectedData = {
        key: '^',
        value: 123
    };

    tt.deepEqual(new Parcel(data).data(), expectedData);
});

test('Parcel.raw() should return the Parcels data without stripping', (tt: Object) => {
    var data = {
        value: 123,
        child: undefined,
        handleChange
    };

    var expectedData = {
        value: 123,
        child: undefined,
        key: '^'
    };

    tt.deepEqual(expectedData, new Parcel(data).raw());
});

test('Parcel.value() should return the Parcels value', (tt: Object) => {
    var data = {
        value: 123,
        handleChange
    };
    tt.is(new Parcel(data).value(), 123);
});

test('Parcel.value() should return the same instance of the Parcels value', (tt: Object) => {
    var myObject = {a:1,b:2};
    var data = {
        value: myObject,
        handleChange
    };
    tt.is(new Parcel(data).value(), myObject);
});

test('Parcel.setSelf() should call the Parcels handleChange function with the new parcelData', (tt: Object) => {
    tt.plan(2);

    var data = {
        value: 123
    };

    var expectedData = {
        value: 456,
        key: '^'
    };

    var expectedAction = {
        type: "set",
        keyPath: [],
        payload: {
            value: 456
        }
    };

    new Parcel({
        ...data,
        handleChange: (parcel, action) => {
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            tt.deepEqual(expectedAction, action[0].toJS(), 'updated action is correct');
        }
    }).setSelf(456);
});

test('Parcel.updateSelf() should call the Parcels handleChange function with the new parcelData', (tt: Object) => {
    tt.plan(3);

    var data = {
        value: 123
    };

    var expectedArg = 123;

    var expectedData = {
        value: 456,
        key: '^'
    };

    var expectedAction = {
        type: "set",
        keyPath: [],
        payload: {
            value: 456
        }
    };

    new Parcel({
        ...data,
        handleChange: (parcel, action) => {
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            tt.deepEqual(expectedAction, action[0].toJS(), 'updated action is correct');
        }
    }).updateSelf((ii) => {
        tt.deepEqual(expectedArg, ii, 'update passes correct argument to updater');
        return 456;
    });
});

test('Parcel.onChange() should work like set that only accepts a single argument', (tt: Object) => {
    tt.plan(2);

    var data = {
        value: 123
    };

    var expectedData = {
        value: 456,
        key: '^'
    };

    var expectedAction = {
        type: "set",
        keyPath: [],
        payload: {
            value: 456
        }
    };

    new Parcel({
        ...data,
        handleChange: (parcel, action) => {
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            tt.deepEqual(expectedAction, action[0].toJS(), 'updated action is correct');
        }
    }).onChange(456);
});

test('Parcel.onChangeDOM() should work like onChange but take the value from event.target.value', (tt: Object) => {
    tt.plan(2);

    var data = {
        value: 123
    };

    var expectedData = {
        value: 456,
        key: '^'
    };

    var expectedAction = {
        type: "set",
        keyPath: [],
        payload: {
            value: 456
        }
    };

    new Parcel({
        ...data,
        handleChange: (parcel, action) => {
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            tt.deepEqual(expectedAction, action[0].toJS(), 'updated action is correct');
        }
    }).onChangeDOM({
        target: {
            value: 456
        }
    });
});

test('Parcel.spread() returns an object with value and onChange', (tt: Object) => {
    var data = {
        value: 123,
        handleChange: (parcel) => {
            let {value} = parcel.data();
            tt.is(value, 456);
        }
    };

    var parcel = new Parcel(data);

    const {
        value,
        onChange
    } = parcel.spread();

    tt.is(value, parcel.value(), 'value is returned');
    tt.is(onChange, parcel.onChange, 'onChange is returned');
});

test('Parcel.spreadDOM() returns an object with value and onChange (onChangeDOM)', (tt: Object) => {
    var data = {
        value: 123,
        handleChange: (parcel) => {
            let {value} = parcel.data();
            tt.is(value, 456);
        }
    };

    var parcel = new Parcel(data);

    const {
        value,
        onChange
    } = parcel.spreadDOM();

    tt.is(value, parcel.value(), 'value is returned');
    tt.is(onChange, parcel.onChangeDOM, 'onChangeDOM is returned');
});