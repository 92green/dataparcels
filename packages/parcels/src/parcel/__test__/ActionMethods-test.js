// @flow
import test from 'ava';
import Parcel from '../Parcel';

test('Parcel.batch() should batch actions', t => {
    t.plan(4);

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
            t.is(value, 789, 'parcel contains correct result');
            functionCalls.push("handleChange");
        }
    };

    new Parcel(data).batch((parcel) => {
        functionCalls.push("batch");
        parcel.onChange(456);
        t.is(456, parcel.value(), 'parcel contains correct mutated value after first onchange');
        functionCalls.push("onChange(456)");
        parcel.onChange(789);
        t.is(789, parcel.value(), 'parcel contains correct mutated value after second onchange');
        functionCalls.push("onChange(789)");
    });

    t.deepEqual(expectedFunctionCalls, functionCalls, 'functions are called in correct order due to buffering');
});

test('Parcel.batch() should batch correctly with non-idempotent actions', t => {
    t.plan(4);

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
            t.deepEqual(value, [456,789], 'parcel contains correct result');
            functionCalls.push("handleChange");
        }
    };

    new Parcel(data).batch((parcel) => {
        functionCalls.push("batch");
        parcel.push(456);
        t.deepEqual([456], parcel.value(), 'parcel contains correct mutated value after first onchange');
        functionCalls.push("push(456)");
        parcel.push(789);
        t.deepEqual([456, 789], parcel.value(), 'parcel contains correct mutated value after second onchange');
        functionCalls.push("push(789)");
    });

    t.deepEqual(expectedFunctionCalls, functionCalls, 'functions are called in correct order due to buffering');
});

test('Parcel.batch() should not fire handleChange if no actions called within batch', t => {
    var handleChangeCalled = false;

    var data = {
        value: 123,
        handleChange: (parcel) => {
            handleChangeCalled = true;
        }
    };

    new Parcel(data).batch((parcel) => {});
    t.false(handleChangeCalled);
});

test('Parcel.batch() should be nestable', t => {
    t.plan(5);

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
            t.is(value, 789, 'parcel contains correct result');
            functionCalls.push("handleChange");
        }
    };

    new Parcel(data).batch((parcel) => {
        functionCalls.push("batch");
        parcel.onChange(123);
        t.is(123, parcel.value(), 'parcel contains correct mutated value after first onchange');
        functionCalls.push("onChange(123)");
        parcel.batch((parcel) => {
            functionCalls.push("batch again");
            parcel.onChange(456);
            t.is(456, parcel.value(), 'parcel contains correct mutated value after second onchange');
            functionCalls.push("onChange(456)");
        });
        functionCalls.push("out again");
        parcel.onChange(789);
        t.is(789, parcel.value(), 'parcel contains correct mutated value after third onchange');
        functionCalls.push("onChange(789)");
    });

    t.deepEqual(expectedFunctionCalls, functionCalls, 'functions are called in correct order due to buffering');
});
