// @flow
import type Parcel from '../parcel/Parcel';

import createUpdater from '../parcelData/createUpdater';

type Config = {
    down?: Function,
    up?: Function,
    preserve?: boolean
};

export default (config: Config) => {
    let {
        down = ii => ii,
        up = ii => ii,
        preserve
    } = config;

    if(!preserve) {
        return (parcel: Parcel): Parcel => parcel
            .modifyDown(down)
            .modifyUp(up);
    }

    return (parcel: Parcel): Parcel => parcel
        .modifyDown((parcelData) => {
            if('translated' in parcelData.meta) {
                return {
                    value: parcelData.meta.translated
                };
            }
            return createUpdater(
                down,
                () => ({
                    meta: {
                        untranslated: parcelData.value
                    }
                })
            )(parcelData);
        })
        .modifyUp((parcelData) => {
            return createUpdater(
                up,
                ({value}) => ({
                    meta: {
                        translated: parcelData.value,
                        untranslated: value
                    }
                })
            )(parcelData);
        });
};
