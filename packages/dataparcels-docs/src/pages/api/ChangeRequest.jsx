// @flow
import type {Node} from 'react';
import React from 'react';
import ApiPage from 'component/ApiPage';
import Markdown_ChangeRequest from 'docs/api/changeRequest/ChangeRequest.md';

const md = {
    _desc: Markdown_ChangeRequest
}

const api = `
# Properties
prevData
nextData
changeRequestMeta
originId
originPath

# Methods
setChangeRequestMeta()
actions()
updateActions()
merge()
getDataIn()
hasValueChanged()
toJS()
toConsole()
`;

export default () => <ApiPage
    name="ChangeRequest"
    api={api}
    md={md}
/>;
