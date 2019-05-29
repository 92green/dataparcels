// @flow
import React from 'react';
import Layout from 'layout/Layout';
import ContentNav from 'shape/ContentNav';
import ChangeRequestMarkdown from 'pages/api/ChangeRequest.mdx';

export default () => <Layout>
    <ContentNav
        content={() => <ChangeRequestMarkdown />}
        pageNav={[
            '# ChangeRequest',
            '# Properties',
            'prevData',
            'nextData',
            'originId',
            'originPath',
            'actions',
            '# Methods',
            'hasValueChanged()',
            'getDataIn()',
            'toJS()',
            'merge()'
        ]}
    />
</Layout>;
