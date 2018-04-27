// @flow
import test from 'ava';
import Parcel from '../Parcel';

const handleChange = ii => {};

test('Parcel.key() should return the Parcels key', (tt: Object) => {
    var data = {
        value: 123,
        handleChange
    };
    tt.is(new Parcel(data, {id: "#a", key: "#a"}).key(), "#a");
});

test('Parcel.id() should return the Parcels id', (tt: Object) => {
    var data = {
        value: {
            a: [1,2,3]
        },
        handleChange
    };
    tt.is(new Parcel(data).id(), "^");
    tt.is(new Parcel(data).get("a").id(), "^.a"); // TODO WRONG
    tt.is(new Parcel(data).getIn(["a",0]).id(), "^.a.#a"); // TODO WRONG
    //tt.is(new Parcel(data).get("a").modifyValue(ii => ii).get(1).id(), "^.a.&uv&.#b"); // TODO WRONG
});

test('Parcel.pathId() should return the Parcels path id', (tt: Object) => {
    var data = {
        value: {
            a: [1,2,3]
        },
        handleChange
    };
    tt.is(new Parcel(data).pathId(), "^");
    tt.is(new Parcel(data).get("a").pathId(), "^.a"); // TODO WRONG
    tt.is(new Parcel(data).getIn(["a",0]).pathId(), "^.a.#a"); // TODO WRONG
    //tt.is(new Parcel(data).get("a").modifyValue(ii => ii).get(1).pathId(), "^.a.#b"); // TODO WRONG
});