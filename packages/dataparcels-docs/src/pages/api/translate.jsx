// @flow
import React from 'react';
import Page from 'component/Page';
import {ContentNav} from 'dcme-style';
import CancelMarkdown from 'mdx/api/translate.mdx';
import {apiNav} from 'nav/apiNav';

export default () => <Page>
    <ContentNav
        pageTop
        pageBottom
        mdxHeading
        nav={apiNav}
        pageNav={[
            '# translate',
            'Example',
            '# Params',
            'down',
            'up',
            'preserve'
        ]}
    >
        <CancelMarkdown />
    </ContentNav>
</Page>;
