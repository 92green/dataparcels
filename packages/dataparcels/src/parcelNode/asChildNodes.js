// @flow
import asNode from './asNode';
export default (updater: Function) => asNode(node => node.update(updater));
