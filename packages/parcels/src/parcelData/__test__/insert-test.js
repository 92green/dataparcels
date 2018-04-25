// @flow
import test from 'ava';
import insert from '../insert';

test('insert should work', (tt: Object) => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    let expectedParcelData = {
        value: [1,4,2,3],
        child: [
            {key:"#a"},
            {key:"#d"},
            {key:"#b"},
            {key:"#c"}
        ]
    };


    tt.deepEqual(expectedParcelData, insert(1, {value: 4})(parcelData));
});

test('insert should work with hashKey', (tt: Object) => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    let expectedParcelData = {
        value: [1,4,2,3],
        child: [
            {key:"#a"},
            {key:"#d"},
            {key:"#b"},
            {key:"#c"}
        ]
    };


    tt.deepEqual(expectedParcelData, insert("#b", {value: 4})(parcelData));
});
