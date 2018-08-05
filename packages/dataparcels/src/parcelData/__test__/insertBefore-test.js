// @flow
import insertBefore from '../insertBefore';

test('insertBefore should work', () => {
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

    expect(expectedParcelData).toEqual(insertBefore(1, {value: 4})(parcelData));
    expect(expectedParcelData).toEqual(insertBefore(-2, {value: 4})(parcelData));
    expect(expectedParcelData).toEqual(insertBefore(4, {value: 4})(parcelData));
    expect(expectedParcelData).toEqual(insertBefore(-5, {value: 4})(parcelData));
});

test('insertBefore should work with hashKey', () => {
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


    expect(expectedParcelData).toEqual(insertBefore("#b", {value: 4})(parcelData));
});

test('insertBefore should do nothing with non-existent hashKey', () => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    expect(parcelData).toEqual(insertBefore("#z", {value: 4})(parcelData));
});
