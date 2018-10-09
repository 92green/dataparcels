// @flow
import Action from '../../change/Action';
import ChangeRequest from '../../change/ChangeRequest';
import Parcel from '../../parcel/Parcel';
import Types from '../Types';

import map from 'unmutable/lib/map';
import pipeWith from 'unmutable/lib/util/pipeWith';

//
// Test the type checker
//

let types = {
    ['action']: new Action(),
    ['actionArray']: [new Action(),new Action()],
    ['botchedActionArray']: [new Action(),new Action(),123],
    ['booleanTrue']: true,
    ['booleanFalse']: false,
    ['changeRequest']: new ChangeRequest(),
    ['event']: {currentTarget: {value: null}},
    ['function']: () => {},
    ['number']: 123,
    ['numberArray']: [123, 456],
    ['object']: {},
    ['parcel']: new Parcel(),
    ['parcelData']: {value: 123},
    ['string']: "abc",
    ['stringArray']: ["abc", "def"],
    ['undefined']: undefined
};

let testTypes = (type: string, shouldAllow: string[]) => {
    pipeWith(
        types,
        map((data, dataType) => {
            if(shouldAllow.indexOf(dataType) !== -1) {
                expect(() => Types(`Thing`, `Thing`, type)(data)).not.toThrowError(`${type} should not throw when given ${dataType}`);
            } else {
                expect(() => Types(`Thing`, `Thing`, type)(data)).toThrowError(`but got`);
            }
        })
    );
};

test('Types will error if type is not found', () => {
    expect(() => Types('???', 'notfound')({abc: 123})).toThrowError("Unknown type check");
});

test('Types() can identify a boolean', () => testTypes(`boolean`, [
    'booleanTrue',
    'booleanFalse'
]));

test('Types() can identify a dispatchable', () => testTypes(`dispatchable`, [
    'action',
    'actionArray',
    'changeRequest'
]));

test('Types() can identify an event', () => testTypes(`event`, [
    'event'
]));

test('Types() can identify a function', () => testTypes(`function`, [
    'function'
]));

test('Types() can identify a keyIndex', () => testTypes(`keyIndex`, [
    'number',
    'string'
]));

test('Types() can identify a keyIndexPath', () => testTypes(`keyIndexPath`, [
    'numberArray',
    'stringArray'
]));

test('Types() can identify a number', () => testTypes(`number`, [
    'number'
]));

test('Types() can identify a object', () => testTypes(`object`, [
    'action',
    'actionArray',
    'botchedActionArray',
    'changeRequest',
    'event',
    'numberArray',
    'object',
    'parcel',
    'parcelData',
    'stringArray'
]));

test('Types() can identify a parcel', () => testTypes(`parcel`, [
    'parcel'
]));

test('Types() can identify a parcelData', () => testTypes(`parcelData`, [
    'parcelData'
]));

test('Types() can identify a string', () => testTypes(`string`, [
    'string'
]));
