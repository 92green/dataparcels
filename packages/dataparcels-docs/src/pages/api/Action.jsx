// @flow
import type {Node} from 'react';
import React from 'react';
import ApiPage from 'component/ApiPage';
import Markdown_Action from 'docs/api/action/Action.md';
import Markdown_isValueAction from 'docs/api/action/isValueAction.md';
import Markdown_isMetaAction from 'docs/api/action/isMetaAction.md';
import Markdown_toJS from 'docs/api/action/toJS.md';

const md = {
    _desc: Markdown_Action,
    isValueAction: Markdown_isValueAction,
    isMetaAction: Markdown_isMetaAction,
    toJS: Markdown_toJS
}

const api = `
# Methods
isValueAction()
isMetaAction()
toJS()
`;

export default () => <ApiPage
    name="Action"
    api={api}
    md={md}
/>;
