// @flow
import type {
    ModifierFunction,
    ModifierObject
} from '../types/Types';
import type Parcel from '../parcel/Parcel';

import filter from 'unmutable/lib/filter';
import map from 'unmutable/lib/map';
import push from 'unmutable/lib/push';
import reduce from 'unmutable/lib/reduce';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default class Modifiers {

    _modifiers: Array<ModifierObject>;

    constructor(modifiers: Array<ModifierFunction|ModifierObject> = []) {
        this._modifiers = modifiers;
    }

    toModifierFunction: Function = (modifier: ModifierFunction|ModifierObject): ModifierFunction => {
        return typeof modifier === "function" ? modifier : modifier.modifier;
    };

    toModifierObject: Function = (modifier: ModifierFunction|ModifierObject): ModifierObject => {
        return typeof modifier === "function" ? {modifier} : modifier;
    };

    add: Function = (modifier: ModifierFunction|ModifierObject): Modifiers => {
        // TODO - add validation
        return pipeWith(
            this._modifiers,
            push(this.toModifierObject(modifier)),
            ii => new Modifiers(ii)
        );
    };

    applyTo: Function = (parcel: Parcel): Parcel => {
        return pipeWith(
            this._modifiers,
            filter(modifier => !modifier.glob || true), // TODO - add glob matching
            reduce(
                (parcel, modifier) => modifier.modifier(parcel),
                parcel
            )
        );
    }

    isEmpty: Function = (): boolean => {
        return this._modifiers.length === 0;
    };

    set: Function = (modifiers: Array<ModifierFunction|ModifierObject>): Modifiers => {
        // TODO - add validation
        return pipeWith(
            modifiers,
            map(this.toModifierObject),
            ii => new Modifiers(ii)
        );
    };
}
