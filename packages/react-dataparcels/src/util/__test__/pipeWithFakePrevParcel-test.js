// @flow
import Parcel from 'dataparcels';
import pipeWithFakePrevParcel from '../pipeWithFakePrevParcel';

test('pipeWithFakePrevParcel should fakely set a previous', () => {

    let parcel = new Parcel({
        value: 123
    });

    let fakePrevParcel = new Parcel({
        value: 100
    });

    let modifyUp = jest.fn(value => value * 2);

    let newParcel = parcel.pipe(pipeWithFakePrevParcel(
        fakePrevParcel,
        parcel => parcel.modifyUp(modifyUp)
    ));

    let [modifyUpValue, changeRequest] = modifyUp.mock.calls[0];

    expect(newParcel.value).toBe(246);
    expect(modifyUpValue).toBe(123);
    expect(changeRequest.prevData.value).toBe(100);
    expect(changeRequest.nextData.value).toBe(123);
});
