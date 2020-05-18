/* eslint-disable flowtype/require-valid-file-annotation */

let indexInRange = (parcelData, positiveIndex) => {
    return positiveIndex >= 0 && positiveIndex < parcelData.value.length;
};

let keyToIndex = (parcelData, key) => {
    // key is string
    let index = parcelData.child.findIndex(item => item.key === key);
    if(index === -1) {
        throw new Error(`key '${key}' not found on [${parcelData.value}]`);
    }
    return index;
};

let keyOrIndexToIndex = (parcelData, key) => {
    // key is string or number
    let index = typeof key === 'string' ? keyToIndex(parcelData, key) : key;
    index = index >= 0 ? index : parcelData.value.length + index;
    if(!indexInRange(parcelData, index)) {
        throw new Error(`index ${index} not found on [${parcelData.value}]`);
    }
    return index;
};

let _createChildKeys = ({child = [], value}) => {
    let max = -1;
    let next = () => {
        if(max === -1) {
            max = Math.max(-1, ...child.filter(Boolean).map(({key}) => Number(key.slice(1))));
        }
        return ++max;
    };
    return value.map((val, index) => child[index] || {key: `#${next()}`});
};


let doAtIndex = (parcelData: ParcelData, key: string, updater: Function): ParcelData => {
    let index;
    try {
        index = keyToIndex(parcelData, key);
    } catch(e) {
        return parcelData;
    }
    return updater(index);
};

export default {
    name: 'array',
    match: (value) => Array.isArray(value),
    isParent: true,
    properties: {
        // $FlowFixMe
        size: (parcel) => parcel._parcelData.value.length,
        push: (parcel) => (...values) => {
            parcel._fireAction('array.push', values);
        },
        pop: (parcel) => () => {
            if(parcel.size > 0) {
                parcel.get(-1).delete();
            }
        },
        shift: (parcel) => () => {
            if(parcel.size > 0) {
                parcel.get(0).delete();
            }
        },
        unshift: (parcel) => (...values) => {
            parcel._fireAction('array.unshift', values);
        }
    },
    childProperties: {
        delete: (parcel) => () => {
            parcel._fireAction('array.child.delete');
        },
        insertBefore: (parcel) => (value) => {
            parcel._fireAction('array.child.insert', {value, offset: 0});
        },
        insertAfter: (parcel) => (value) => {
            parcel._fireAction('array.child.insert', {value, offset: 1});
        },
        swapNext: (parcel) => () => {
            parcel._fireAction('array.child.swap', {offset: 1});
        },
        swapPrev: (parcel) => () => {
            parcel._fireAction('array.child.swap', {offset: -1});
        },
        moveTo: (parcel) => (newIndex) => {
            parcel._fireAction('array.child.move', {newIndex});
        }
    },
    childPropertiesPrecomputed: {
        isFirstChild: (parcelData, parentParcelData) => {
            return parentParcelData.child[0].key === parcelData.key;
        },
        isLastChild: (parcelData, parentParcelData) => {
            return parentParcelData.child.slice(-1)[0].key === parcelData.key;
        },
        isOnlyChild: (parcelData, parentParcelData) => {
            return parentParcelData.child.length === 1;
        }
    },
    internalProperties: {
        _createChildKeys,

        _mapKeys: (parcelData, mapper) => {
            return parcelData.value.map((value, index) => mapper(index));
        },

        _has: (parcelData, key) => {
            // key is string or number
            try {
                let index = keyOrIndexToIndex(parcelData, key);
                return indexInRange(parcelData, index);
            } catch(e) {
                return false;
            }
        },

        _get: (parcelData, key) => {
            // key is string or number
            let index = keyOrIndexToIndex(parcelData, key);
            return [
                {
                    value: parcelData.value[index],
                    ...parcelData.child[index]
                },
                parcelData
            ];
        },

        _set: (parcelData, key, {value, ...rest}) => {
            // key is string
            let index = keyToIndex(parcelData, key);

            let newParcelData = {
                ...parcelData,
                value: parcelData.value.slice(),
                child: parcelData.child.slice()
            };

            newParcelData.value[index] = value;
            newParcelData.child = _createChildKeys(newParcelData);

            newParcelData.child[index] = {
                ...parcelData.child[index],
                ...rest,
                key: newParcelData.child[index].key
            };

            return newParcelData;
        }
    },
    actionHandlers: {
        'array.child.delete.homogeneous': true,
        'array.child.delete': (parcelData, {updateValueAndChild, key}) => {
            let index;
            try {
                index = keyToIndex(parcelData, key);
            } catch(e) {
                return updateValueAndChild(parcelData);
            }
            return updateValueAndChild(parcelData, (value) => {
                let clone = value.slice();
                clone.splice(index, 1);
                return clone;
            });
        },
        'array.child.insert.homogeneous': true,
        'array.child.insert': (parcelData, {payload, createChildKeys, key}) => {
            return doAtIndex(parcelData, key, index => {

                let insert = (value, item) => {
                    let clone = value.slice();
                    clone.splice(index + payload.offset, 0, item);
                    return clone;
                };

                return createChildKeys({
                    ...parcelData,
                    value: insert(parcelData.value, payload.value),
                    child: insert(parcelData.child, null)
                });
            });
        },
        'array.child.swap.homogeneous': true,
        'array.child.swap': (parcelData, {payload, updateValueAndChild, key}) => {
            return doAtIndex(parcelData, key, index => {

                let len = parcelData.value.length;
                let offsetIndex = index + payload.offset;
                if(offsetIndex < 0) {
                    offsetIndex += len;
                } else if(offsetIndex >= len) {
                    offsetIndex -= len;
                }

                return updateValueAndChild(parcelData, (value) => {
                    let clone = value.slice();
                    clone[index] = value[offsetIndex];
                    clone[offsetIndex] = value[index];
                    return clone;
                });
            });
        },
        'array.child.move.homogeneous': true,
        'array.child.move': (parcelData, {payload, updateValueAndChild, key}) => {
            return doAtIndex(parcelData, key, index => {
                return updateValueAndChild(parcelData, (value) => {
                    let clone = value.slice();
                    let toMove = clone[index];
                    clone.splice(index, 1);
                    clone.splice(payload.newIndex, 0, toMove);
                    return clone;
                });
            });
        },
        'array.push.homogeneous': true,
        'array.push': (parcelData, {payload, createChildKeys}) => {
            parcelData = createChildKeys(parcelData);
            return createChildKeys({
                ...parcelData,
                value: parcelData.value.concat(payload),
                child: parcelData.child.concat(payload.map(() => null))
            });
        },
        'array.unshift.homogeneous': true,
        'array.unshift': (parcelData, {payload, createChildKeys}) => {
            parcelData = createChildKeys(parcelData);
            return createChildKeys({
                ...parcelData,
                value: payload.concat(parcelData.value),
                child: payload.map(() => null).concat(parcelData.child)
            });
        }
    }
};
