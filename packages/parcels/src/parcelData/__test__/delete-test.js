// @flow
import test from 'ava';
import del from '../delete';

test('delete should work by index', (t: Object) => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    let expectedParcelData = {
        value: [1,3],
        child: [
            {key:"#a"},
            {key:"#c"}
        ]
    };

    t.deepEqual(expectedParcelData, del(1)(parcelData));
});


test('delete should work by key', (t: Object) => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    let expectedParcelData = {
        value: [1,3],
        child: [
            {key:"#a"},
            {key:"#c"}
        ]
    };

    t.deepEqual(expectedParcelData, del("#b")(parcelData));
});

test('delete should work by non-existent key', (t: Object) => {
    let parcelData = {
        value: [1,3],
        child: [
            {key:"#a"},
            {key:"#c"}
        ]
    };

    t.deepEqual(parcelData, del("#b")(parcelData));
});
