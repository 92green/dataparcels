// @flow
import test from 'ava';
import swapNext from '../swapNext';

test('swapNext should work with indexes', (tt: Object) => {
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

    tt.deepEqual(expectedParcelData, swapNext(1)(parcelData), 'should work with in range number');
    tt.deepEqual(expectedParcelData, swapNext(-2)(parcelData), 'should work with negative');
    tt.deepEqual(expectedParcelData, swapNext(4)(parcelData), 'should work with positive wrapped number');
    tt.deepEqual(expectedParcelData, swapNext(-5)(parcelData), 'should work with negative wrapped number');
});

test('swapNext should work with hashKeys', (tt: Object) => {
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

    tt.deepEqual(expectedParcelData, swapNext("#b")(parcelData));
});

test('swapNext should work with length - 1', (tt: Object) => {
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


    tt.deepEqual(expectedParcelData, swapNext(2)(parcelData));
});

test('swapNext should do nothing if given non existent key', (tt: Object) => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    tt.deepEqual(parcelData, swapNext("#z")(parcelData));
});
