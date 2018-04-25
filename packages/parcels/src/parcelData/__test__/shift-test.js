// @flow
import test from 'ava';
import shift from '../shift';

test('shift should work', (tt: Object) => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    let expectedParcelData = {
        value: [2,3],
        child: [
            {key:"#b"},
            {key:"#c"}
        ]
    };

    tt.deepEqual(expectedParcelData, shift()(parcelData));
});
