// @flow
import test from 'ava';
import Parcel from '../Parcel';

test('Parcel.data() should return the Parcels data', t => {
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

    t.deepEqual(expectedData, new Parcel(data).data());
});

test('Parcel.value() should return the Parcels value', t => {
    var data = {
        value: 123
    };
    t.is(new Parcel(data).value(), 123);
});

test('Parcel.value() should return the same instance of the Parcels value', t => {
    var myObject = {a:1,b:2};
    var data = {
        value: myObject
    };
    t.is(new Parcel(data).value(), myObject);
});


test('Parcels should be able to accept no config', t => {
    let parcel = new Parcel();
    t.deepEqual(undefined, parcel.value());
    parcel.onChange(123);
});

test('Parcels should be able to accept just value in config', t => {
    let parcel = new Parcel({
        value: 123
    });
    t.deepEqual(123, parcel.value());
    parcel.onChange(456);
});

test('Parcels should be able to accept just handleChange in config', t => {
    let parcel = new Parcel({
        handleChange: (parcel) => {
            t.is(456, parcel.value());
        }
    });
    t.deepEqual(undefined, parcel.value());
    parcel.onChange(456);
});

test('Parcel.setSelf() should call the Parcels handleChange function with the new parcelData', t => {
    t.plan(2);

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
        payload: {
            value: 456
        }
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            t.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            t.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct');
        }
    }).setSelf(456);
});

test('Parcel.updateSelf() should call the Parcels handleChange function with the new parcelData', t => {
    t.plan(3);

    var data = {
        value: 123
    };

    var expectedArg = 123;

    var expectedData = {
        child: undefined,
        meta: {},
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
            t.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            t.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct');
        }
    }).updateSelf((ii) => {
        t.deepEqual(expectedArg, ii, 'update passes correct argument to updater');
        return 456;
    });
});

test('Parcel.onChange() should work like set that only accepts a single argument', t => {
    t.plan(2);

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
        payload: {
            value: 456
        }
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            t.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            t.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct');
        }
    }).onChange(456);
});

test('Parcel.onChangeDOM() should work like onChange but take the value from event.currentTarget.value', t => {
    t.plan(2);

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
        payload: {
            value: 456
        }
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            t.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            t.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct');
        }
    }).onChangeDOM({
        currentTarget: {
            value: 456
        }
    });
});

test('Parcel.spread() returns an object with value and onChange', t => {
    var data = {
        value: 123,
        handleChange: (parcel) => {
            let {value} = parcel.data();
            t.is(value, 456);
        }
    };

    var parcel = new Parcel(data);

    const {
        value,
        onChange
    } = parcel.spread();

    t.is(value, parcel.value(), 'value is returned');
    t.is(onChange, parcel.onChange, 'onChange is returned');
});

test('Parcel.spreadDOM() returns an object with value and onChange (onChangeDOM)', t => {
    var data = {
        value: 123,
        handleChange: (parcel) => {
            let {value} = parcel.data();
            t.is(value, 456);
        }
    };

    var parcel = new Parcel(data);

    const {
        value,
        onChange
    } = parcel.spreadDOM();

    t.is(value, parcel.value(), 'value is returned');
    t.is(onChange, parcel.onChangeDOM, 'onChangeDOM is returned');
});

test('Parcel.setMeta() should call the Parcels handleChange function with the new meta merged in', t => {
    t.plan(3);

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
                t.deepEqual(expectedMeta, parcel.meta(), 'updated meta is correct');
                t.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct');
                parcel.setMeta({
                    def: 456
                });

            } else if(changes === 2) {
                t.deepEqual(expectedMeta2, parcel.meta(), 'updated meta is correct');
            }
        }
    }).setMeta({
        abc: 123
    });
});

test('Parcel.meta() should return meta', t => {
    var meta = {
        abc: 123,
        def: 456
    };

    var data = {
        value: 123,
        handleChange: (parcel) => {
            // the see if it is returned correctly
            t.deepEqual(meta, parcel.meta(), 'meta is returned');
            t.true(meta !== parcel.meta(), 'meta object should be cloned to prevent mutating');
        }
    };

    // first set the meta
    var parcel = new Parcel(data).setMeta(meta);
});

test('Parcel.updateMeta() should call the Parcels handleChange function with the new meta merged in', t => {
    t.plan(5);

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
                t.deepEqual(expectedMeta, parcel.meta(), 'updated meta is correct');
                t.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct');
                parcel.updateMeta(meta => {
                    t.deepEqual({abc: 123}, meta, 'updateMeta should receive initial meta of {abc:123}')
                    return {
                        def: 456
                    };
                });

            } else if(changes === 2) {
                t.deepEqual(expectedMeta2, parcel.meta(), 'updated meta is correct');
            }
        }
    }).updateMeta(meta => {
        t.deepEqual({}, meta, 'updateMeta should receive initial meta of {}')
        return {
            abc: 123
        };
    });
});

test('Parcel.setChangeRequestMeta() should set change request meta', t => {
    var data = {
        value: 123,
        handleChange: (parcel, changeRequest) => {
            t.deepEqual({a: 3, b: 2}, changeRequest.changeRequestMeta());
        }
    };

    var parcel = new Parcel(data).batch(parcel => {
        parcel.setChangeRequestMeta({a: 1});
        parcel.onChange(456);
        parcel.setChangeRequestMeta({b: 2});
        parcel.setChangeRequestMeta({a: 3});
    });
});

test('Parcel.hasDispatched() should say if a parcel has dispatched from the current parcels path location', t => {
    t.plan(6);

    let p = new Parcel({
        value: {
            abc: 123,
            def: 456
        },
        handleChange: (p2) => {
            t.true(p2.hasDispatched(), `top parcel should have dispatched`);
            t.true(p2.get('abc').hasDispatched(), `abc parcel should have dispatched`);
            t.false(p2.get('def').hasDispatched(), `def parcel should not have dispatched`);
        }
    });

    t.false(p.hasDispatched(), `top parcel should not have dispatched initially`);
    t.false(p.get('abc').hasDispatched(), `abc parcel should not have dispatched initially`);
    t.false(p.get('def').hasDispatched(), `def parcel should not have dispatched initially`);

    p.get('abc').onChange(789);
});

test('Parcel.ping() should call the Parcels handleChange function with no change', t => {
    t.plan(1);

    var data = {
        value: 123
    };

    var expectedData = {
        child: undefined,
        meta: {},
        value: 123,
        key: '^'
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            t.deepEqual(expectedData, parcel.data(), 'data is correct');
        }
    }).ping(456);
});

test('Parcel.setInternalLocationShareData() and Parcel.getInternalLocationShareData should store data per location', t => {

    let p = new Parcel({
        value: {
            abc: 123,
            def: 456
        }
    });

    t.deepEqual({}, p.getInternalLocationShareData(), 'getInternalLocationShareData() should default to empty object');

    p.get('abc').setInternalLocationShareData({x:1});
    t.deepEqual({x:1}, p.get('abc').getInternalLocationShareData(), 'setInternalLocationShareData() should set data at abc');

    p.get('abc').setInternalLocationShareData({y:2});
    t.deepEqual({x:1, y:2}, p.get('abc').getInternalLocationShareData(), 'setInternalLocationShareData() should merge data at abc');

    t.deepEqual({}, p.get('def').getInternalLocationShareData(), 'getInternalLocationShareData() at another location should be empty');

    p.get('def').setInternalLocationShareData({x:1});
    t.deepEqual({x:1}, p.get('def').getInternalLocationShareData(), 'setInternalLocationShareData() should set data at def');

});
