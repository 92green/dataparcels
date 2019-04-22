// @flow
import React from 'react';
import Markdown from 'pages/examples/parcelboundary-forceUpdate.md';
import Example from 'component/Example';
import Layout from 'layouts/Layout';

export default () => <Layout>
    <Example
        name="ParcelBoundary: Using forceUpdate"
        md={Markdown}
    />
</Layout>
