// @flow
import React from 'react';
import Markdown from 'pages/examples/parcelhoc-example.md';
import Example from 'component/Example';
import Layout from 'layouts/Layout';

export default () => <Layout>
    <Example
        name="ParcelHoc example"
        md={Markdown}
    />
</Layout>
