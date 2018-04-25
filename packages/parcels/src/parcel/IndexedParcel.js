// @flow

import ActionCreators from '../reducer/ActionCreators';
import CollectionParcel from './CollectionParcel';

export default class IndexedParcel extends CollectionParcel {

    //
    // public
    //

    // change methods

    delete: Function = (key: Key) => {
        this.dispatch(ActionCreators.delete(key));
    };

    insert: Function = (key: Key, value: Value) => {
        this.dispatch(ActionCreators.insert(key, value));
    };

    push: Function = (value: Value) => {
        this.dispatch(ActionCreators.push(value));
    };

    pop: Function = () => {
        this.dispatch(ActionCreators.pop());
    };

    shift: Function = () => {
        this.dispatch(ActionCreators.shift());
    };

    swap: Function = (keyA: Key, keyB: Key) => {
        this.dispatch(ActionCreators.swap(keyA, keyB));
    };

    swapNext: Function = (key: Key) => {
        this.dispatch(ActionCreators.swapNext(key));
    };

    swapPrev: Function = (key: Key) => {
        this.dispatch(ActionCreators.swapPrev(key));
    };

    unshift: Function = (value: Value) => {
        this.dispatch(ActionCreators.unshift(value));
    };
}
