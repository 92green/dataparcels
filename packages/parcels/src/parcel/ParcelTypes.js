// @flow
import type ParcelId from '../parcelId/ParcelId';
import isIndexed from 'unmutable/lib/util/isIndexed';
import isValueObject from 'unmutable/lib/util/isValueObject';

export default class ParcelTypes {

    _isChild: boolean = false;
    _isElement: boolean = false;
    _isIndexed: boolean = false;
    _isParent: boolean = false;
    _isTopLevel: boolean = false;

    constructor(value: *, parentParcelTypes: ?ParcelTypes, id: ParcelId) {
        this._isChild = !!parentParcelTypes;
        this._isElement = !!(parentParcelTypes && parentParcelTypes.isIndexed());
        this._isIndexed = isIndexed(value);
        this._isParent = isValueObject(value);
        this._isTopLevel = id.path().length === 0;
    }

    isChild: Function = (): boolean => this._isChild;
    isElement: Function = (): boolean => this._isElement;
    isIndexed: Function = (): boolean => this._isIndexed;
    isParent: Function = (): boolean => this._isParent;
    isTopLevel: Function = (): boolean => this._isTopLevel;

    toTypeCode: Function = (): string => {
        let c: string = this._isChild ? "C" : "c";
        let e: string = this._isElement ? "E" : "e";
        let i: string = this._isIndexed ? "I" : "i";
        let p: string = this._isParent ? "P" : "p";
        let t: string = this._isTopLevel ? "T" : "t";
        return `${c}${e}${i}${p}${t}`;
    };
}
