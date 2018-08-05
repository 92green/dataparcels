// @flow
import pop from '../pop';

test('pop should work', () => {
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

    expect(expectedParcelData).toEqual(pop()(parcelData));
});
