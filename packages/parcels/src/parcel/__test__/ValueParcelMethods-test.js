// @flow
import test from 'ava';
import Parcel from '../Parcel';

test('Parcel.data() should return the Parcels data', (tt: Object) => {
    var data = {
        value: 123
    };

    var expectedData = {
        key: '^',
        value: 123
    };

    tt.deepEqual(expectedData, new Parcel(data).data());
});

test('Parcel.data() should strip the returned Parcel data', (tt: Object) => {
    var data = {
        value: 123
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
        child: undefined
    };

    var expectedData = {
        value: 123,
        child: undefined,
        key: '^',
        meta: {}
    };

    tt.deepEqual(expectedData, new Parcel(data).raw());
});

test('Parcel.value() should return the Parcels value', (tt: Object) => {
    var data = {
        value: 123
    };
    tt.is(new Parcel(data).value(), 123);
});

test('Parcel.value() should return the same instance of the Parcels value', (tt: Object) => {
    var myObject = {a:1,b:2};
    var data = {
        value: myObject
    };
    tt.is(new Parcel(data).value(), myObject);
});


test('Parcels should be able to accept no config', (tt: Object) => {
    let parcel = new Parcel();
    tt.deepEqual(undefined, parcel.value());
    parcel.onChange(123);
});

test('Parcels should be able to accept just value in config', (tt: Object) => {
    let parcel = new Parcel({
        value: 123
    });
    tt.deepEqual(123, parcel.value());
    parcel.onChange(456);
});

test('Parcels should be able to accept just handleChange in config', (tt: Object) => {
    let parcel = new Parcel({
        handleChange: (parcel) => {
            tt.is(456, parcel.value());
        }
    });
    tt.deepEqual(undefined, parcel.value());
    parcel.onChange(456);
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
        handleChange: (parcel, changeRequest) => {
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            tt.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct');
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
        handleChange: (parcel, changeRequest) => {
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            tt.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct');
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
        handleChange: (parcel, changeRequest) => {
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            tt.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct');
        }
    }).onChange(456);
});

test('Parcel.onChangeDOM() should work like onChange but take the value from event.currentTarget.value', (tt: Object) => {
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
        handleChange: (parcel, changeRequest) => {
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            tt.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct');
        }
    }).onChangeDOM({
        currentTarget: {
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

test('Parcel.setMeta() should call the Parcels handleChange function with the new meta merged in', (tt: Object) => {
    tt.plan(3);

    var data = {
        value: 123
    };

    var expectedData = {
        value: 123,
        key: '^',
        meta: {
            abc: 123
        }
    };

    var expectedData2 = {
        value: 123,
        key: '^',
        meta: {
            abc: 123,
            def: 456
        }
    };

    var expectedAction = {
        type: "setMeta",
        keyPath: [],
        payload: {
            meta: {
                abc: 123
            }
        }
    };

    var changes = 0;

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            changes++;

            if(changes === 1) {
                tt.deepEqual(expectedData, parcel.data(), 'updated data is correct');
                tt.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct');
                parcel.setMeta({
                    def: 456
                });

            } else if(changes === 2) {
                tt.deepEqual(expectedData2, parcel.data(), 'updated data is correct');
            }
        }
    }).setMeta({
        abc: 123
    });
});

test('Parcel.meta() should return meta', (tt: Object) => {
    var meta = {
        abc: 123,
        def: 456
    };

    var data = {
        value: 123,
        handleChange: (parcel) => {
            // the see if it is returned correctly
            tt.deepEqual(meta, parcel.meta(), 'meta is returned');
            tt.true(meta !== parcel.meta(), 'meta object should be cloned to prevent mutating');
        }
    };

    // first set the meta
    var parcel = new Parcel(data).setMeta(meta);
});

