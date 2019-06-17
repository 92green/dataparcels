// @flow
import React from 'react';
import Layout from 'layout/Layout';
import ContentNav from 'shape/ContentNav';
import RekeyMarkdown from 'pages/api/rekey.mdx';

export default () => <Layout>
    <ContentNav
        content={() => <RekeyMarkdown />}
        pageNav={[
            '# rekey'
        ]}
    />
</Layout>;
