// @flow
import type {Node} from 'react';
import React from 'react';
import Class from 'component/Class';
import Markdown_Action from 'docs/api/action/Action.md';

const md = {
    _desc: Markdown_Action
}

const api = `
# Methods
shouldBeSynchronous()
isValueAction()
isMetaAction()
toJS()
`;

export default () => <Class
    name="Action"
    api={api}
    md={md}
/>;
