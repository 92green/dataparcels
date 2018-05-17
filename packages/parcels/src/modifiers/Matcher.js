// @flow
import escapeStringRegexp from 'escape-string-regexp';

import join from 'unmutable/lib/join';
import keyArray from 'unmutable/lib/keyArray';
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
        escapeSplitChars,
        ii => ii.split("."),
        map(regexifyPart),
        join("."),
        escapeStringRegexp,
        regexifyGlobstars,
        regexifyWildcards,
        regex => `^${regex}$`,
        (regex: string): boolean => {
            let test = escapeSplitChars(typedPathString);
            return new RegExp(regex, "g").test(test);
        }
    );
};