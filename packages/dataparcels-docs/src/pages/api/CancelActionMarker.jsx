// @flow
import type {Node} from 'react';
import React from 'react';
import ApiPage from 'component/ApiPage';
import Markdown_CancelActionMarker from 'docs/api/cancelActionMarker/CancelActionMarker.md';
import Layout from 'layouts/Layout';

const md = {
    _desc: Markdown_CancelActionMarker
}

const api = ``;

export default () => <Layout>
    <ApiPage
        name="CancelActionMarker"
        api={api}
        md={md}
    />
</Layout>
