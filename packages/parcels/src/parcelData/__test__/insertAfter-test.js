// @flow
import test from 'ava';
import insertAfter from '../insertAfter';

test('insertAfter should work', (tt: Object) => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    let expectedParcelData = {
        value: [1,2,4,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#d"},
            {key:"#c"}
        ]
    };


    tt.deepEqual(expectedParcelData, insertAfter(1, {value: 4})(parcelData));
});

test('insertAfter should work with hashKey', (tt: Object) => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    let expectedParcelData = {
        value: [1,2,4,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#d"},
            {key:"#c"}
        ]
    };


    tt.deepEqual(expectedParcelData, insertAfter("#b", {value: 4})(parcelData));
});
