// @flow
import test from 'ava';
import swapNext from '../swapNext';

test('swapNext should work with indexes', t => {
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

    t.deepEqual(expectedParcelData, swapNext(1)(parcelData), 'should work with in range number');
    t.deepEqual(expectedParcelData, swapNext(-2)(parcelData), 'should work with negative');
    t.deepEqual(expectedParcelData, swapNext(4)(parcelData), 'should work with positive wrapped number');
    t.deepEqual(expectedParcelData, swapNext(-5)(parcelData), 'should work with negative wrapped number');
});

test('swapNext should work with hashKeys', t => {
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

    t.deepEqual(expectedParcelData, swapNext("#b")(parcelData));
});

test('swapNext should work with length - 1', t => {
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


    t.deepEqual(expectedParcelData, swapNext(2)(parcelData));
});

test('swapNext should do nothing if given non existent key', t => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    t.deepEqual(parcelData, swapNext("#z")(parcelData));
});
