// @flow
import type Parcel from '../parcel/Parcel';
import {containsWildcard, split} from '../modifiers/Matcher';

import flatMap from 'unmutable/lib/flatMap';
import shallowEquals from 'unmutable/lib/shallowEquals';
import take from 'unmutable/lib/take';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (startParcel: Parcel, match: string): Parcel[] => {
    let matchParts = split(match);
    let path = startParcel.path();

    let baseMatches = pipeWith(
        matchParts,
        take(path.length),
        shallowEquals(path)
    );

    if(!baseMatches) {
        return [];
    }

    let get = (parcel: Parcel, matchParts: string[]): Parcel[] => {
        let [matchPart, ...remainingMatchParts] = matchParts;

        if(!matchPart) {
            return [parcel];
        }
        if(!parcel.isParent()) {
            return [];
        }
        if(containsWildcard(matchPart)) {
            return pipeWith(
                parcel.toArray(pp => get(pp, remainingMatchParts)),
                flatMap(ii => ii)
            );
        }
        if(!parcel.has(matchPart)) {
            return [];
        }
        return get(parcel.get(matchPart), remainingMatchParts);
    };

    return get(startParcel, matchParts.slice(path.length));
};
