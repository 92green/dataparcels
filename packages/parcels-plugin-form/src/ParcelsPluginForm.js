// @flow
import pipe from 'unmutable/lib/util/pipe';

import SubmitModifier from './SubmitModifier';
import TouchedModifier from './TouchedModifier';
import DirtyModifier from './DirtyModifier';
import ValidModifier from './ValidModifier';

type ParcelsPluginFormConfig = {
    onSubmit?: Function,
    validators?: Object
};

export default (config: ParcelsPluginFormConfig = {}): Function => {
    let {
        onSubmit,
        validators
    } = config;

    return pipe(
        SubmitModifier(onSubmit),
        TouchedModifier(),
        DirtyModifier(),
        ValidModifier(validators)
    );
};
