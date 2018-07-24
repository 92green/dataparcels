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

    tt.deepEqual(expectedParcelData, insertAfter(1, {value: 4})(parcelData), 'should work with in range number');
    tt.deepEqual(expectedParcelData, insertAfter(-2, {value: 4})(parcelData), 'should work with in negative number');
    tt.deepEqual(expectedParcelData, insertAfter(4, {value: 4})(parcelData), 'should work with positive wrapped number');
    tt.deepEqual(expectedParcelData, insertAfter(-5, {value: 4})(parcelData), 'should work with negative wrapped number');
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


test('insertAfter should do nothing with non-existent hashKey', (tt: Object) => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    tt.deepEqual(parcelData, insertAfter("#z", {value: 4})(parcelData));
});
