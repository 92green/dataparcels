// @flow
import type {ParcelValueUpdater} from 'dataparcels';

import Parcel from 'dataparcels';
import createUpdater from 'dataparcels/createUpdater';
import useBuffer from './useBuffer';

// $FlowFixMe - useState is a named export of react
import {useState} from 'react';

const noop = () => {};

type Params = {
    source?: ParcelValueUpdater,
    dependencies?: any[],
    onChange?: ParcelValueUpdater,
    derive?: ParcelValueUpdater,
    buffer?: boolean|number,
    deriveSource?: ParcelValueUpdater
};

export default (params: Params): Parcel => {

    // params

    let {
        source = noop,
        dependencies = [],
        onChange = noop,
        derive = noop,
        buffer = false,
        deriveSource = noop
    } = params;

    if(buffer === false) {
        deriveSource = derive;
    }

    // source

    let [parcel, setParcel] = useState(() => {
        let parcel = new Parcel({
            handleChange: (parcel: Parcel) => {
                setParcel(parcel);
            }
        });

        return parcel._changeAndReturn(
            parcel => parcel
                .modifyUp(createUpdater(source, deriveSource))
                .update(noop)
            // ^ replace with parcel.update(source) once update() can return {effect}
        )[0];
    });

    // dependencies

    let [prevDeps, setPrevDeps] = useState(dependencies);

    if(dependencies.some((dep, index) => !Object.is(dep, prevDeps[index]))) {
        setPrevDeps(dependencies);
        parcel
            .modifyUp(createUpdater(source, deriveSource))
            .update(noop);
        // ^ replace with parcel.update(source) once update() can return {effect}
    }

    // onChange

    let preparedParcel = parcel.modifyUp(createUpdater(deriveSource, onChange));

    // buffer

    if(buffer === false) {
        return preparedParcel;
    }

    let bufferedParcel = useBuffer({
        source: preparedParcel,
        buffer,
        derive
    });

    return bufferedParcel;
};
