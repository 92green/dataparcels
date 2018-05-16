// @flow
import test from 'ava';
import Modifiers from '../Modifiers';

let typedPathStrings = {
    top: "^:ceiPT",
    childValue: "abc:Ceipt",
    childObject: "def:CeiPt",
    grandchildValue: "def:CeiPt.defkid:Ceipt",
    grandchildWithDot: "def:CeiPt.dot%.dot:Ceipt",
    childArray: "ghi:CeIPt",
    grandchildElement: "ghi:CeIPt.#a:CEipt",
    escapeChars: "jkl%.%:%|%#%,:Ceipt"
};

let tests = [
    {
        name: "match root",
        match: "^",
        shouldMatch: ["top"]
    },
    {
        name: "match child by full name",
        match: "abc",
        shouldMatch: ["childValue"]
    },
    {
        name: "match child with escape chars",
        match: "jkl%.%:%|%#%,",
        shouldMatch: ["escapeChars"]
    },
    {
        name: "match grandchild",
        match: "def.defkid",
        shouldMatch: ["grandchildValue"]
    },
    {
        name: "match grandchild element",
        match: "ghi.#a",
        shouldMatch: ["grandchildElement"]
    },
    {
        name: "match wildcard",
        match: "*",
        shouldMatch: ["childValue", "childObject", "childArray", "escapeChars"]
    },
    {
        name: "match wildcard start",
        match: "*f",
        shouldMatch: ["childObject"]
    },
    {
        name: "match wildcard middle",
        match: "*e*",
        shouldMatch: ["childObject"]
    },
    {
        name: "match wildcard end",
        match: "d*",
        shouldMatch: ["childObject"]
    }
    // {
    //     name: "match grandchild with dot and type",
    //     match: "def.dot%.dot",
    //     shouldMatch: ["grandchildWithDot"]
    // },
];

tests.forEach(({name, match, shouldMatch}) => {

});


// globstar (start, middle)
// named type (child, element, indexed, parent, top)
// wildcard type (child, element, indexed, parent, top)
// globstar type? (child, element, indexed, parent, top)





// test('Modifiers should _processMatch()', (tt: Object) => {
//     tt.is(undefined, new Modifiers()._processMatch(undefined), "_processMatch() can cope with undefined");
//     tt.is("abc:*", new Modifiers()._processMatch("abc"), "_processMatch() can cope with simple key");
//     tt.is("abc:*.def:*.ghi:*", new Modifiers()._processMatch("abc.def.ghi"), "_processMatch() can cope with deep key");
//     tt.is("*:*I*", new Modifiers()._processMatch("*:Indexed"), "_processMatch() can cope with a type");
//     tt.is("*:*i*", new Modifiers()._processMatch("*:!Indexed"), "_processMatch() can cope with a not type");
//     tt.is("hello:*C*P*", new Modifiers()._processMatch("hello:Parent|Child"), "_processMatch() can cope with a multi type");
//     tt.is("**.*:*", new Modifiers()._processMatch("**.*"), "_processMatch() can cope with a globstar");
//     //tt.is(tt.throws(() => new Modifiers()._processMatch("*:Notexist"), Error).message, `"Notexist" is not a valid type selector.`); TODO!
// });

