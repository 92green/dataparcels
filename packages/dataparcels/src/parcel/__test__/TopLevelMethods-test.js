// @flow
import Parcel from '../Parcel';

test('Parcel.batchAndReturn() should batch actions and return parcel', () => {
    let handleChange = jest.fn();
    let newParcel = new Parcel({
        value: {
            abc: 123,
            def: 456
        },
        handleChange
    }).batchAndReturn((parcel) => {
        parcel.get('abc').onChange(789);
    });

    expect(newParcel.value).toEqual({
        abc: 789,
        def: 456
    });

    expect(handleChange).toHaveBeenCalledTimes(0);
});
