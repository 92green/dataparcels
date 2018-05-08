// @flow
import test from 'ava';
import Parcel from '../Parcel';

const handleChange = ii => {};

test('Parcel should addPreModifier', (tt: Object) => {
    tt.plan(4);

    var data = {
        value: 123,
        handleChange: (parcel) => {
            tt.is(parcel.id(), "~mv", "id() of handleChange parcel proves that preModifier have been applied already");
            tt.is(parcel.value(), 457, "handleChange parcel value proves that modifier has been applied");
        }
    };

    let parcel = new Parcel(data)
        .addPreModifier((parcel) => parcel.modifyValue(ii => ii + 1));

    tt.is("~mv", parcel.id(), "id() of constructed parcel proves that preModifier have been applied already");
    tt.is(124, parcel.value(), "constructed parcel value proves that modifier has been applied");
    parcel.onChange(456);
});
