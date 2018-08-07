// @flow
import unshift from '../unshift';

test('unshift should work', () => {
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


    expect(expectedParcelData).toEqual(unshift({value: 4})(parcelData));
});
