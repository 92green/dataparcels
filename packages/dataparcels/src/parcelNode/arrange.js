// // @flow

// // import isParentValue from '../parcelData/isParentValue';
// // import isIndexedValue from '../parcelData/isIndexedValue';
// // import parcelSetSelf from '../parcelData/setSelf';
// // import updateChild from '../parcelData/updateChild';
// // import updateChildKeys from '../parcelData/updateChildKeys';

// let isParentValue = () => {};
// let isIndexedValue = () => {};
// let parcelSetSelf = () => {};
// let updateChild = () => {};
// let updateChildKeys = () => {};

// // import map from 'unmutable/map';
// // import pipeWith from 'unmutable/pipeWith';
// // import shallowToJS from 'unmutable/shallowToJS';

// // @flow
// import type {Index} from '../types/Types';
// import type {Key} from '../types/Types';
// import type ChangeRequest from '../change/ChangeRequest';
// import type TypeSet from '../typeHandlers/TypeSet';

// // import keyOrIndexToKey from '../parcelData/keyOrIndexToKey';
// let keyOrIndexToKey = () => {};
// import combine from '../combine';

// let map = () => {};
// let pipeWith = () => {};
// let shallowToJS = () => {};

// type Data = {
//     value: any,
//     meta: {[key: string]: any},
//     typeSet: TypeSet,
//     changeRequest?: ChangeRequest
// };

// type PartialData = {
//     value?: any,
//     meta?: {[key: string]: any}
// };


// export class Item {

//     _cachedData: ?ParcelData;
//     _key: Key;
//     _get: Function;
//     _getParent: Function;
//     _notFoundValue: any;

//     //
//     // private methods
//     //

//     // _prepareChildKeys = () => {
//     //     // prepare child keys only once per parcel instance
//     //     // by preparing them and mutating this.parcelData
//     //     let {data} = this;
//     //     if(!data.child) {
//     //         // this._data = prepareChildKeys()(data);
//     //     }
//     // }

//     //
//     // getters
//     //

//     // $FlowFixMe - this doesn't have side effects
//     get data(): ParcelData {
//         if(this._cachedData) return this._cachedData;
//         this._cachedData = this._getParent(this._key, this._notFoundValue)[0];
//         return this._cachedData;
//     }

//     // $FlowFixMe - this doesn't have side effects
//     get value(): any {
//         return this.data.value;
//     }

//     // $FlowFixMe - this doesn't have side effects
//     get meta(): any {
//         return this.data.meta || {};
//     }

//     // $FlowFixMe - this doesn't have side effects
//     get key(): ?Key {
//         return this.data.key;
//     }

//     //
//     // methods
//     //

//     get = (key: any, notFoundValue: any): Item => {
//         let item = new Item();
//         item._getParent = this._get;
//         item._key = key;
//         item._notFoundValue = notFoundValue;
//         return item;
//     };

//     update = (updater: Function): Item => {
//         // let preparedUpdater = combine(updater);
//         // let parcelNode = new Item();
//         // parcelNode._data = preparedUpdater({
//         //     ...this._data,
//         //     changeRequest: this._changeRequest
//         // });
//         // return parcelNode;
//     };
// }

// // const updateChildNodes = (node: Item, updater: Function): Item => {
// //     let {data, value, _changeRequest} = node;
// //     if(isParentValue(value)) {
// //         node._prepareChildKeys();
// //         value = pipeWith(
// //             value,
// //             map((value, key) => node.get(key))
// //         );
// //     }

// //     let updated: any = updater(value, _changeRequest);

// //     let parcelNode = new Item();
// //     if(!isParentValue(updated)) {
// //         parcelNode._data = parcelSetSelf(updated)(data);
// //         return parcelNode;
// //     }

// //     updated = pipeWith(
// //         updated,
// //         map((maybeNode: any) => maybeNode instanceof Item
// //             ? maybeNode
// //             : new Item(maybeNode)
// //         )
// //     );

// //     let newValue = map(node => node.value)(updated);

// //     let hasNewNode = false;
// //     let keyMap = {};

// //     let newChild = pipeWith(
// //         updated,
// //         shallowToJS(),
// //         map(childNode => {
// //             let {child, meta, key} = childNode.data;
// //             let keyExists = keyMap[key];
// //             keyMap[key] = true;
// //             if(keyExists || childNode._parent !== node) {
// //                 hasNewNode = true;
// //                 key = undefined;
// //             }
// //             return {child, meta, key};
// //         })
// //     );

// //     let newData: Data = {
// //         ...data,
// //         value: newValue,
// //         child: newChild
// //     };

// //     let typeChanged = () => isIndexedValue(value) !== isIndexedValue(updated);

// //     if(hasNewNode || typeChanged()) {
// //         newData = pipeWith(
// //             newData,
// //             updateChild(),
// //             updateChildKeys(data.child)
// //         );
// //     }

// //     parcelNode._data = newData;
// //     return parcelNode;
// // };

// export default (arranger: Function) => {

//     let updater = (data: Data): PartialData => {
//         let parcelData = data;

//         let type = data.typeSet.getType(parcelData);
//         if(type.isParent) {
//             let {_get, _mapKeys} = type.internalProperties;
//             let parcelDataWithKeys = data.typeSet.createChildKeys(parcelData, true);

//             let item = new Item();
//             item._get = (key, notFoundValue) => _get(parcelDataWithKeys, key, notFoundValue);

//             parcelData = {
//                 ...parcelData,
//                 value: _mapKeys(parcelDataWithKeys, key => item.get(key))
//             };
//         }

//         let newParcelData = arranger(parcelData);

//         let newType = data.typeSet.getType(newParcelData);
//         if(newType.isParent) {
//             let {_set, _mapKeys} = newType.internalProperties;
//             let newParcelDataWithKeys = data.typeSet.createChildKeys(newParcelData, true);

//             // reduce
//             _mapKeys(newParcelDataWithKeys, key => {
//                 if(item instanceof Item) {
//                     newParcelDataWithKeys = _set(newParcelDataWithKeys, key, item.data);
//                     return item.value
//                 }
//             });
//         }

//         return newParcelData;
//     };

//     updater._updater = arranger;
//     return updater;
// };
