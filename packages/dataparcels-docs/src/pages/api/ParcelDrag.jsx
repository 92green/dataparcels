// @flow
import React from 'react';
import Layout from 'layout/Layout';
import ContentNav from 'shape/ContentNav';
import DragMarkdown from 'pages/api/ParcelDrag.mdx';

export default () => <Layout>
    <ContentNav
        content={() => <DragMarkdown />}
        pageNav={[
            '# ParcelDrag',
            '# Children',
            'childRenderer',
            '# Props',
            'parcel',
            'container',
            '...sortableElementProps'
        ]}
    />
</Layout>;
