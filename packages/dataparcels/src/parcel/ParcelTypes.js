// @flow
import isIndexedValue from '../parcelData/isIndexedValue';
import isParentValue from '../parcelData/isParentValue';

export default class ParcelTypes {

    _isChild: boolean = false;
    _isElement: boolean = false;
    _isIndexed: boolean = false;
    _isParent: boolean = false;
    _isTopLevel: boolean = false;

    constructor(value: *, parentParcelTypes: ?ParcelTypes, isTopLevel: boolean = false) {
        this._isChild = !!parentParcelTypes;
        this._isElement = !!(parentParcelTypes && parentParcelTypes.isIndexed());
        this._isIndexed = isIndexedValue(value);
        this._isParent = isParentValue(value);
        this._isTopLevel = isTopLevel;
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
