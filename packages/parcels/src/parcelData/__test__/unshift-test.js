// @flow
import test from 'ava';
import unshift from '../unshift';

test('unshift should work', t => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    let expectedParcelData = {
        value: [4,1,2,3],
        child: [
            {key:"#d"},
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };


    t.deepEqual(expectedParcelData, unshift({value: 4})(parcelData));
});
