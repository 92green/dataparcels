// @flow
import Parcel from '../Parcel';

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

test('Parcel.spy() should be called with parcel', () => {

    let spy = jest.fn();
    let spy2 = jest.fn();

    let p = new Parcel({
        value: {
            abc: 123
        }
    });

    let p2 = p.spy(spy).get('abc')

    let childValue = p2.spy(spy2).value;

    expect(spy.mock.calls[0][0]).toBe(p);
    expect(spy2.mock.calls[0][0]).toBe(p2);
    expect(childValue).toBe(123);
});
