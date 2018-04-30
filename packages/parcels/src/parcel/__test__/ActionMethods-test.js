// @flow
import test from 'ava';
import Parcel from '../Parcel';

const handleChange = ii => {};

test('Parcel._buffer() should buffer any actions and _flush() should dispatch them', (tt: Object) => {
    tt.plan(4);

    var functionCalls = [];
    var expectedFunctionCalls = [
        '_buffer',
        'onChange(456)',
        'onChange(789)',
        'handleChange'
    ];

    var data = {
        value: 123,
        handleChange: (parcel) => {
            let {value} = parcel.data();
            tt.is(value, 789);
            functionCalls.push("handleChange");
        }
    };

    let parcel = new Parcel(data);
    parcel._buffer();
    functionCalls.push("_buffer");
    parcel.onChange(456);
    tt.deepEqual({value: 456}, parcel.data(), 'parcel contains correct data after first onchange');
    functionCalls.push("onChange(456)");
    parcel.onChange(789);
    tt.deepEqual({value: 789}, parcel.data(), 'parcel contains correct data after second onchange');
    functionCalls.push("onChange(789)");
    parcel._flush();

    tt.deepEqual(expectedFunctionCalls, functionCalls, 'functions are called in correct order due to buffering');
});

test('Parcel.batch() should batch actions', (tt: Object) => {
    tt.plan(2);

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
            tt.is(value, 789);
            functionCalls.push("handleChange");
        }
    };

    new Parcel(data).batch((parcel) => {
        functionCalls.push("batch");
        parcel.onChange(456);
        functionCalls.push("onChange(456)");
        parcel.onChange(789);
        functionCalls.push("onChange(789)");
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

test('Parcel should apply preModifier', (tt: Object) => {
    tt.plan(4);

    var data = {
        value: 123,
        handleChange: (parcel) => {
            tt.is(parcel.id(), "&uv&", "id() of handleChange parcel proves that preModifier have been applied already");
            tt.is(parcel.value(), 457, "handleChange parcel value proves that modifier has been applied");
        }
    };

    let parcel = new Parcel(data)
        .addPreModifier((parcel) => parcel.modifyValue(ii => ii + 1));

    tt.is(parcel.id(), "&uv&", "id() of constructed parcel proves that preModifier have been applied already");
    tt.is(parcel.value(), 124, "constructed parcel value proves that modifier has been applied");
    parcel.onChange(456);
});
