// @flow
import React from 'react';
import Layout from 'layout/Layout';
import ContentNav from 'shape/ContentNav';
import ValidationMarkdown from 'pages/api/validation.mdx';

export default () => <Layout>
    <ContentNav
        content={() => <ValidationMarkdown />}
        pageNav={[
            '# validation',
            'Arguments',
            'Match paths',
            'Validation rules',
            'Returns',
            'Meta'
        ]}
    />
</Layout>;
