// @flow
import test from 'ava';
import pop from '../pop';

test('pop should work', (t: Object) => {
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

    t.deepEqual(expectedParcelData, pop()(parcelData));
});
