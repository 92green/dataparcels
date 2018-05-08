// @flow
import type {ModifierFunction} from '../types/Types';
import Modifiers from '../modifiers/Modifiers';

class TreeshareRegistry {
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
        this._registry[id] = reference;
        this._registryOrder.push(id);
    };
}

export default class Treeshare {
    registry: Object = new TreeshareRegistry();
    preModifier: Modifiers = new Modifiers();

    hasPreModifier: Function = (): boolean => {
        return !this.preModifier.isEmpty();
    };

    setPreModifier: Function = (modifier: ModifierFunction) => {
        this.preModifier = this.preModifier.set([modifier]);
    };
}
