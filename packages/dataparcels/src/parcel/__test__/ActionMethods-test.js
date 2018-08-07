// @flow
import Parcel from '../Parcel';

test('Parcel.batch() should batch actions', () => {
    expect.assertions(4);

    var functionCalls = [];
    var expectedFunctionCalls = [
        'batch',
        'onChange(456)',
        'onChange(789)',
        'handleChange'
    ];


    var data = {
        value: 123,
        handleChange: (parcel) => {
            let {value} = parcel.data();
            expect(value).toBe(789);
            functionCalls.push("handleChange");
        }
    };

    new Parcel(data).batch((parcel) => {
        functionCalls.push("batch");
        parcel.onChange(456);
        expect(456).toBe(parcel.value());
        functionCalls.push("onChange(456)");
        parcel.onChange(789);
        expect(789).toBe(parcel.value());
        functionCalls.push("onChange(789)");
    });

    expect(expectedFunctionCalls).toEqual(functionCalls);
});

test('Parcel.batch() should batch correctly with non-idempotent actions', () => {
    expect.assertions(4);

    var functionCalls = [];
    var expectedFunctionCalls = [
        'batch',
        'push(456)',
        'push(789)',
        'handleChange'
    ];

    var data = {
        value: [],
        handleChange: (parcel) => {
            let {value} = parcel.data();
            expect(value).toEqual([456,789]);
            functionCalls.push("handleChange");
        }
    };

    new Parcel(data).batch((parcel) => {
        functionCalls.push("batch");
        parcel.push(456);
        expect([456]).toEqual(parcel.value());
        functionCalls.push("push(456)");
        parcel.push(789);
        expect([456, 789]).toEqual(parcel.value());
        functionCalls.push("push(789)");
    });

    expect(expectedFunctionCalls).toEqual(functionCalls);
});

test('Parcel.batch() should not fire handleChange if no actions called within batch', () => {
    var handleChangeCalled = false;

    var data = {
        value: 123,
        handleChange: (parcel) => {
            handleChangeCalled = true;
        }
    };

    new Parcel(data).batch((parcel) => {});
    expect(handleChangeCalled).toBe(false);
});

test('Parcel.batch() should be nestable', () => {
    expect.assertions(5);

    var functionCalls = [];
    var expectedFunctionCalls = [
        'batch',
        'onChange(123)',
        'batch again',
        'onChange(456)',
        'out again',
        'onChange(789)',
        'handleChange'
    ];

    var data = {
        value: 123,
        handleChange: (parcel) => {
            let {value} = parcel.data();
            expect(value).toBe(789);
            functionCalls.push("handleChange");
        }
    };

    new Parcel(data).batch((parcel) => {
        functionCalls.push("batch");
        parcel.onChange(123);
        expect(123).toBe(parcel.value());
        functionCalls.push("onChange(123)");
        parcel.batch((parcel) => {
            functionCalls.push("batch again");
            parcel.onChange(456);
            expect(456).toBe(parcel.value());
            functionCalls.push("onChange(456)");
        });
        functionCalls.push("out again");
        parcel.onChange(789);
        expect(789).toBe(parcel.value());
        functionCalls.push("onChange(789)");
    });

    expect(expectedFunctionCalls).toEqual(functionCalls);
});
