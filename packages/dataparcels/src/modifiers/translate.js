// @flow
import type Parcel from '../parcel/Parcel';

import asNode from '../parcelNode/asNode';
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
        .modifyDown(asNode(node => {
            if('translated' in node.meta) {
                return node.update(() => ({
                    value: node.meta.translated
                }));
            }

            return node
                .update(downValue)
                .setMeta({
                    untranslated: node.value
                });
        }))
        .modifyUp(asNode((node) => {
            let updated = node.update(upValue);

            return updated
                .setMeta({
                    translated: node.value,
                    untranslated: updated.value
                });
        }));
};
