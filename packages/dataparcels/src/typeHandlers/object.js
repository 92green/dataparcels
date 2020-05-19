/* eslint-disable flowtype/require-valid-file-annotation */
const passthrough = arg => arg;

export default {
    name: 'object',
    match: (value) => value === Object(value),
    isParent: true,
    toObject: passthrough,
    fromObject: passthrough,
    properties: {
        // $FlowFixMe
        size: (parcel) => Object.keys(parcel._type.toObject(parcel._parcelData.value)).length
    },
    childProperties: {
        delete: (parcel) => () => {
            parcel._fireAction('object.child.delete');
        }
    },
    internalProperties: {
        _createChildKeys: ({child, value}, type) => {
            let obj = {};
            let objectValue = type.toObject(value);
            for(let key in objectValue) {
                obj[key] = (child && (key in child)) ? child[key] : {key};
            }
            return obj;
        },

        _mapKeys: (parcelData, mapper, type) => {
            let obj = {};
            let objectValue = type.toObject(parcelData.value);
            for(let key in objectValue) {
                obj[key] = mapper(key);
            }
            return obj;
        },

        _has: (parcelData, key, type) => {
            let objectValue = type.toObject(parcelData.value);
            return key in objectValue;
        },

        _get: (parcelData, key, notFoundValue, type) => {
            let objectValue = type.toObject(parcelData.value);
            if(!(key in objectValue)) {
                return [{
                    value: notFoundValue,
                    key
                }];
            }

            return [{
                value: objectValue[key],
                ...parcelData.child[key]
            }];
        },

        _set: (parcelData, key, {value, ...rest}, type) => {
            let newParcelData = {
                ...parcelData,
                value: {...parcelData.value},
                child: {...parcelData.child}
            };

            newParcelData.value[key] = value;
            newParcelData.child[key] = {
                ...parcelData.child[key],
                ...rest,
                key
            };

            newParcelData.value = type.fromObject(newParcelData.value, parcelData.value);
            return newParcelData;
        }
    },
    actionHandlers: {
        'object.child.delete.homogeneous': true,
        'object.child.delete': (parcelData, {key, type}) => {

            let del = (value) => {
                let clone = {...value};
                delete clone[key];
                return clone;
            };

            return {
                ...parcelData,
                value: type.fromObject(del(type.toObject(parcelData.value)), parcelData.value),
                child: del(parcelData.child)
            };
        }
    }
};
