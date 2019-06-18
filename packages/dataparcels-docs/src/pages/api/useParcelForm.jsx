// @flow
import React from 'react';
import Layout from 'layout/Layout';
import ContentNav from 'shape/ContentNav';
import UseParcelFormMarkdown from 'pages/api/useParcelForm.mdx';

export default () => <Layout>
    <ContentNav
        content={() => <UseParcelFormMarkdown />}
        pageNav={[
            '# useParcelForm',
            '# Params',
            'value',
            'updateValue',
            'onChange',
            'onChangeUseResult',
            'buffer',
            'debounce',
            'validation',
            'beforeChange',
            '# Returns',
            'parcel',
            'parcelControl',
            '# ParcelHookControl'
        ]}
    />
</Layout>;
