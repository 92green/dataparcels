// @flow
import type {
    Key,
    Index
} from '../types/Types';

type ActionData = {
    type?: string,
    payload?: Object,
    keyPath?: Array<Key|Index>
};

export default class Action {
    type: string = "";
    payload: Object = {};
    keyPath: Array<Key|Index> = [];

    constructor(actionData: ActionData = {}) {
        this.type = actionData.type || this.type;
        this.payload = actionData.payload || this.payload;
        this.keyPath = actionData.keyPath || this.keyPath;
    }

    _unget = (key: Key|Index): Action => {
        let {type, payload, keyPath} = this;
        return new Action({
            type,
            payload,
            keyPath: [key, ...keyPath]
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
