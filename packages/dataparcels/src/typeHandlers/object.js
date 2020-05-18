/* eslint-disable flowtype/require-valid-file-annotation */

export default {
    name: 'object',
    match: (value) => value === Object(value),
    isParent: true,
    properties: {
        // $FlowFixMe
        size: (parcel) => Object.keys(parcel._parcelData.value).length
    },
    childProperties: {
        delete: (parcel) => () => {
            parcel._fireAction('object.child.delete');
        }
    },
    internalProperties: {
        _createChildKeys: ({child, value}) => {
            let obj = {};
            for(let key in value) {
                obj[key] = (child && (key in child)) ? child[key] : {key};
            }
            return obj;
        },

        _mapKeys: (parcelData, mapper) => {
            let obj = {};
            for(let key in parcelData.value) {
                obj[key] = mapper(key);
            }
            return obj;
        },

        _has: (parcelData, key) => {
            return key in parcelData.value;
        },

        _get: (parcelData, key, notFoundValue) => {
            if(!(key in parcelData.value)) {
                return [{
                    value: notFoundValue,
                    key
                }];
            }

            return [{
                value: parcelData.value[key],
                ...parcelData.child[key]
            }];
        },

        _set: (parcelData, key, {value, ...rest}) => {
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
            return newParcelData;
        }
    },
    actionHandlers: {
        'object.child.delete.homogeneous': true,
        'object.child.delete': (parcelData, {updateValueAndChild, key}) => {
            return updateValueAndChild(parcelData, (value) => {
                let clone = {...value};
                delete clone[key];
                return clone;
            });
        }
    }
};
