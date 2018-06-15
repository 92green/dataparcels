// @flow
import escapeStringRegexp from 'escape-string-regexp';

import doIf from 'unmutable/lib/doIf';
import join from 'unmutable/lib/join';
import keyArray from 'unmutable/lib/keyArray';
import map from 'unmutable/lib/map';
import sort from 'unmutable/lib/sort';
import pipe from 'unmutable/lib/util/pipe';
import pipeWith from 'unmutable/lib/util/pipeWith';

export const split = (match: string): string[] => pipeWith(
    match,
    escapeSplitChars,
    ii => ii.split("."),
    map(unescapeSplitChars)
);

export const containsWildcard = (match: string): boolean => pipeWith(
    match,
    escapeSplitChars,
    ii => ii.replace(/\*\*/g, "").indexOf("*") !== -1
);

export const containsGlobstar = (match: string): boolean => pipeWith(
    match,
    escapeSplitChars,
    ii => ii.indexOf("**") !== -1
);

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

const SPLIT_CHARS = [".", ":", "|", "*"];
const REGEX_SPLIT_CHARS = SPLIT_CHARS.map(escapeStringRegexp);

const addImpliedCarat = doIf(
    ii => ii[0] !== "^" && `${ii[0]}${ii[1]}` !== "**",
    ii => `^.${ii}`
);

const escapeSplitChars = pipe(
    ...pipeWith(
        REGEX_SPLIT_CHARS,
        map((chr: string, index: number): Function => {
            return str => str.replace(new RegExp(`%${chr}`, "g"), `%${index}`);
        })
    )
);

const unescapeSplitChars = pipe(
    ...pipeWith(
        SPLIT_CHARS,
        map((chr: string, index: number): Function => {
            return str => str.replace(new RegExp(`%${index}`, "g"), `%${chr}`);
        })
    )
);

const regexifyGlobstars = str => str.replace(/\\\*\\\*/g, ".*?");
const regexifyWildcards = str => str.replace(/\\\*/g, "[^^.]*?");

const regexifyPart = (part: string): string => {
    let [name, type] = part.split(":");

    // if no type, match any type selector
    if(!type) {
        return `${name}:[^^.]*?`;
    }

    // split types apart and replace with type selectors
    let types = pipeWith(
        type.split('\\|'),
        sort(),
        map((tt: string): string => {
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
        }),
        join()
    );

    return `${name}:[^^.]*?[${types}][^^.]*?`;
};

export default (typedPathString: string, match: string): boolean => {
    return pipeWith(
        match,
        addImpliedCarat,
        escapeSplitChars,
        escapeStringRegexp,
        ii => ii.split("\\."),
        map(regexifyPart),
        join("\\."),
        regexifyGlobstars,
        regexifyWildcards,
        regex => `^${regex}$`,
        (regex: string): boolean => {
            let test = escapeSplitChars(typedPathString);
            return new RegExp(regex, "g").test(test);
        }
    );
};
