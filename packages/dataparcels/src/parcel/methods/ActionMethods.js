// @flow
import type Action from '../../change/Action';
import type Parcel from '../Parcel';
import type {ParcelData} from '../../types/Types';
import type {ParcelBatcher} from '../../types/Types';
import Types from '../../types/Types';

import ChangeRequest from '../../change/ChangeRequest';

export default (_this: Parcel): Object => ({

    dispatch: (dispatchable: Action|Action[]|ChangeRequest) => {
        Types(`dispatch()`, `dispatchable`, `dispatchable`)(dispatchable);


        let {
            _onDispatch,
            _onHandleChange
        } = _this;

        _this._treeshare.dispatch.markPathAsDispatched(_this.path);

        let changeRequest: ChangeRequest = dispatchable instanceof ChangeRequest
            ? dispatchable
            : new ChangeRequest(dispatchable);

        if(!changeRequest._originId) {
            changeRequest._originId = _this.id;
            changeRequest._originPath = _this.path;
        }

        if(_this._log) {
            console.log(`Parcel change: ${_this._logName}`);
            changeRequest.toConsole();
        }

        if(_this._dispatchBuffer) {
            _this._dispatchBuffer(changeRequest);
            return;
        }

        if(_onHandleChange) {
            let changeRequestWithBase = changeRequest._setBaseParcel(_this);
            let parcelWithChangedData = undefined;
            try {
                parcelWithChangedData = _this._create({
                    parcelData: changeRequestWithBase.data
                });
            } catch (e) {} /* eslint-disable-line */

            _onHandleChange(parcelWithChangedData, changeRequestWithBase);
            return;
        }
        _onDispatch && _onDispatch(changeRequest);
    },

    batch: (batcher: ParcelBatcher, changeRequest: ?ChangeRequest) => {
        Types(`batch()`, `batcher`, `function`)(batcher);

        let parcelData: ParcelData = _this._parcelData;
        let lastBuffer = _this._dispatchBuffer;

        let buffer = changeRequest
            ? changeRequest.updateActions(() => [])
            : new ChangeRequest();

        _this._dispatchBuffer = (changeRequest: ChangeRequest) => {
            buffer = buffer.merge(changeRequest);
            _this._parcelData = changeRequest
                ._setBaseParcel(_this)
                .data;
        };

        batcher(_this);
        _this._dispatchBuffer = lastBuffer;
        if(buffer.actions().length === 0) {
            return;
        }

        _this._parcelData = parcelData;
        _this.dispatch(buffer);
    }
});
