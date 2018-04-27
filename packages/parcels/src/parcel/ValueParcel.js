// @flow
import type {ParcelData} from '../types/Types';
import type Parcel from './Parcel';
import stripParcelData from '../util/stripParcelData'; // TODO move to parcelData/strip
import ActionCreators from '../action/ActionCreators';

export default (_this: Parcel): Object => ({

    // get methods

    raw: (): ParcelData => {
        return _this._parcelData;
    },

    data: (): ParcelData => {
        return stripParcelData(_this._parcelData, {stripHandleChange: true});
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
    }
});