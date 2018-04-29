// @flow

import type Parcel from '../parcel/Parcel';

import filter from 'unmutable/lib/filter';
import push from 'unmutable/lib/push';
import reduce from 'unmutable/lib/reduce';
import pipeWith from 'unmutable/lib/util/pipeWith';

type Modifier = {
    glob?: string,
    modifier: Function
};

export default class Modifiers {

    _modifiers: Modifier[];

    constructor(modifiers: Modifier[] = []) {
        this._modifiers = modifiers;
    }

    add: Function = (modifier: Function, glob: ?string): Modifiers => {
        return pipeWith(
            this._modifiers,
            push({
                glob,
                modifier
            }),
            ii => new Modifiers(ii)
        );
    };

    applyTo: Function = (parcel: Parcel): Parcel => {
        return pipeWith(
            this._modifiers,
            filter(modifier => !modifier.glob || true), // TODO - add glob matching
            reduce(
                (parcel, modifier) => modifier(parcel),
                parcel
            )
        );
    }
}
