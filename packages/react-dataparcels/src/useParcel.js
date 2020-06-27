// @flow
import type {ParcelValueUpdater} from 'dataparcels';
import type {Type} from 'dataparcels/src/types/Types';

import Parcel from 'dataparcels';
import combine from 'dataparcels/combine';
import useBuffer from './useBuffer';

// $FlowFixMe - useState is a named export of react
import {useState} from 'react';
// $FlowFixMe - useState is a named export of react
import {useRef} from 'react';

const noop = () => {};

type Params = {
    source?: ParcelValueUpdater,
    dependencies?: any[],
    onChange?: ParcelValueUpdater,
    derive?: ParcelValueUpdater,
    buffer?: boolean|number,
    history?: number,
    deriveSource?: ParcelValueUpdater,
    types?: (types: Type[]) => Type[]
};

export default (params: Params): Parcel => {

    // params

    let {
        source = noop,
        dependencies = [],
        onChange = noop,
        derive = noop,
        buffer = false,
        history = 0,
        deriveSource = noop,
        types
    } = params;

    if(buffer === false) {
        deriveSource = derive;
    }

    // source

    let frameRef = useRef(1);

    let [parcel, setParcel] = useState(() => {
        let parcel = new Parcel({
            handleChange: (parcel: Parcel) => {
                frameRef.current++;
                parcel._frameMeta.frame = frameRef.current;
                setParcel(parcel);
            },
            types
        });

        parcel._frameMeta.frame = frameRef.current;

        return parcel._changeAndReturn(
            parcel => parcel
                .modifyUp(combine(source, deriveSource))
                .update(noop)
            // ^ replace with parcel.update(source) once update() can return {effect}
        )[0];
    });

    // dependencies

    let [prevDeps, setPrevDeps] = useState(dependencies);

    if(dependencies.some((dep, index) => !Object.is(dep, prevDeps[index]))) {
        setPrevDeps(dependencies);
        parcel
            .modifyUp(combine(source, deriveSource))
            .update(noop);
        // ^ replace with parcel.update(source) once update() can return {effect}
    }

    // onChange

    let preparedParcel = parcel.modifyUp(combine(deriveSource, onChange));

    // buffer

    if(buffer === false) {
        return preparedParcel;
    }

    let bufferedParcel = useBuffer({
        source: preparedParcel,
        buffer,
        history,
        derive,
        revertKey: onChange.revertKey
    });

    return bufferedParcel;
};
