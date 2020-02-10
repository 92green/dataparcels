// @flow
import type Parcel from '../parcel/Parcel';
import type ChangeRequest from '../change/ChangeRequest';

import asNode from '../parcelNode/asNode';

type Config = {
    down?: (value: any) => any,
    up?: (value: any, changeRequest: ChangeRequest) => any,
    preserveInput?: boolean
};

export default (config: Config) => {
    let {
        down = ii => ii,
        up = ii => ii,
        preserveInput
    } = config;

    if(!preserveInput) {
        return (parcel: Parcel): Parcel => parcel
            .modifyDown(down)
            .modifyUp(up);
    }

    return (parcel: Parcel): Parcel => parcel
        .modifyDown(asNode(node => {
            if('translated' in node.meta) {
                return node.update(() => node.meta.translated);
            }
            return node
                .update(down)
                .setMeta({
                    untranslated: node.value
                });
        }))
        .modifyUp(asNode((node) => {
            let updated = node.update(up);

            return updated
                .setMeta({
                    translated: node.value,
                    untranslated: updated.value
                });
        }));
};
