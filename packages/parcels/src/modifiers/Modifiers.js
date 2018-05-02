// @flow
import type {
    ModifierFunction,
    ModifierObject
} from '../types/Types';
import type Parcel from '../parcel/Parcel';

import micromatch from 'micromatch';

import filter from 'unmutable/lib/filter';
import map from 'unmutable/lib/map';
import push from 'unmutable/lib/push';
import reduce from 'unmutable/lib/reduce';
import update from 'unmutable/lib/update';
import pipe from 'unmutable/lib/util/pipe';
import pipeWith from 'unmutable/lib/util/pipeWith';

const TYPE_SELECTORS = {
    ["Child"]: "C",
    ["!Child"]: "c",
    ["Element"]: "E",
    ["!Element"]: "e",
    ["Indexed"]: "I",
    ["!Indexed"]: "i",
    ["Parent"]: "P",
    ["!Parent"]: "p"
};

export default class Modifiers {

    _modifiers: Array<ModifierObject>;

    constructor(modifiers: Array<ModifierFunction|ModifierObject> = []) {
        this._modifiers = pipeWith(
            modifiers,
            map(pipe(
                this.toModifierObject,
                update('match', this._processGlob)
            ))
        );
    }

    _processGlob: Function = (match: string): ?string => {
        if(!match) {
            return undefined;
        }
        return match
            .split('/')
            .map((part: string): string => {
                let [name, type] = part.split(':');
                if(name === "**") {
                    return name;
                }
                if(!type) {
                    return `${name}:*`;
                }
                let types = type
                    .split('|')
                    .sort((a: string, b: string): number => {
                        if (a < b) return -1;
                        else if (a > b) return 1;
                        return 0;
                    })
                    .map((tt: string): string => {
                        let typeSelector = TYPE_SELECTORS[tt];
                        if(!typeSelector) {
                            throw new Error(`"${tt}" is not a valid type selector. Choose one of ${typeSelector.join(", ")}`);
                        }
                        return typeSelector;
                    })
                    .join("*");

                return `${name}:*${types}*`;
            })
            .join('/');
    };

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
        let typedPathString = parcel._typedPathString();
        return pipeWith(
            this._modifiers,
            filter(({match}) => !match || micromatch.isMatch(typedPathString, match)),
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
