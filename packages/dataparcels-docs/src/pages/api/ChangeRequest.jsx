// @flow
import React from 'react';
import Page from 'component/Page';
import {ContentNav} from 'dcme-style';
import ChangeRequestMarkdown from 'mdx/api/ChangeRequest.mdx';
import {apiNav} from 'nav/apiNav';

export default () => <Page>
    <ContentNav
        pageTop
        pageBottom
        mdxHeading
        nav={apiNav}
        pageNav={[
            '# ChangeRequest',
            '# Properties',
            'prevData',
            'nextData',
            'originId',
            'originPath',
            'actions',
            '# Methods',
            'hasValueChanged',
            'hasDataChanged',
            'getDataIn',
            'merge'
        ]}
    >
        <ChangeRequestMarkdown />
    </ContentNav>
</Page>;
