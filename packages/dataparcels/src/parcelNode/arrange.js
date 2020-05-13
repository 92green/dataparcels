// @flow
import type {ParcelData} from '../types/Types';

// import isParentValue from '../parcelData/isParentValue';
// import isIndexedValue from '../parcelData/isIndexedValue';
// import parcelSetSelf from '../parcelData/setSelf';
// import updateChild from '../parcelData/updateChild';
// import updateChildKeys from '../parcelData/updateChildKeys';

let isParentValue = () => {};
let isIndexedValue = () => {};
let parcelSetSelf = () => {};
let updateChild = () => {};
let updateChildKeys = () => {};
import ParcelNode from './ParcelNode';

// import map from 'unmutable/map';
// import pipeWith from 'unmutable/pipeWith';
// import shallowToJS from 'unmutable/shallowToJS';

let map = () => {};
let pipeWith = () => {};
let shallowToJS = () => {};

const updateChildNodes = (node: ParcelNode, updater: Function): ParcelNode => {
    let {data, value, _changeRequest} = node;
    if(isParentValue(value)) {
        node._prepareChildKeys();
        value = pipeWith(
            value,
            map((value, key) => node.get(key))
        );
    }

    let updated: any = updater(value, _changeRequest);

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
    let fn = (parcelData: ParcelData, changeRequest: *): ParcelData => {
        let parcelNode = new ParcelNode();
        parcelNode._parcelData = parcelData;
        parcelNode._changeRequest = changeRequest;
        return updateChildNodes(parcelNode, updater).data;
    };
    fn._updater = updater;
    return fn;
};
