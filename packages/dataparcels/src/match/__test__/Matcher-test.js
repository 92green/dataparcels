// @flow
import Matcher, { split, containsWildcard, containsGlobstar } from '../Matcher';

import filter from 'unmutable/lib/filter';
import identity from 'unmutable/lib/identity';
import keyArray from 'unmutable/lib/keyArray';
import map from 'unmutable/lib/map';
import pipeWith from 'unmutable/lib/util/pipeWith';

//
// match
//

let typedPathStrings = {
    top: "^:ceiPT",
    childValue: "^:ceiPT.abc:Ceipt",
    childObject: "^:ceiPT.def:CeiPt",
    grandchildValue: "^:ceiPT.def:CeiPt.defkid:Ceipt",
    grandchildWithDot: "^:ceiPT.def:CeiPt.dot%.dot:Ceipt",
    greatGrandchild: "^:ceiPT.def:CeiPt.more:CeiPt.abc:Ceipt",
    childArray: "^:ceiPT.ghi:CeIPt",
    grandchildElement: "^:ceiPT.ghi:CeIPt.#a:CEipt",
    escapeChars: "^:ceiPT.jkl%.%:%|%#%,:Ceipt"
};

let matchTests = [
    {
        name: "match self",
        match: ".",
        shouldMatch: ["top"]
    },
    {
        name: "match by full name",
        match: "^",
        shouldMatch: ["top"]
    },
    {
        name: "match child by full name",
        match: ".abc",
        shouldMatch: ["childValue"]
    },
    {
        name: "match child with escape chars",
        match: ".jkl%.%:%|%#%,",
        shouldMatch: ["escapeChars"]
    },
    {
        name: "match child that doesnt exist / dont match grandchild",
        match: ".defkid",
        shouldMatch: []
    },
    {
        name: "match grandchild",
        match: ".def.defkid",
        shouldMatch: ["grandchildValue"]
    },
    {
        name: "match grandchild element",
        match: ".ghi.#a",
        shouldMatch: ["grandchildElement"]
    },
    {
        name: "match multiple",
        match: ".abc|.ghi.#a",
        shouldMatch: ["childValue", "grandchildElement"]
    },
    {
        name: "match wildcard",
        match: ".*",
        shouldMatch: ["childValue", "childObject", "childArray", "escapeChars"]
    },
    {
        name: "match wildcard start",
        match: ".*f",
        shouldMatch: ["childObject"]
    },
    {
        name: "match wildcard middle",
        match: ".*e*",
        shouldMatch: ["childObject"]
    },
    {
        name: "match wildcard end",
        match: ".d*",
        shouldMatch: ["childObject"]
    },
    {
        name: "match wildcard in array",
        match: ".ghi.*",
        shouldMatch: ["grandchildElement"]
    },
    {
        name: "match wildcards in keypath",
        match: ".def.*.abc",
        shouldMatch: ["greatGrandchild"]
    },
    {
        name: "match wildcards in keypath",
        match: ".*.*.*",
        shouldMatch: ["greatGrandchild"] // and NOT grandchildWithDot
    },
    {
        name: "match globstar",
        match: "**",
        shouldMatch: [
            "top",
            "childValue",
            "childObject",
            "grandchildValue",
            "grandchildWithDot",
            "greatGrandchild",
            "childArray",
            "grandchildElement",
            "escapeChars"
        ]
    },
    {
        name: "match globstar start",
        match: "**abc",
        shouldMatch: ["childValue", "greatGrandchild"]
    },
    {
        name: "match globstar start (negative test)",
        match: "**def",
        shouldMatch: ["childObject"]
    },
    {
        name: "match globstar middle",
        match: "**def**",
        shouldMatch: [
            "childObject",
            "grandchildValue",
            "grandchildWithDot",
            "greatGrandchild"
        ]
    },
    {
        name: "match globstar end",
        match: ".ghi.**",
        shouldMatch: ["grandchildElement"]
    },
    {
        name: "match globstar children",
        match: ".**",
        shouldMatch: [
            "childValue",
            "childObject",
            "grandchildValue",
            "grandchildWithDot",
            "greatGrandchild",
            "childArray",
            "grandchildElement",
            "escapeChars"
        ]
    },
    {
        name: "match self with type",
        match: ".:Parent",
        shouldMatch: ["top"]
    },
    {
        name: "match self with type",
        match: ".:Indexed",
        shouldMatch: []
    },
    {
        name: "match child by full name with type",
        match: ".abc:Child",
        shouldMatch: ["childValue"]
    },
    {
        name: "match child by full name with type",
        match: ".abc:Parent",
        shouldMatch: []
    },
    {
        name: "match child with escape chars with type",
        match: ".jkl%.%:%|%#%,:Child",
        shouldMatch: ["escapeChars"]
    },
    {
        name: "match child with escape chars with type",
        match: ".jkl%.%:%|%#%,:Parent",
        shouldMatch: []
    },
    {
        name: "match wildcard children with type",
        match: ".*:Child",
        shouldMatch: ["childValue", "childObject", "childArray", "escapeChars"]
    },
    {
        name: "match wildcard children with type",
        match: ".*:Parent",
        shouldMatch: ["childObject", "childArray"]
    },
    {
        name: "match wildcard children with type",
        match: ".*:Indexed",
        shouldMatch: ["childArray"]
    },
    {
        name: "match wildcard children with type",
        match: ".*:Element",
        shouldMatch: []
    },
    {
        name: "match wildcard children with type",
        match: ".*:TopLevel",
        shouldMatch: []
    },
    {
        name: "match wildcard children with negative type",
        match: ".*:!Child",
        shouldMatch: []
    },
    {
        name: "match wildcard children with negative type",
        match: ".*:!Parent",
        shouldMatch: ["childValue", "escapeChars"]
    },
    {
        name: "match wildcard children with negative type",
        match: ".*:!Indexed",
        shouldMatch: ["childValue", "childObject", "escapeChars"]
    },
    {
        name: "match wildcard children with negative type",
        match: ".*:!Element",
        shouldMatch: ["childValue", "childObject", "childArray", "escapeChars"]
    },
    {
        name: "match wildcard children with negative type",
        match: ".*:!TopLevel",
        shouldMatch: ["childValue", "childObject", "childArray", "escapeChars"]
    },
    {
        name: "match globstar with type",
        match: "**:Parent",
        shouldMatch: [
            "top",
            "childObject",
            "childArray"
        ]
    },
    {
        name: "match globstar with wildcard",
        match: "**.*",
        shouldMatch: [
            "childValue",
            "childObject",
            "grandchildValue",
            "grandchildWithDot",
            "greatGrandchild",
            "childArray",
            "grandchildElement",
            "escapeChars"
        ]
    },
    {
        name: "match globstar with two wildcards",
        match: "**.*.*",
        shouldMatch: [
            "grandchildValue",
            "grandchildWithDot",
            "greatGrandchild",
            "grandchildElement"
        ]
    },
    {
        name: "match globstar and wildcard with type",
        match: "**.*:Parent",
        shouldMatch: [
            "childObject",
            "childArray"
        ]
    },
    {
        name: "match globstar with type",
        match: "**:Indexed",
        shouldMatch: ["childArray"]
    },
    {
        name: "match globstar with type",
        match: "**:Element",
        shouldMatch: ["grandchildElement"]
    },
    {
        name: "match globstar with type",
        match: "**:TopLevel",
        shouldMatch: ["top"]
    },
    {
        name: "match globstar with negative type",
        match: "**:!Child",
        shouldMatch: ["top"]
    },
    {
        name: "match globstar with negative type",
        match: "**:!Parent",
        shouldMatch: [
            "childValue",
            "grandchildValue",
            "grandchildWithDot",
            "greatGrandchild",
            "grandchildElement",
            "escapeChars"
        ]
    },
    {
        name: "match globstar with negative type",
        match: "**:!Indexed",
        shouldMatch: [
            "top",
            "childValue",
            "childObject",
            "grandchildValue",
            "grandchildWithDot",
            "greatGrandchild",
            "grandchildElement",
            "escapeChars"
        ]
    },
    {
        name: "match globstar with negative type",
        match: "**:!Element",
        shouldMatch: [
            "top",
            "childValue",
            "childObject",
            "grandchildValue",
            "grandchildWithDot",
            "greatGrandchild",
            "childArray",
            "escapeChars"
        ]
    },
    {
        name: "match globstar with negative type",
        match: "**:!TopLevel",
        shouldMatch: [
            "childValue",
            "childObject",
            "grandchildValue",
            "grandchildWithDot",
            "greatGrandchild",
            "childArray",
            "grandchildElement",
            "escapeChars"
        ]
    }
];

