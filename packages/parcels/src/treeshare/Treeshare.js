// @flow
import type {ModifierFunction} from '../types/Types';
import Modifiers from '../modifiers/Modifiers';

import filter from 'unmutable/lib/filter';
import keyArray from 'unmutable/lib/keyArray';
import map from 'unmutable/lib/map';
import reduce from 'unmutable/lib/reduce';
import pipeWith from 'unmutable/lib/util/pipeWith';

class TreeshareRegistry {
    _registry: Object = {};
    _registryOrder: string[] = [];
    _registryLeaves: Object = {};

    _updateLeaves = () => {
        this._registryLeaves = pipeWith(
            this._registryLeaves,
            keyArray(),
            ii => ii.sort((a: string, b: string): number => {
                let alen = a.length;
                let blen = b.length;
                if (alen < blen) return 1;
                else if (alen > blen) return -1;
                return 0;
            }),
            reduce((leaves: string[], id: string): string[] => {
                if(leaves.some(leaf => leaf.startsWith(id))) {
                    return leaves;
                }
                leaves.push(id);
                return leaves;
            }, []),
            reduce((leaves: Object, id: string): Object => {
                leaves[id] = true;
                return leaves;
            }, {})
        );
    };

    get = (id: string): Object => {
        return this._registry[id];
    };

    leaves = (beneath: ?string): Object[] => {
        return pipeWith(
            this._registryOrder,
            filter(id => this._registryLeaves[id]),
            beneath
                ? filter(id => id.startsWith(beneath))
                : ii => ii,
            map(id => this._registry[id])
        );
    };

    list = (): Object[] => {
        return this
            ._registryOrder
            .map(id => this._registry[id]);
    };

    set = (id: string, reference: Object) => {
        if(!this._registry[id]) {
            this._registryOrder.push(id);
            this._registryLeaves[id] = true;
            this._updateLeaves();
        }
        this._registry[id] = reference;
    };
}

export default class Treeshare {
    _debugRender: boolean = false;
    _preModifier: Modifiers = new Modifiers();
    registry: Object = new TreeshareRegistry();

    constructor({debugRender}: Object) {
        this._debugRender = debugRender;
    }

    getDebugRender: Function = (): boolean => {
        return this._debugRender;
    }

    hasPreModifier: Function = (): boolean => {
        return !this._preModifier.isEmpty();
    };

    getPreModifier: Function = (): Modifiers => {
        return this._preModifier;
    };

    setPreModifier: Function = (modifier: ModifierFunction) => {
        this._preModifier = this._preModifier.set([modifier]);
    };
}
