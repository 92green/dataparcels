// @flow
import React from 'react';
import Page from 'component/Page';
import {ContentNav} from 'dcme-style';
import ValidationMarkdown from 'mdx/api/validation.mdx';
import {apiNav} from 'nav/apiNav';

export default () => <Page>
    <ContentNav
        pageTop
        pageBottom
        mdxHeading
        nav={apiNav}
        pageNav={[
            '# validation',
            'Arguments',
            'Match paths',
            'Validation rules',
            'Returns',
            'Meta'
        ]}
    >
        <ValidationMarkdown />
    </ContentNav>
</Page>;
