// @flow
import React from 'react';
import Layout from 'layout/Layout';
import ContentNav from 'shape/ContentNav';
import UseParcelStateMarkdown from 'pages/api/useParcelState.mdx';

export default () => <Layout>
    <ContentNav
        content={() => <UseParcelStateMarkdown />}
        pageNav={[
            '# useParcelState',
            '# Params',
            'value',
            'updateValue',
            'rebase',
            'onChange',
            'onChangeUseResult',
            'beforeChange',
            '# Returns',
            'parcel',
            'parcelControl',
            '# ParcelHookControl',
            'valueStatus',
            'changeStatus'
        ]}
    />
</Layout>;
