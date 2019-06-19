// @flow
import React from 'react';
import Layout from 'layout/Layout';
import ContentNav from 'shape/ContentNav';
import UseParcelBufferMarkdown from 'pages/api/useParcelBuffer.mdx';

export default () => <Layout>
    <ContentNav
        content={() => <UseParcelBufferMarkdown />}
        pageNav={[
            '# useParcelBuffer',
            '# Params',
            'parcel',
            'buffer',
            'debounce',
            'beforeChange',
            '# Returns',
            'innerParcel',
            'control',
            '# ParcelHookControl'
        ]}
    />
</Layout>;
