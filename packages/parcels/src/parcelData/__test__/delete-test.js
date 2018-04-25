// @flow
import test from 'ava';
import del from '../delete';

test('delete should work', (tt: Object) => {
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

    tt.deepEqual(expectedParcelData, del(1)(parcelData));
});
