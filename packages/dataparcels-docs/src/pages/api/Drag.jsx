// @flow
import React from 'react';
import Page from 'component/Page';
import {ContentNav} from 'dcme-style';
import DragMarkdown from 'mdx/api/Drag.mdx';
import {apiNav} from 'nav/apiNav';

export default () => <Page>
    <ContentNav
        pageTop
        pageBottom
        mdxHeading
        nav={apiNav}
        pageNav={[
            '# Drag',
            '# Children',
            'childRenderer',
            '# Props',
            'source',
            'container',
            '...sortableElementProps'
        ]}
    >
        <DragMarkdown />
    </ContentNav>
</Page>;
