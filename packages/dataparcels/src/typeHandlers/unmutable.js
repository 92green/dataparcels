/* eslint-disable flowtype/require-valid-file-annotation */
import object from './object';

export default {
    ...object,
    name: 'unmutable',
    compatibleWith: ['object'],
    match: (value) => value && value.__UNMUTABLE_COMPATIBLE__,
    toObject: (value) => value.toObject(),
    fromObject: (value, prevValue) => prevValue.unit(value)
};
