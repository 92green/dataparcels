// @flow
import type {Node} from 'react';
import React from 'react';
import Class from 'component/Class';
import Markdown_ChangeRequest from 'docs/api/changeRequest/ChangeRequest.md';

const md = {
    _desc: Markdown_ChangeRequest
}

const api = `
# Properties
value
meta
data
changeRequestMeta
originId
originPath

# Methods
setChangeRequestMeta()
actions()
updateActions()
merge()
toJS()

`;

export default () => <Class
    name="ChangeRequest"
    api={api}
    md={md}
/>;
