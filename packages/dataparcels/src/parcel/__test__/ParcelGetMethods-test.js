// @flow
import Parcel from '../Parcel';
import deleted from '../../parcelData/deleted';

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

test('Parcel.spread(notFoundValue) returns an object with notFoundValue', () => {
    var parcel = new Parcel({
        value: undefined
    });

    var parcel2 = new Parcel({
        value: deleted
    });

    var parcel3 = new Parcel({
        value: "123"
    });

    expect(parcel.spread("???").value).toBe("???");
    expect(parcel2.spread("???").value).toBe("???");
    expect(parcel3.spread("???").value).toBe("123");
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

test('Parcel.spreadDOM(notFoundValue) returns an object with notFoundValue', () => {
    var parcel = new Parcel({
        value: undefined
    });

    var parcel2 = new Parcel({
        value: deleted
    });

    var parcel3 = new Parcel({
        value: "123"
    });

    expect(parcel.spreadDOM("???").value).toBe("???");
    expect(parcel2.spreadDOM("???").value).toBe("???");
    expect(parcel3.spreadDOM("???").value).toBe("123");
});

test('Parcel.spreadDOMCheckbox() returns an object with checked and onChange (onChangeDOMCheckbox)', () => {

    var parcel = new Parcel({
        value: true
    });

    const {
        checked,
        onChange
    } = parcel.spreadDOMCheckbox();

    expect(checked).toBe(parcel.value);
    expect(onChange).toBe(parcel.onChangeDOMCheckbox);
});

test('Parcel.spreadDOMCheckbox(notFoundValue) returns an object with cast boolean / notFoundValue', () => {
    var parcel = new Parcel({
        value: undefined
    });

    var parcel3 = new Parcel({
        value: "123"
    });

    expect(parcel.spreadDOMCheckbox().checked).toBe(false);
    expect(parcel.spreadDOMCheckbox(true).checked).toBe(true);
    expect(parcel.spreadDOMCheckbox(false).checked).toBe(false);
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

test('Parcel.spyChange() should be called with changeRequest', () => {

    let spy = jest.fn();
    let spy2 = jest.fn();

    new Parcel({
        value: {
            abc: 123
        }
    })
        .spyChange(spy)
        .get('abc')
        .spyChange(spy2)
        .onChange(456);

    expect(spy2.mock.calls[0][0].nextData.value).toEqual(456);
    expect(spy.mock.calls[0][0].nextData.value).toEqual({abc: 456});
});

test('Parcel.pipe() should pass itself in and return what pipe() returns', () => {
    var parcel1 = new Parcel();
    var parcel2 = new Parcel();

    let updater1 = jest.fn(_ => _);
    let updater2 = jest.fn(_ => parcel2);

    var result = parcel1.pipe(updater1, updater2);

    expect(updater1.mock.calls[0][0]).toBe(parcel1);
    expect(updater2.mock.calls[0][0]).toBe(parcel1);
    expect(result).toBe(parcel2);
});

test('Parcel.metaAsParcel() should create a parcel out of meta', () => {
    let handleChange = jest.fn();

    var [parcel] = new Parcel({
        handleChange
    })
        ._changeAndReturn(parcel => {
            parcel.setMeta({
                cool: '???'
            });
        });

    let metaParcel = parcel.metaAsParcel('cool');
    expect(metaParcel.value).toBe('???');
    expect(metaParcel.id).toBe('^.~mp-cool');

    metaParcel.set('!!!');

    expect(handleChange.mock.calls[0][0].meta.cool).toBe('!!!');
    expect(handleChange.mock.calls[0][1].actions.length).toBe(1);
});

test('Parcel.metaAsParcel() should pass meta through', () => {
    let handleChange = jest.fn();

    var [parcel] = new Parcel({
        handleChange,
        value: 'value'
    })
        ._changeAndReturn(parcel => {
            parcel.setMeta({
                foo: 'foo',
                bar: 'bar'
            });
        });

    expect(parcel.metaAsParcel('foo').meta.foo).toBe('foo');
    expect(parcel.metaAsParcel('foo').meta.bar).toBe('bar');

    parcel.metaAsParcel('foo').setMeta({
        bar: 'BAZ'
    });

    expect(handleChange.mock.calls[0][0].value).toBe('value');
    expect(handleChange.mock.calls[0][0].meta.bar).toBe('BAZ');
    expect(handleChange.mock.calls[0][1].actions.length).toBe(1);
});
