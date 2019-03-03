// @flow
import type ChangeRequest from '../../change/ChangeRequest';
import type Parcel from '../../parcel/Parcel';
import type {ParcelUpdater} from '../../types/Types';

import Types from '../../types/Types';
import DeletedParcelMarker from '../../parcelData/DeletedParcelMarker';

import map from 'unmutable/lib/map';
import pipe from 'unmutable/lib/util/pipe';
import pipeWith from 'unmutable/lib/util/pipeWith';

let getValue = (_this: Parcel, notFoundValue: *): * => {
    let {value} = _this;
    return value === DeletedParcelMarker || typeof value === "undefined"
        ? notFoundValue
        : value;
};

export default (_this: Parcel) => ({

    // Spread Methods

    spread: (notFoundValue: ?* = undefined): Object => ({
        value: getValue(_this, notFoundValue),
        onChange: _this.onChange
    }),

    spreadDOM: (notFoundValue: ?* = undefined): Object => ({
        value: getValue(_this, notFoundValue),
        onChange: _this.onChangeDOM
    }),

    // Composition methods

    pipe: (...updaters: ParcelUpdater[]): Parcel => {
        updaters.forEach(Types(`pipe()`, `all updaters`, `function`));
        return pipeWith(
            _this,
            ...pipeWith(
                updaters,
                map(updater => pipe(
                    updater,
                    Types(`pipe()`, `the result of all functions`, `parcel`)
                ))
            )
        );
    },

    // Side-effect methods

    log: (name: string): Parcel => {
        if(process.env.NODE_ENV !== 'production') {
            _this._log = true;
            _this._logName = name;
            console.log(`Parcel: "${name}" data down:`); // eslint-disable-line
            console.log(_this.data); // eslint-disable-line
        }
        return _this;
    },

    spy: (sideEffect: Function): Parcel => {
        Types(`spy()`, `sideEffect`, `function`)(sideEffect);
        sideEffect(_this);
        return _this;
    },

    spyChange: (sideEffect: Function): Parcel => {
        Types(`spyChange()`, `sideEffect`, `function`)(sideEffect);
        return _this._create({
            id: _this._id.pushModifier('sc'),
            updateChangeRequestOnDispatch: (changeRequest: ChangeRequest): ChangeRequest => {
                let basedChangeRequest = changeRequest._create({
                    prevData: _this.data
                });
                sideEffect(basedChangeRequest);
                return changeRequest;
            }
        });
    }
});
