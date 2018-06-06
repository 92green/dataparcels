// @flow
import type {ModifierFunction} from '../types/Types';
import Modifiers from '../modifiers/Modifiers';
import {stringifyPath} from '../parcelId/ParcelId';

class TreeshareParcelRegistry {
    _registry: Object = {};
    _registryOrder: string[] = [];

    get = (id: string): Object => {
        return this._registry[id];
    };

    list = (): Object[] => {
        return this
            ._registryOrder
            .map(id => this._registry[id]);
    };

    set = (id: string, reference: Object) => {
        if(!this._registry[id]) {
            this._registryOrder.push(id);
        }
        this._registry[id] = reference;
    };
}

class TreeshareDispatchRegistry {
    _dispatchedPaths: Object = {};

    hasPathDispatched = (path: string[]): boolean => {
        return !!this._dispatchedPaths[stringifyPath(path)];
    };

    markPathAsDispatched = (path: string[]) => {
        this._dispatchedPaths[stringifyPath(path)] = true;
    };
}


export default class Treeshare {
    _debugRender: boolean = false;
    _preModifier: Modifiers = new Modifiers();
    registry: Object = new TreeshareParcelRegistry();
    dispatch: Object = new TreeshareDispatchRegistry();

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
