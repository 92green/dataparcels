// @flow
import type ChangeRequest from '../../change/ChangeRequest';
import type Parcel from '../../parcel/Parcel';
import type {ParcelUpdater} from '../types/Types';

import Types from '../../types/Types';

import map from 'unmutable/lib/map';
import pipe from 'unmutable/lib/util/pipe';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (_this: Parcel) => ({

    // Spread Methods

    spread: (): Object => ({
        value: _this.value,
        onChange: _this.onChange
    }),

    spreadDOM: (): Object => ({
        value: _this.value,
        onChange: _this.onChangeDOM
    }),

    // Composition methods

    pipe: (...updaters: ParcelUpdater[]): Parcel => {
        Types(`pipe() expects all params to be`, `functionArray`)(updaters);
        return pipeWith(
            _this,
            ...pipeWith(
                updaters,
                map(updater => pipe(
                    updater,
                    Types(`pipe() expects the result of all functions to be`, `parcel`)
                ))
            )
        );
    },

    matchPipe: (match: string, ...updaters: ParcelUpdater[]): Parcel => {
        Types(`matchPipe() expects first param to be`, `string`)(match);
        Types(`matchPipe() expects all but the first param to be`, `functionArray`)(updaters);
    },

    // Status methods

    hasDispatched: (): boolean => {
        return _this._treeshare.dispatch.hasPathDispatched(_this.path);
    },

    // Side-effect methods

    log: (name: string): Parcel => {
        _this._log = true;
        _this._logName = name;
        console.log(`Parcel data: ${name} `);
        console.log(JSON.parse(JSON.stringify(_this.data)));
        return _this;
    },

    spy: (sideEffect: Function): Parcel => {
        Types(`spy() expects param "sideEffect" to be`, `function`)(sideEffect);
        sideEffect(_this);
        return _this;
    },

    spyChange: (sideEffect: Function): Parcel => {
        Types(`spyChange() expects param "sideEffect" to be`, `function`)(sideEffect);
        return _this._create({
            id: _this._id.pushModifier('sc'),
            onDispatch: (changeRequest: ChangeRequest) => {
                sideEffect(changeRequest._setBaseParcel(_this));
                _this.dispatch(changeRequest);
            }
        });
    }
});
