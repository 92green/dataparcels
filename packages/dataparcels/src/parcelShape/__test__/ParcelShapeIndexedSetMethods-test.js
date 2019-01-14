// @flow
import ParcelShape from '../ParcelShape';

test('ParcelShapes insertAfter(key, value) should work', () => {
    let parcelShape = ParcelShape.fromData({
        value: [0,1,2]
    });

    expect(parcelShape.insertAfter(0, 3).data.value).toEqual([0,3,1,2]);
});

test('ParcelShapes insertBefore(key, value) should work', () => {
    let parcelShape = ParcelShape.fromData({
        value: [0,1,2]
    });

    expect(parcelShape.insertBefore(0, 3).data.value).toEqual([3,0,1,2]);
});

test('ParcelShapes push(value) should work', () => {
    let parcelShape = ParcelShape.fromData({
        value: [0,1,2]
    });

    expect(parcelShape.push(3).data.value).toEqual([0,1,2,3]);
});

test('ParcelShapes pop() should work', () => {
    let parcelShape = ParcelShape.fromData({
        value: [0,1,2]
    });

    expect(parcelShape.pop().data.value).toEqual([0,1]);
});

test('ParcelShapes shift() should work', () => {
    let parcelShape = ParcelShape.fromData({
        value: [0,1,2]
    });

    expect(parcelShape.shift().data.value).toEqual([1,2]);
});

test('ParcelShapes swap() should work', () => {
    let parcelShape = ParcelShape.fromData({
        value: [0,1,2]
    });

    expect(parcelShape.swap(0,2).data.value).toEqual([2,1,0]);
});

test('ParcelShapes swapNext() should work', () => {
    let parcelShape = ParcelShape.fromData({
        value: [0,1,2]
    });

    expect(parcelShape.swapNext(1).data.value).toEqual([0,2,1]);
});

test('ParcelShapes swapPrev() should work', () => {
    let parcelShape = ParcelShape.fromData({
        value: [0,1,2]
    });

    expect(parcelShape.swapPrev(1).data.value).toEqual([1,0,2]);
});

test('ParcelShapes unshift(value) should work', () => {
    let parcelShape = ParcelShape.fromData({
        value: [0,1,2]
    });

    expect(parcelShape.unshift(3).data.value).toEqual([3,0,1,2]);
});
