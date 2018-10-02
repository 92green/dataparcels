// @flow
import escapeStringRegexp from 'escape-string-regexp';

import join from 'unmutable/lib/join';
import keyArray from 'unmutable/lib/keyArray';
import map from 'unmutable/lib/map';
import skip from 'unmutable/lib/skip';
import pipe from 'unmutable/lib/util/pipe';
import pipeWith from 'unmutable/lib/util/pipeWith';

export const split = (match: string): string[] => pipeWith(
    match,
    escapeSpecialChars,
    ii => ii.split("."),
    map(unescapeSpecialChars)
);

export const containsWildcard = (match: string): boolean => pipeWith(
    match,
    escapeSpecialChars,
    ii => ii.replace(/\*\*/g, "").indexOf("*") !== -1
);

export const containsGlobstar = (match: string): boolean => pipeWith(
    match,
    escapeSpecialChars,
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

const SPECIAL_CHARS = [".", ":", "|", "*"];
const REGEX_SPECIAL_CHARS = SPECIAL_CHARS.map(escapeStringRegexp);
const MATCH_ANY_IN_PART = "[^.]*?";

const escapeSpecialChars = pipe(
    ...pipeWith(
        REGEX_SPECIAL_CHARS,
        map((chr: string, index: number): Function => {
            return str => str.replace(new RegExp(`%${chr}`, "g"), `%${index}`);
        })
    )
);

const unescapeSpecialChars = pipe(
    ...pipeWith(
        SPECIAL_CHARS,
        map((chr: string, index: number): Function => {
            return str => str.replace(new RegExp(`%${index}`, "g"), `%${chr}`);
        })
    )
);

const regexifyGlobstars = str => str.replace(/\\\*\\\*/g, ".*?");
const regexifyWildcards = str => str.replace(/\\\*/g, MATCH_ANY_IN_PART);

const regexifyPart = (part: string): string => {
    let [name, type] = part.split(":");

    if(name === "") {
        name = MATCH_ANY_IN_PART;
    }

    // if no type, match any type selector
    if(!type) {
        return `${name}:${MATCH_ANY_IN_PART}`;
    }

    // replace type with type selectors
    let typeSelector = TYPE_SELECTORS[type];
    if(!typeSelector) {
        let choices = pipeWith(
            TYPE_SELECTORS,
            keyArray(),
            join(", ")
        );
        throw new Error(`"${type}" is not a valid type selector. Choose one of ${choices}`);
    }

    return `${name}:${MATCH_ANY_IN_PART}[${typeSelector}]${MATCH_ANY_IN_PART}`;
};

export default (typedPathString: string, match: string, depth: number = 0): boolean => {
    let test = escapeSpecialChars(typedPathString);
    if(depth > 0) {
        test = pipeWith(
            test,
            ii => ii.split("."),
            skip(depth),
            join(".")
        );
    }

    return escapeSpecialChars(match)
        .split("|")
        .some((escapedMatch: string): boolean => {
            if(escapedMatch[0] === ".") {
                if(escapedMatch.length === 1 || escapedMatch[1] === ":") {
                    escapedMatch = escapedMatch.slice(1);
                }
                escapedMatch = `*${escapedMatch}`;
            }

            return pipeWith(
                escapedMatch,
                escapeStringRegexp,
                ii => ii.split("\\."),
                map(regexifyPart),
                join("\\."),
                regexifyGlobstars,
                regexifyWildcards,
                regex => `^${regex}$`,
                (regex) => new RegExp(regex, "g").test(test)
            );
        });
};
