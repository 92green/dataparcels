// @flow
import type {Type} from '../types/Types';
import type {ParcelData} from '../types/Types';

import arrayType from './array';
import objectType from './object';
import basicType from './basic';

export default class TypeSet {

    types: Type[];

    constructor(types: Type[]) {
        this.types = types;
    }

    static defaultTypes = [arrayType, objectType, basicType];
    static basicType = basicType;

    // $FlowFixMe - this .find() will always find an item if types array is configured correctly
    getType = ({value}: ParcelData): Type => this.types.find(type => type.match(value));

    createChildKeys = (parcelData: ParcelData, soft: ?boolean): ParcelData => {
        if(soft && parcelData.child) return parcelData;
        let {_createChildKeys} = this.getType(parcelData).internalProperties || {};
        if(!_createChildKeys) return parcelData;
        return  {
            ...parcelData,
            child: _createChildKeys(parcelData)
        };
    };
}
