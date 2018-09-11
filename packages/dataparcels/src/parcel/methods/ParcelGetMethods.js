// @flow
import type Parcel from '../../parcel/Parcel';
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

    pipe: (...updaters: Function[]): Parcel => {
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

    // Status methods

    hasDispatched: (): boolean => {
        return _this._treeshare.dispatch.hasPathDispatched(_this.path);
    },

    // Log methods

    log: (name: string): Parcel => {
        _this._log = true;
        _this._logName = name;
        console.log(`Parcel data: ${name} `);
        console.log(JSON.parse(JSON.stringify(_this.data)));
        return _this;
    }
});
