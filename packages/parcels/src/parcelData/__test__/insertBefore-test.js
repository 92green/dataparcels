// @flow
import test from 'ava';
import insertBefore from '../insertBefore';

test('insertBefore should work', (tt: Object) => {
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


    tt.deepEqual(expectedParcelData, insertBefore(1, {value: 4})(parcelData));
});

test('insertBefore should work with hashKey', (tt: Object) => {
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


    tt.deepEqual(expectedParcelData, insertBefore("#b", {value: 4})(parcelData));
});
