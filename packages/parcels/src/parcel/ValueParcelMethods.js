// @flow
import type {ParcelData} from '../types/Types';
import type Parcel from './Parcel';
import strip from '../parcelData/strip';
import ChangeRequest from '../change/ChangeRequest';
import ActionCreators from '../change/ActionCreators';
import {containsWildcard, split} from '../modifiers/Matcher';

import flatMap from 'unmutable/lib/flatMap';
import shallowEquals from 'unmutable/lib/shallowEquals';
import take from 'unmutable/lib/take';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (_this: Parcel): Object => ({

    // get methods

    raw: (): ParcelData => {
        return _this._parcelData;
    },

    data: (): ParcelData => {
        return pipeWith(
            _this._parcelData,
            strip()
        );
    },

    value: (): * => {
        return _this._parcelData.value;
    },

    spread: (): Object => ({
        value: _this.value(),
        onChange: _this.onChange
    }),

    spreadDOM: (): Object => ({
        value: _this.value(),
        onChange: _this.onChangeDOM
    }),

    meta: (): * => {
        let {meta} = _this._parcelData;
        return {...meta};
    },

    hasDispatched: (): boolean => {
        return _this._treeshare.dispatch.hasPathDispatched(_this.path());
    },

    getInternalLocationShareData: (): Object => {
        return _this._treeshare.locationShare.get(_this.path());
    },

    findAllMatching: (match: string): Parcel[] => {
        let matchParts = split(match);
        let path = _this.path();

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

        return get(_this, matchParts.slice(path.length));
    },

    // change methods

    setSelf: (value: *) => {
        _this.dispatch(ActionCreators.setSelf(value));
    },

    updateSelf: (updater: Function) => {
        _this.setSelf(updater(_this.value()));
    },

    onChange: (newValue: *) => {
        _this.setSelf(newValue);
    },

    onChangeDOM: (event: Object) => {
        _this.onChange(event.target.value);
    },

    setMeta: (partialMeta: Object) => {
        _this.dispatch(ActionCreators.setMeta(partialMeta));
    },

    updateMeta: (updater: Function) => {
        let {meta} = _this._parcelData;
        _this.setMeta(updater(meta));
    },

    setChangeRequestMeta: (partialMeta: Object) => {
        _this.dispatch(new ChangeRequest().setMeta(partialMeta));
    },

    ping: () => {
        _this.dispatch(ActionCreators.ping());
    },

    // mutation methods

    setInternalLocationShareData: (partialData: Object) => {
        _this._treeshare.locationShare.set(_this.path(), partialData);
    }
});
