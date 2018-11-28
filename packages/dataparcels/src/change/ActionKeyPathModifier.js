// @flow
import type {Index} from '../types/Types';
import type {Key} from '../types/Types';

import push from 'unmutable/lib/push';
import unshift from 'unmutable/lib/unshift';

type ActionKeyPathModifierData = {
    key?: Key|Index,
    pre?: Function[],
    post?: Function[]
};

export default class ActionKeyPathModifier {
    key: ?Key|Index;
    pre: Function[] = [];
    post: Function[] = [];

    constructor({key, pre, post}: ActionKeyPathModifierData = {}) {
        this.key = key !== undefined ? key : this.key;
        this.pre = pre || this.pre;
        this.post = post || this.post;
    }

    _create = (create: ActionKeyPathModifierData): ActionKeyPathModifier => {
        // $FlowFixMe
        return new ActionKeyPathModifier({
            ...this.toJS(),
            ...create
        });
    };

    _addKey = (key: Key|Index): ActionKeyPathModifier => {
        return this._create({
            key
        });
    };

    _addPre = (pre: Function): ActionKeyPathModifier => {
        return this._create({
            pre: unshift(pre)(this.pre)
        });
    };

    _addPost = (post: Function): ActionKeyPathModifier => {
        return this._create({
            post: push(post)(this.post)
        });
    };

    toJS = (): any => {
        let {key, pre, post} = this;
        return {key, pre, post};
    };
}