pipeWith(
    matchTests,
    map(({name, match, matchParsed, shouldMatch}) => {
        test(`${name}`, () => {
            let matched: string[] = pipeWith(
                typedPathStrings,
                map((typedPathString, name) => Matcher(typedPathString, match)),
                filter(identity()),
                keyArray()
            );
            expect(matched).toEqual(shouldMatch);
        });
    })
);

test(`split() should split`, () => {
    expect(['abc']).toEqual(split(`abc`));
    expect(['abc', 'def']).toEqual(split(`abc.def`));
    expect(['abc', 'de%.f']).toEqual(split(`abc.de%.f`));
});

test(`containsWildcard() should identify when a match string contains a wildcard`, () => {
    expect(containsWildcard(`abc`)).toBe(false);
    expect(containsWildcard(`abc*`)).toBe(true);
    expect(containsWildcard(`abc.*`)).toBe(true);
    expect(containsWildcard(`abc%*`)).toBe(false);
    expect(containsWildcard(`abc%*.*`)).toBe(true);
    expect(containsWildcard(`**`)).toBe(false);
    expect(containsWildcard(`abc.**`)).toBe(false);
    expect(containsWildcard(`abc.*.**`)).toBe(true);
    expect(containsWildcard(`abc%**`)).toBe(true);
});

test(`containsGlobstar() should identify when a match string contains a globstar`, () => {
    expect(containsGlobstar(`abc`)).toBe(false);
    expect(containsGlobstar(`abc*`)).toBe(false);
    expect(containsGlobstar(`abc.*`)).toBe(false);
    expect(containsGlobstar(`abc%*`)).toBe(false);
    expect(containsGlobstar(`abc%*.*`)).toBe(false);
    expect(containsGlobstar(`**`)).toBe(true);
    expect(containsGlobstar(`abc.**`)).toBe(true);
    expect(containsGlobstar(`abc.*.**`)).toBe(true);
    expect(containsGlobstar(`abc%**`)).toBe(false);
});

