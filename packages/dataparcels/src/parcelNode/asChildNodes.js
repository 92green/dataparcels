// @flow
import type {ParcelData} from '../types/Types';

import isParentValue from '../parcelData/isParentValue';
import isIndexedValue from '../parcelData/isIndexedValue';
import parcelSetSelf from '../parcelData/setSelf';
import updateChild from '../parcelData/updateChild';
import updateChildKeys from '../parcelData/updateChildKeys';
import ParcelNode from './ParcelNode';

import map from 'unmutable/map';
import pipeWith from 'unmutable/pipeWith';
import shallowToJS from 'unmutable/shallowToJS';
import asNode from './asNode';

const updateChildNodes = (node: ParcelNode, updater: Function, changeRequest: *): ParcelNode => {
    let {data, value} = node;
    if(isParentValue(value)) {
        node._prepareChildKeys();
        value = pipeWith(
            value,
            map((value, key) => node.get(key))
        );
    }

    let updated: any = updater(value, changeRequest);

    let parcelNode = new ParcelNode();
    if(!isParentValue(updated)) {
        parcelNode._parcelData = parcelSetSelf(updated)(data);
        return parcelNode;
    }

    updated = pipeWith(
        updated,
        map((maybeNode: any) => maybeNode instanceof ParcelNode
            ? maybeNode
            : new ParcelNode(maybeNode)
        )
    );

    let newValue = map(node => node.value)(updated);

    let hasNewNode = false;
    let keyMap = {};

    let newChild = pipeWith(
        updated,
        shallowToJS(),
        map(childNode => {
            let {child, meta, key} = childNode.data;
            let keyExists = keyMap[key];
            keyMap[key] = true;
            if(keyExists || childNode._parent !== node) {
                hasNewNode = true;
                key = undefined;
            }
            return {child, meta, key};
        })
    );

    let newParcelData: ParcelData = {
        ...data,
        value: newValue,
        child: newChild
    };

    let typeChanged = () => isIndexedValue(value) !== isIndexedValue(updated);

    if(hasNewNode || typeChanged()) {
        newParcelData = pipeWith(
            newParcelData,
            updateChild(),
            updateChildKeys(data.child)
        );
    }

    parcelNode._parcelData = newParcelData;
    return parcelNode;
};

export default (updater: Function) => {
    let fn = asNode((node, changeRequest) => updateChildNodes(node, updater, changeRequest));
    fn._updater = updater;
    return fn;
};
