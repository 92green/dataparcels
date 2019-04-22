// @flow
import React from 'react';
import Markdown from 'pages/examples/parcelhoc-valuefromprops.md';
import Example from 'component/Example';
import Layout from 'layouts/Layout';

export default () => <Layout>
    <Example
        name="ParcelHoc: Getting valueFromProps from props"
        md={Markdown}
    />
</Layout>
