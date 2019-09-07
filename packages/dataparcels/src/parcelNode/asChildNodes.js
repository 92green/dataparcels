// @flow
import asNode from './asNode';
export default (updater: Function) => {
    let fn = asNode(node => node.update(updater));
    fn._updater = updater;
    return fn;
};
