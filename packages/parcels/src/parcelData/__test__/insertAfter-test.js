// @flow
import insertAfter from '../insertAfter';

test('insertAfter should work', () => {
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

    expect(expectedParcelData).toEqual(insertAfter(1, {value: 4})(parcelData));
    expect(expectedParcelData).toEqual(insertAfter(-2, {value: 4})(parcelData));
    expect(expectedParcelData).toEqual(insertAfter(4, {value: 4})(parcelData));
    expect(expectedParcelData).toEqual(insertAfter(-5, {value: 4})(parcelData));
});

test('insertAfter should work with hashKey', () => {
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


    expect(expectedParcelData).toEqual(insertAfter("#b", {value: 4})(parcelData));
});


test('insertAfter should do nothing with non-existent hashKey', () => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    expect(parcelData).toEqual(insertAfter("#z", {value: 4})(parcelData));
});
