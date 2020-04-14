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

    let modifyUp = jest.fn(({value}) => ({value: value * 2}));

    let newParcel = parcel.pipe(pipeWithFakePrevParcel(
        fakePrevParcel,
        parcel => parcel.modifyUp(modifyUp)
    ));

    let {value, changeRequest} = modifyUp.mock.calls[0][0];

    expect(newParcel.value).toBe(246);
    expect(value).toBe(123);
    expect(changeRequest.prevData.value).toBe(100);
    expect(changeRequest.nextData.value).toBe(123);
});
