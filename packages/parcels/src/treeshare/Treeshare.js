// @flow
import type {ModifierFunction} from '../types/Types';
import Modifiers from '../modifiers/Modifiers';

class TreeshareRegistry {
    _registry: Object = {};

    get = (id: string): Object => {
        return this._registry[id];
    };

    set = (id: string, reference: Object) => {
        this._registry[id] = reference;
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
