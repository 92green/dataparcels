// @flow
import Parcel from '../Parcel';
import deleted from '../../parcelData/deleted';

test('Parcel.spread() returns an object with value and set', () => {
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
    expect(onChange).toBe(parcel.set);
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

test('Parcel.spreadInput() returns an object with value and onChange (_setInput)', () => {
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
    } = parcel.spreadInput();

    expect(value).toBe(parcel.value);
    expect(onChange).toBe(parcel._setInput);
});

test('Parcel.spreadInput(notFoundValue) returns an object with notFoundValue', () => {
    var parcel = new Parcel({
        value: undefined
    });

    var parcel2 = new Parcel({
        value: deleted
    });

    var parcel3 = new Parcel({
        value: "123"
    });

    expect(parcel.spreadInput("???").value).toBe("???");
    expect(parcel2.spreadInput("???").value).toBe("???");
    expect(parcel3.spreadInput("???").value).toBe("123");
});

test('Parcel.spreadCheckbox() returns an object with checked and onChange (_setCheckbox)', () => {

    var parcel = new Parcel({
        value: true
    });

    const {
        checked,
        onChange
    } = parcel.spreadCheckbox();

    expect(checked).toBe(parcel.value);
    expect(onChange).toBe(parcel._setCheckbox);
});

test('Parcel.spreadCheckbox(notFoundValue) returns an object with cast boolean / notFoundValue', () => {
    var parcel = new Parcel({
        value: undefined
    });

    var parcel3 = new Parcel({
        value: "123"
    });

    expect(parcel.spreadCheckbox().checked).toBe(false);
    expect(parcel.spreadCheckbox(true).checked).toBe(true);
    expect(parcel.spreadCheckbox(false).checked).toBe(false);
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
