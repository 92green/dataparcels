// @flow
import React from 'react';
import Layout from 'layout/Layout';
import ContentNav from 'shape/ContentNav';
import ParcelUpdatersMarkdown from 'pages/parcel-updaters.mdx';

export default () => <Layout>
    <ContentNav
        content={() => <ParcelUpdatersMarkdown />}
        pageNav={[
            '# Value Updaters',
            'Simple updaters',
            'asNode',
            'asChildNodes',
            'asShape'
        ]}
    />
</Layout>;
