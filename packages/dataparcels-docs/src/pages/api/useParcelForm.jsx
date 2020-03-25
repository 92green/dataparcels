// @flow
import React from 'react';
import Page from 'component/Page';
import {ContentNav} from 'dcme-style';
import UseParcelFormMarkdown from 'mdx/api/useParcelForm.mdx';
import {apiNav} from 'nav/apiNav';

export default () => <Page>
    <ContentNav
        pageTop
        pageBottom
        mdxHeading
        nav={apiNav}
        pageNav={[
            '# useParcelForm',
            '# Params',
            'value',
            'updateValue',
            'rebase',
            'onSubmit',
            'onSubmitUseResult',
            'buffer',
            'debounce',
            'validation',
            'beforeChange',
            '# Returns',
            'parcel',
            'parcelControl',
            '# ParcelHookControl',
            'submit',
            'reset',
            'buffered',
            'actions',
            'valueStatus',
            'submitStatus',
            '# Inside the hook'
        ]}
    >
        <UseParcelFormMarkdown />
    </ContentNav>
</Page>;
