// @flow
import ParcelShape from '../ParcelShape';

test('ParcelShapes insertAfter(key, value) should work', () => {
    let staticParcel = ParcelShape.fromData({
        value: [0,1,2]
    });

    expect(staticParcel.insertAfter(0, 3).data.value).toEqual([0,3,1,2]);
});

test('ParcelShapes insertBefore(key, value) should work', () => {
    let staticParcel = ParcelShape.fromData({
        value: [0,1,2]
    });

    expect(staticParcel.insertBefore(0, 3).data.value).toEqual([3,0,1,2]);
});

test('ParcelShapes push(value) should work', () => {
    let staticParcel = ParcelShape.fromData({
        value: [0,1,2]
    });

    expect(staticParcel.push(3,4).data.value).toEqual([0,1,2,3,4]);
});

test('ParcelShapes pop() should work', () => {
    let staticParcel = ParcelShape.fromData({
        value: [0,1,2]
    });

    expect(staticParcel.pop().data.value).toEqual([0,1]);
});

test('ParcelShapes shift() should work', () => {
    let staticParcel = ParcelShape.fromData({
        value: [0,1,2]
    });

    expect(staticParcel.shift().data.value).toEqual([1,2]);
});

test('ParcelShapes unshift(value) should work', () => {
    let staticParcel = ParcelShape.fromData({
        value: [0,1,2]
    });

    expect(staticParcel.unshift(3,4).data.value).toEqual([3,4,0,1,2]);
});
