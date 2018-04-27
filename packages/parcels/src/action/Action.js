// @flow
import type {
    Key,
    Index
} from '../types/Types';

type ActionData = {
    type: string,
    payload?: Object,
    keyPath?: Array<Key|Index>
};

export default class Action {
    type: string;
    payload: ?Object;
    keyPath: Array<Key|Index>;

    constructor(actionData: ActionData) {
        this.type = actionData.type;
        this.payload = actionData.payload || {};
        this.keyPath = actionData.keyPath || [];
    }

    toJS(): Object {
        let {type, payload, keyPath} = this;
        return {type, payload, keyPath};
    }
}
