// @flow
import type {
    Key,
    Index
} from '../types/Types';

type ActionData = {
    type?: string,
    payload?: *,
    keyPath?: Array<Key|Index>
};

export default class Action {
    type: ?string;
    payload: * = {};
    keyPath: Array<Key|Index> = [];

    constructor(actionData: ActionData) {
        this.type = actionData.type || this.type;
        this.payload = actionData.payload || this.payload;
        this.keyPath = actionData.keyPath || this.keyPath;
    }

    _unget = (key: Key|Index): Action => {
        return new Action({
            keyPath: [key, ...this.keyPath]
        });
    };

    shouldBeSynchronous = (): boolean => {
        return this.type === "ping";
    };

    toJS = (): ActionData => {
        let {type, payload, keyPath} = this;
        return {type, payload, keyPath};
    };
}
