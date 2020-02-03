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
            if('_translated' in node.meta) {
                return node.update(() => node.meta._translated);
            }
            return node.update(down);
        }))
        .modifyUp(asNode((node) => {
            return node
                .update(up)
                .setMeta({
                    _translated: node.value
                });
        }));
};
