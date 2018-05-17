// // @flow
// import type {
//     ModifierFunction,
//     ModifierObject
// } from '../types/Types';
// import type Parcel from '../parcel/Parcel';

// import minimatch from 'minimatch';

import escapeStringRegexp from 'escape-string-regexp';

import join from 'unmutable/lib/join';
import keyArray from 'unmutable/lib/keyArray';
import log from 'unmutable/lib/log';
import map from 'unmutable/lib/map';

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
    ["!Parent"]: "p",
    ["TopLevel"]: "T",
    ["!TopLevel"]: "t"
};

const SPLIT_CHARS = ["\\.", ":", "\\|", "%\\*"];

const escapeSplitChars = pipe(
    ...pipeWith(
        SPLIT_CHARS,
        map((chr: string, index: number): Function => {
            return str => str.replace(new RegExp(`%${chr}`, "g"), `%${index}`);
        })
    )
);

const regexifyGlobstars = str => str.replace(/\\\*\\\*/g, ".*?");
const regexifyWildcards = str => str.replace(/\\\*/g, "[^^.]*?");

const regexifyPart = (part: string): string => {
    let [name, type] = part.split(":");

    // if no type, match any type selector
    if(!type) {
        return `${name}:*`;
    }

    // split types apart and replace with type selectors
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
                let choices = pipeWith(
                    TYPE_SELECTORS,
                    keyArray(),
                    join(", ")
                );
                throw new Error(`"${tt}" is not a valid type selector. Choose one of ${choices}`);
            }
            return typeSelector;
        })
        .join("*");

    return `${name}:*${types}*`;
};

export default (typedPathString: string, match: string): boolean => {
    return pipeWith(
        match,
        log("1"),
        escapeSplitChars,
        log("2"),
        ii => ii.split("."),
        map(regexifyPart),
        log("3"),
        join("."),
        escapeStringRegexp,
        log("4"),
        regexifyGlobstars,
        regexifyWildcards,
        regex => `^${regex}$`,
        log("regex"),
        (regex: string): boolean => {
            let test = escapeSplitChars(typedPathString);
            return new RegExp(regex, "g").test(test);
        }
    );
};

// const TYPE_SELECTORS = {
//     ["Child"]: "C",
//     ["!Child"]: "c",
//     ["Element"]: "E",
//     ["!Element"]: "e",
//     ["Indexed"]: "I",
//     ["!Indexed"]: "i",
//     ["Parent"]: "P",
//     ["!Parent"]: "p",
//     ["TopLevel"]: "T",
//     ["!TopLevel"]: "t"
// };

// export default class Modifiers {

//     _modifiers: Array<ModifierObject>;
//     _processedModifiers: Array<ModifierObject>;

//     constructor(modifiers: Array<ModifierFunction|ModifierObject> = []) {
//         this._modifiers = this._processedModifiers = pipeWith(
//             modifiers,
//             map(this.toModifierObject)
//         );

//         this._processedModifiers = pipeWith(
//             this._modifiers,
//             map(update('match', this._processMatch))
//         );
//     }

//     _processMatch: Function = (match: string): ?string => {
//         if(!match) {
//             return undefined;
//         }
//         return match
//             .split('.')
//             .map((part: string): string => {
//                 let [name, type] = part.split(':');
//                 // dont allow types on globstar
//                 if(name === "**") {
//                     return name;
//                 }
//                 // if no type, match any type selector
//                 if(!type) {
//                     return `${name}:*`;
//                 }
//                 // split types apart and replace with type selectors
//                 let types = type
//                     .split('|')
//                     .sort((a: string, b: string): number => {
//                         if (a < b) return -1;
//                         else if (a > b) return 1;
//                         return 0;
//                     })
//                     .map((tt: string): string => {
//                         let typeSelector = TYPE_SELECTORS[tt];
//                         if(!typeSelector) {
//                             let choices = pipeWith(
//                                 TYPE_SELECTORS,
//                                 keyArray(),
//                                 join(", ")
//                             );
//                             throw new Error(`"${tt}" is not a valid type selector. Choose one of ${choices}`);
//                         }
//                         return typeSelector;
//                     })
//                     .join("*");

//                 return `${name}:*${types}*`;
//             })
//             .join('.');
//     };

//     toModifierObject: Function = (modifier: ModifierFunction|ModifierObject): ModifierObject => {
//         return typeof modifier === "function" ? {modifier} : modifier;
//     };

//     add: Function = (modifier: ModifierFunction|ModifierObject): Modifiers => {
//         // TODO - add validation
//         return pipeWith(
//             this._modifiers,
//             push(this.toModifierObject(modifier)),
//             ii => new Modifiers(ii)
//         );
//     };

//     applyTo: Function = (parcel: Parcel): Parcel => {
//         let typedPathString = parcel._typedPathString();
//         return pipeWith(
//             this._processedModifiers,
//             filter(({match}: Object): boolean => {
//                 return !match || minimatch(typedPathString.replace(/\./g, "/"), match.replace(/\./g, "/"));
//             }),
//             reduce(
//                 (parcel, modifier) => modifier.modifier(parcel),
//                 parcel
//             )
//         );
//     }

//     isEmpty: Function = (): boolean => {
//         return this._modifiers.length === 0;
//     };

//     set: Function = (modifiers: Array<ModifierFunction|ModifierObject>): Modifiers => {
//         // TODO - add validation
//         return pipeWith(
//             modifiers,
//             map(this.toModifierObject),
//             ii => new Modifiers(ii)
//         );
//     };

//     toJS: Function = (): Array<ModifierObject> => {
//         return this._modifiers;
//     }
// }
