// @flow
import React from 'react';
import Page from 'component/Page';
import {ContentNav} from 'dcme-style';
import UseParcelStateMarkdown from 'mdx/api/useParcelState.mdx';
import {apiNav} from 'nav/apiNav';

export default () => <Page>
    <ContentNav
        pageTop
        pageBottom
        mdxHeading
        nav={apiNav}
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
    >
        <UseParcelStateMarkdown />
    </ContentNav>
</Page>;
