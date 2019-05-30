// @flow
import React from 'react';
import Layout from 'layout/Layout';
import ContentNav from 'shape/ContentNav';
import ParcelTypesMarkdown from 'pages/parcel-types.mdx';

export default () => <Layout>
    <ContentNav
        content={() => <ParcelTypesMarkdown />}
        pageNav={[
            '# Parcel Types',
            'ParentParcel',
            'ChildParcel',
            'IndexedParcel',
            'ElementParcel',
            'TopLevelParcel'
        ]}
    />
</Layout>;
