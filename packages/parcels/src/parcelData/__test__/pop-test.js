// @flow
import test from 'ava';
import pop from '../pop';

test('pop should work', (tt: Object) => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    let expectedParcelData = {
        value: [1,2],
        child: [
            {key:"#a"},
            {key:"#b"}
        ]
    };

    tt.deepEqual(expectedParcelData, pop()(parcelData));
});
