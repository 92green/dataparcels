// @flow
import type {
    ModifierFunction,
    ModifierObject
} from '../types/Types';
import type Parcel from '../parcel/Parcel';
import Matcher from './Matcher';

import filter from 'unmutable/lib/filter';
import map from 'unmutable/lib/map';
import push from 'unmutable/lib/push';
import reduce from 'unmutable/lib/reduce';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default class Modifiers {

    _modifiers: Array<ModifierObject>;

    constructor(modifiers: Array<ModifierFunction|ModifierObject> = []) {
        this._modifiers = pipeWith(
            modifiers,
            map(this.toModifierObject)
        );
    }

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
        let typedPathString = parcel._typedPathString();
        return pipeWith(
            this._modifiers,
            filter(({match}: Object): boolean => {
                return !match || Matcher(typedPathString, match);
            }),
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

    toJS: Function = (): Array<ModifierObject> => {
        return this._modifiers;
    }
}
