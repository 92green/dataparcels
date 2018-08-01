// @flow
import test from 'ava';
import swapPrev from '../swapPrev';

test('swapPrev should work', (t: Object) => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    let expectedParcelData = {
        value: [1,3,2],
        child: [
            {key:"#a"},
            {key:"#c"},
            {key:"#b"}
        ]
    };
    t.deepEqual(expectedParcelData, swapPrev(2)(parcelData), 'should work with in range number');
    t.deepEqual(expectedParcelData, swapPrev(-1)(parcelData), 'should work with negative');
    t.deepEqual(expectedParcelData, swapPrev(5)(parcelData), 'should work with positive wrapped number');
    t.deepEqual(expectedParcelData, swapPrev(-4)(parcelData), 'should work with negative wrapped number');
});

test('swapPrev should work with hashKeys', (t: Object) => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    let expectedParcelData = {
        value: [1,3,2],
        child: [
            {key:"#a"},
            {key:"#c"},
            {key:"#b"}
        ]
    };

    t.deepEqual(expectedParcelData, swapPrev("#c")(parcelData));
});

test('swapPrev should work with zero', (t: Object) => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    let expectedParcelData = {
        value: [3,2,1],
        child: [
            {key:"#c"},
            {key:"#b"},
            {key:"#a"}
        ]
    };


    t.deepEqual(expectedParcelData, swapPrev(0)(parcelData));
});

test('swapPrev should do nothing if given non existent key', (t: Object) => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    t.deepEqual(parcelData, swapPrev("#z")(parcelData));
});
