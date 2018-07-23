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

    tt.deepEqual(expectedParcelData, insertBefore(1, {value: 4})(parcelData), 'should work with in range number');
    tt.deepEqual(expectedParcelData, insertBefore(-2, {value: 4})(parcelData), 'should work with in negative number');
    tt.deepEqual(expectedParcelData, insertBefore(4, {value: 4})(parcelData), 'should work with positive wrapped number');
    tt.deepEqual(expectedParcelData, insertBefore(-5, {value: 4})(parcelData), 'should work with negative wrapped number');
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

test('insertBefore should do nothing with non-existent hashKey', (tt: Object) => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    tt.deepEqual(parcelData, insertBefore("#z", {value: 4})(parcelData));
});
