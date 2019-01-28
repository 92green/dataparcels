// @flow
import Parcel from '../Parcel';

test('Parcel.dispatch() should pass handleChange to newly created parcel', () => {
    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: 123,
        handleChange
    });

    parcel.onChange(456);

    let [newParcel, changeRequest] = handleChange.mock.calls[0];

    expect(newParcel.value).toBe(456);
    expect(changeRequest.nextData.value).toBe(456);
    expect(changeRequest.prevData.value).toBe(123);

    newParcel.onChange(789);

    let [newParcel2, changeRequest2] = handleChange.mock.calls[1];

    expect(newParcel2.value).toBe(789);
    expect(changeRequest2.nextData.value).toBe(789);
    expect(changeRequest2.prevData.value).toBe(456);
});
