// @flow
import type {ParcelValueUpdater} from 'dataparcels';

import Parcel from 'dataparcels';

// $FlowFixMe - useState is a named export of react
import {useState} from 'react';

const noop = () => {};

type Params = {
    source?: ParcelValueUpdater,
    dependencies?: any[]
};

export default (params: Params): Parcel => {

    // params

    let {
        source = noop,
        dependencies = []
    } = params;

    // source

    let [parcel, setParcel] = useState(() => {
        let parcel = new Parcel({
            handleChange: (parcel: Parcel) => {
                setParcel(parcel);
            }
        });

        return parcel._changeAndReturn(
            parcel => parcel
                .modifyUp(source)
                .update(noop)
            // ^ replace with parcel.update(source) once update() can return {effect}
        )[0];
    });

    // dependencies

    let [prevDeps, setPrevDeps] = useState(dependencies);

    if(dependencies.some((dep, index) => !Object.is(dep, prevDeps[index]))) {
        setPrevDeps(dependencies);
        parcel
            .modifyUp(source)
            .update(noop);
        // ^ replace with parcel.update(source) once update() can return {effect}
    }

    // return

    return parcel;
};
