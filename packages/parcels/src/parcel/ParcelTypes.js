// @flow
import isIndexed from 'unmutable/lib/util/isIndexed';
import isValueObject from 'unmutable/lib/util/isValueObject';

export default class ParcelTypes {

    _isChild: boolean = false; // TODO
    _isElement: boolean = false; // TODO
    _isIndexed: boolean = false;
    _isParent: boolean = false;

    constructor(value: *) {
        this._isIndexed = isIndexed(value);
        this._isParent = isValueObject(value);
    }

    isChild: Function = (): boolean => this._isChild;
    isElement: Function = (): boolean => this._isElement;
    isIndexed: Function = (): boolean => this._isIndexed;
    isParent: Function = (): boolean => this._isParent;
}
