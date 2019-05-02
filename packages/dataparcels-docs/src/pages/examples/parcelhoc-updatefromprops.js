// @flow
import React from 'react';
import Markdown from 'pages/examples/parcelhoc-updatefromprops.md';
import Example from 'component/Example';
import Layout from 'layouts/Layout';

export default ({history, location}: *) => <Layout>
    <Example
        name="ParcelHoc updating from props"
        md={Markdown}
        history={history}
        location={location}
    />
</Layout>
