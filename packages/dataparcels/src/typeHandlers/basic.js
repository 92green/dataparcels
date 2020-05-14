/* eslint-disable flowtype/require-valid-file-annotation */
import combine from '../combine';

export default {
    name: 'basic',
    match: () => true,
    properties: {

        set: (parcel) => (value) => {
            parcel._fireAction('basic.set', value);
        },

        update: (parcel) => (updater) => {
            let preparedUpdater = combine(updater);
            parcel._fireAction('basic.update', preparedUpdater);
        },

        setMeta: (parcel) => (meta) => {
            parcel._fireAction('basic.setMeta', meta);
        },

        _setData: (parcel) => (parcelData) => {
            parcel._fireAction('basic.setData', parcelData);
        },

        spread: (parcel) => (notFoundValue) => ({
            value: parcel._getValue(notFoundValue),
            onChange: parcel.set
        }),

        spreadInput: (parcel) => (notFoundValue) => ({
            value: parcel._getValue(notFoundValue),
            onChange: parcel._setInput
        }),

        spreadCheckbox: (parcel) => (notFoundValue: ?boolean) => ({
            checked: !!parcel._getValue(notFoundValue),
            onChange: parcel._setCheckbox
        }),

        // set these private methods here so they are created at Parcel creation time
        // and therefore can be passed out as callbacks that won't change
        // for the lifespan of the parcel

        _getValue: (parcel) => (notFoundValue) => {
            let {value} = parcel;
            return value === undefined ? notFoundValue : value;
        },

        _setInput: (parcel) => (event) => {
            parcel.set(event.currentTarget.value);
        },

        _setCheckbox: (parcel) => (event) => {
            parcel.set(event.currentTarget.checked);
        }
    },
    actionHandlers: {
        'basic.set': (parcelData, {payload, createChildKeys}) => {
            return createChildKeys({
                ...parcelData,
                value: payload,
                child: undefined
            });
        },
        'basic.update': (parcelData, {payload}) => {
            return payload(parcelData);
        },
        'basic.setMeta': (parcelData, {payload}) => {
            return {
                ...parcelData,
                meta: {
                    ...(parcelData.meta || {}),
                    ...payload
                }
            };
        },
        'basic.setData': (parcelData, {payload}) => {
            return payload;
        }
    }
};
