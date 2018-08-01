// @flow
import test from 'ava';
import swap from '../swap';

test('swap should work', t => {
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


    t.deepEqual(expectedParcelData, swap(1,2)(parcelData));
});

test('swap should work with hashKeys', t => {
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

    t.deepEqual(expectedParcelData, swap("#b","#c")(parcelData));
});

test('swap should do nothing with non existent hashKeys', t => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    t.deepEqual(parcelData, swap("#z","#c")(parcelData));
    t.deepEqual(parcelData, swap("#a","#z")(parcelData));
});
