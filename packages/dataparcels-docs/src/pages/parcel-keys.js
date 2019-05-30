// @flow
import React from 'react';
import Layout from 'layout/Layout';
import ContentNav from 'shape/ContentNav';
import ParcelKeysMarkdown from 'pages/parcel-keys.mdx';

export default () => <Layout>
    <ContentNav
        content={() => <ParcelKeysMarkdown />}
        pageNav={[
            '# Parcel Keys',
            'Keyed parents',
            'Indexed parents'
        ]}
    />
</Layout>;
