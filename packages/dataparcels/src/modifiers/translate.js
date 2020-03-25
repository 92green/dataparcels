// @flow
import type Parcel from '../parcel/Parcel';

import createUpdater from '../parcelData/createUpdater';
import update from 'unmutable/lib/update';

type Config = {
    down?: (parcelData: any) => any,
    up?: (parcelData: any) => any,
    preserveInput?: boolean
};

export default (config: Config) => {
    let {
        down = ii => ii,
        up = ii => ii,
        preserveInput
    } = config;

    let downValue = update('value', down);
    let upValue = update('value', up);

    if(!preserveInput) {
        return (parcel: Parcel): Parcel => parcel
            .modifyDown(downValue)
            .modifyUp(upValue);
    }

    return (parcel: Parcel): Parcel => parcel
        .modifyDown((parcelData) => {
            if('translated' in parcelData.meta) {
                return {
                    value: parcelData.meta.translated
                };
            }
            return createUpdater(
                downValue,
                () => ({
                    meta: {
                        untranslated: parcelData.value
                    }
                })
            )(parcelData);
        })
        .modifyUp((parcelData) => {
            return createUpdater(
                upValue,
                ({value}) => ({
                    meta: {
                        translated: parcelData.value,
                        untranslated: value
                    }
                })
            )(parcelData);
        });
};
