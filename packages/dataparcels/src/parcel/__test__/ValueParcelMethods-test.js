// @flow
import Parcel from '../Parcel';

test('Parcel.data should return the Parcels data', () => {
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

    expect(expectedData).toEqual(new Parcel(data).data);
});

test('Parcel.value should return the Parcels value', () => {
    var data = {
        value: 123
    };
    expect(new Parcel(data).value).toBe(123);
});

test('Parcel.value should return the same instance of the Parcels value', () => {
    var myObject = {a:1,b:2};
    var data = {
        value: myObject
    };
    expect(new Parcel(data).value).toBe(myObject);
});


test('Parcels should be able to accept no config', () => {
    let parcel = new Parcel();
    expect(undefined).toEqual(parcel.value);
    parcel.onChange(123);
});

test('Parcels should be able to accept just value in config', () => {
    let parcel = new Parcel({
        value: 123
    });
    expect(123).toEqual(parcel.value);
    parcel.onChange(456);
});

test('Parcels should be able to accept just handleChange in config', () => {
    let parcel = new Parcel({
        handleChange: (parcel) => {
            expect(456).toBe(parcel.value);
        }
    });
    expect(undefined).toEqual(parcel.value);
    parcel.onChange(456);
});

test('Parcel.setSelf() should call the Parcels handleChange function with the new parcelData', () => {
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
        payload: {
            value: 456
        }
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data);
            expect(expectedAction).toEqual(changeRequest.actions()[0].toJS());
        }
    }).setSelf(456);
});

test('Parcel.updateSelf() should call the Parcels handleChange function with the new parcelData', () => {
    expect.assertions(3);

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
            expect(expectedData).toEqual(parcel.data);
            expect(expectedAction).toEqual(changeRequest.actions()[0].toJS());
        }
    }).updateSelf((ii) => {
        expect(expectedArg).toEqual(ii);
        return 456;
    });
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
        payload: {
            value: 456
        }
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data);
            expect(expectedAction).toEqual(changeRequest.actions()[0].toJS());
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
        payload: {
            value: 456
        }
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data);
            expect(expectedAction).toEqual(changeRequest.actions()[0].toJS());
        }
    }).onChangeDOM({
        currentTarget: {
            value: 456
        }
    });
});

test('Parcel.spread() returns an object with value and onChange', () => {
    var data = {
        value: 123,
        handleChange: (parcel) => {
            let {value} = parcel.data;
            expect(value).toBe(456);
        }
    };

    var parcel = new Parcel(data);

    const {
        value,
        onChange
    } = parcel.spread();

    expect(value).toBe(parcel.value);
    expect(onChange).toBe(parcel.onChange);
});

test('Parcel.spreadDOM() returns an object with value and onChange (onChangeDOM)', () => {
    var data = {
        value: 123,
        handleChange: (parcel) => {
            let {value} = parcel.data;
            expect(value).toBe(456);
        }
    };

    var parcel = new Parcel(data);

    const {
        value,
        onChange
    } = parcel.spreadDOM();

    expect(value).toBe(parcel.value);
    expect(onChange).toBe(parcel.onChangeDOM);
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
                expect(expectedMeta).toEqual(parcel.meta);
                expect(expectedAction).toEqual(changeRequest.actions()[0].toJS());
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

test('Parcel.meta should return meta', () => {
    var meta = {
        abc: 123,
        def: 456
    };

    var data = {
        value: 123,
        handleChange: (parcel) => {
            // the see if it is returned correctly
            expect(meta).toEqual(parcel.meta);
            expect(meta !== parcel.meta).toBe(true);
        }
    };

    // first set the meta
    var parcel = new Parcel(data).setMeta(meta);
});

test('Parcel.updateMeta() should call the Parcels handleChange function with the new meta merged in', () => {
    expect.assertions(5);

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
                expect(expectedMeta).toEqual(parcel.meta);
                expect(expectedAction).toEqual(changeRequest.actions()[0].toJS());
                parcel.updateMeta(meta => {
                    expect({abc: 123}).toEqual(meta)
                    return {
                        def: 456
                    };
                });

            } else if(changes === 2) {
                expect(expectedMeta2).toEqual(parcel.meta);
            }
        }
    }).updateMeta(meta => {
        expect({}).toEqual(meta)
        return {
            abc: 123
        };
    });
});

test('Parcel.setChangeRequestMeta() should set change request meta', () => {
    var data = {
        value: 123,
        handleChange: (parcel, changeRequest) => {
            expect({a: 3, b: 2}).toEqual(changeRequest.changeRequestMeta());
        }
    };

    var parcel = new Parcel(data).batch(parcel => {
        parcel.setChangeRequestMeta({a: 1});
        parcel.onChange(456);
        parcel.setChangeRequestMeta({b: 2});
        parcel.setChangeRequestMeta({a: 3});
    });
});

test('Parcel.hasDispatched() should say if a parcel has dispatched from the current parcels path location', () => {
    expect.assertions(6);

    let p = new Parcel({
        value: {
            abc: 123,
            def: 456
        },
        handleChange: (p2) => {
            expect(p2.hasDispatched()).toBe(true);
            expect(p2.get('abc').hasDispatched()).toBe(true);
            expect(p2.get('def').hasDispatched()).toBe(false);
        }
    });

    expect(p.hasDispatched()).toBe(false);
    expect(p.get('abc').hasDispatched()).toBe(false);
    expect(p.get('def').hasDispatched()).toBe(false);

    p.get('abc').onChange(789);
});

test('Parcel.ping() should call the Parcels handleChange function with no change', () => {
    expect.assertions(1);

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
            expect(expectedData).toEqual(parcel.data);
        }
    }).ping(456);
});

test('Parcel.setInternalLocationShareData() and Parcel.getInternalLocationShareData should store data per location', () => {

    let p = new Parcel({
        value: {
            abc: 123,
            def: 456
        }
    });

    expect({}).toEqual(p.getInternalLocationShareData());

    p.get('abc').setInternalLocationShareData({x:1});
    expect({x:1}).toEqual(p.get('abc').getInternalLocationShareData());

    p.get('abc').setInternalLocationShareData({y:2});
    expect({x:1, y:2}).toEqual(p.get('abc').getInternalLocationShareData());

    expect({}).toEqual(p.get('def').getInternalLocationShareData());

    p.get('def').setInternalLocationShareData({x:1});
    expect({x:1}).toEqual(p.get('def').getInternalLocationShareData());

});
