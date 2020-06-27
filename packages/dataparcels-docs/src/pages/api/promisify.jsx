// @flow
import React from 'react';
import Page from 'component/Page';
import {ContentNav} from 'dcme-style';
import PromisifyMarkdown from 'mdx/api/promisify.mdx';
import {apiNav} from 'nav/apiNav';

export default () => <Page>
    <ContentNav
        pageTop
        pageBottom
        mdxHeading
        nav={apiNav}
        pageNav={[
            '# promisify',
            'Example',
            '# Params',
            'key',
            'effect',
            'last',
            '# Result meta'
        ]}
    >
        <PromisifyMarkdown />
    </ContentNav>
</Page>;
