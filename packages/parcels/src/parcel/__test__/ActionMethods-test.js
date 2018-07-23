// @flow
import test from 'ava';
import Parcel from '../Parcel';

test('Parcel.batch() should batch actions', (tt: Object) => {
    tt.plan(4);

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
            tt.is(value, 789, 'parcel contains correct result');
            functionCalls.push("handleChange");
        }
    };

    new Parcel(data).batch((parcel) => {
        functionCalls.push("batch");
        parcel.onChange(456);
        tt.is(456, parcel.value(), 'parcel contains correct mutated value after first onchange');
        functionCalls.push("onChange(456)");
        parcel.onChange(789);
        tt.is(789, parcel.value(), 'parcel contains correct mutated value after second onchange');
        functionCalls.push("onChange(789)");
    });

    tt.deepEqual(expectedFunctionCalls, functionCalls, 'functions are called in correct order due to buffering');
});

test('Parcel.batch() should batch correctly with non-idempotent actions', (tt: Object) => {
    tt.plan(4);

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
            tt.deepEqual(value, [456,789], 'parcel contains correct result');
            functionCalls.push("handleChange");
        }
    };

    new Parcel(data).batch((parcel) => {
        functionCalls.push("batch");
        parcel.push(456);
        tt.deepEqual([456], parcel.value(), 'parcel contains correct mutated value after first onchange');
        functionCalls.push("push(456)");
        parcel.push(789);
        tt.deepEqual([456, 789], parcel.value(), 'parcel contains correct mutated value after second onchange');
        functionCalls.push("push(789)");
    });

    tt.deepEqual(expectedFunctionCalls, functionCalls, 'functions are called in correct order due to buffering');
});

test('Parcel.batch() should not fire handleChange if no actions called within batch', (tt: Object) => {
    var handleChangeCalled = false;

    var data = {
        value: 123,
        handleChange: (parcel) => {
            handleChangeCalled = true;
        }
    };

    new Parcel(data).batch((parcel) => {});
    tt.false(handleChangeCalled);
});

test('Parcel.batch() should be nestable', (tt: Object) => {
    tt.plan(5);

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
            tt.is(value, 789, 'parcel contains correct result');
            functionCalls.push("handleChange");
        }
    };

    new Parcel(data).batch((parcel) => {
        functionCalls.push("batch");
        parcel.onChange(123);
        tt.is(123, parcel.value(), 'parcel contains correct mutated value after first onchange');
        functionCalls.push("onChange(123)");
        parcel.batch((parcel) => {
            functionCalls.push("batch again");
            parcel.onChange(456);
            tt.is(456, parcel.value(), 'parcel contains correct mutated value after second onchange');
            functionCalls.push("onChange(456)");
        });
        functionCalls.push("out again");
        parcel.onChange(789);
        tt.is(789, parcel.value(), 'parcel contains correct mutated value after third onchange');
        functionCalls.push("onChange(789)");
    });

    tt.deepEqual(expectedFunctionCalls, functionCalls, 'functions are called in correct order due to buffering');
});