test('Parcel.updateMeta() should call the Parcels handleChange function with the new meta merged in', (tt: Object) => {
    tt.plan(5);

    var data = {
        value: 123
    };

    var expectedData = {
        value: 123,
        key: '^',
        meta: {
            abc: 123
        }
    };

    var expectedData2 = {
        value: 123,
        key: '^',
        meta: {
            abc: 123,
            def: 456
        }
    };

    var expectedAction = {
        type: "setMeta",
        keyPath: [],
        payload: {
            meta: {
                abc: 123
            }
        }
    };

    var changes = 0;

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            changes++;

            if(changes === 1) {
                tt.deepEqual(expectedData, parcel.data(), 'updated data is correct');
                tt.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct');
                parcel.updateMeta(meta => {
                    tt.deepEqual({abc: 123}, meta, 'updateMeta should receive initial meta of {abc:123}')
                    return {
                        def: 456
                    };
                });

            } else if(changes === 2) {
                tt.deepEqual(expectedData2, parcel.data(), 'updated data is correct');
            }
        }
    }).updateMeta(meta => {
        tt.deepEqual({}, meta, 'updateMeta should receive initial meta of {}')
        return {
            abc: 123
        };
    });
});

test('Parcel.setChangeRequestMeta() should set change request meta', (tt: Object) => {
    var data = {
        value: 123,
        handleChange: (parcel, changeRequest) => {
            tt.deepEqual({a: 3, b: 2}, changeRequest.meta());
        }
    };

    var parcel = new Parcel(data).batch(parcel => {
        parcel.setChangeRequestMeta({a: 1});
        parcel.onChange(456);
        parcel.setChangeRequestMeta({b: 2});
        parcel.setChangeRequestMeta({a: 3});
    });
});

test('Parcel.hasDispatched() should say if a parcel has dispatched from the current parcels path location', (tt: Object) => {
    tt.plan(6);

    let p = new Parcel({
        value: {
            abc: 123,
            def: 456
        },
        handleChange: (p2) => {
            tt.true(p2.hasDispatched(), `top parcel should have dispatched`);
            tt.true(p2.get('abc').hasDispatched(), `abc parcel should have dispatched`);
            tt.false(p2.get('def').hasDispatched(), `def parcel should not have dispatched`);
        }
    });

    tt.false(p.hasDispatched(), `top parcel should not have dispatched initially`);
    tt.false(p.get('abc').hasDispatched(), `abc parcel should not have dispatched initially`);
    tt.false(p.get('def').hasDispatched(), `def parcel should not have dispatched initially`);

    p.get('abc').onChange(789);
});

test('Parcel.ping() should call the Parcels handleChange function with no change', (tt: Object) => {
    tt.plan(1);

    var data = {
        value: 123
    };

    var expectedData = {
        value: 123,
        key: '^'
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            tt.deepEqual(expectedData, parcel.data(), 'data is correct');
        }
    }).ping(456);
});

test('Parcel.setInternalLocationShareData() and Parcel.getInternalLocationShareData should store data per location', (tt: Object) => {

    let p = new Parcel({
        value: {
            abc: 123,
            def: 456
        }
    });

    tt.deepEqual({}, p.getInternalLocationShareData(), 'getInternalLocationShareData() should default to empty object');

    p.get('abc').setInternalLocationShareData({x:1});
    tt.deepEqual({x:1}, p.get('abc').getInternalLocationShareData(), 'setInternalLocationShareData() should set data at abc');

    p.get('abc').setInternalLocationShareData({y:2});
    tt.deepEqual({x:1, y:2}, p.get('abc').getInternalLocationShareData(), 'setInternalLocationShareData() should merge data at abc');

    tt.deepEqual({}, p.get('def').getInternalLocationShareData(), 'getInternalLocationShareData() at another location should be empty');

    p.get('def').setInternalLocationShareData({x:1});
    tt.deepEqual({x:1}, p.get('def').getInternalLocationShareData(), 'setInternalLocationShareData() should set data at def');

});
