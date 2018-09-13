// @flow
import type {Node} from 'react';
import React from 'react';
import ApiPage from 'component/ApiPage';
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

export default () => <ApiPage
    name="Action"
    api={api}
    md={md}
/>;
