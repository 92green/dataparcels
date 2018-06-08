// @flow
import type Parcel from 'parcels';
import identity from 'unmutable/lib/identity';
import pipe from 'unmutable/lib/util/pipe';

import SubmitModifier from './SubmitModifier';
import TouchedModifier from './TouchedModifier';
import DirtyModifier from './DirtyModifier';
import ValidModifier from './ValidModifier';

type ValidModifierConfig = (parcel: Parcel) => Object; // TODO - move to types file

type ParcelsPluginFormConfig = {
    onSubmit?: Function,
    onError?: Function,
    validators?: ValidModifierConfig
};

export default (config: ParcelsPluginFormConfig = {}): Function => {
    let {
        onSubmit,
        onError,
        validators
    } = config;

    return pipe(
        SubmitModifier({onSubmit, onError}),
        TouchedModifier(),
        DirtyModifier(),
        validators ? ValidModifier(validators) : identity()
    );
};
