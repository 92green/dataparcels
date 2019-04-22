// @flow
import type {Node} from 'react';
import React from 'react';
import ApiPage from 'component/ApiPage';
import Markdown_ChangeRequest from 'docs/api/changeRequest/ChangeRequest.md';
import Layout from 'layouts/Layout';

const md = {
    _desc: Markdown_ChangeRequest
}

const api = `
# Properties
prevData
nextData
originId
originPath
actions

# Methods
merge()
getDataIn()
hasValueChanged()
toJS()
`;

export default () => <Layout>
    <ApiPage
        name="ChangeRequest"
        api={api}
        md={md}
    />
</Layout>
