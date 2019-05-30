// @flow
import React from 'react';
import Layout from 'layout/Layout';
import ContentNav from 'shape/ContentNav';
import UIBehaviourMarkdown from './ui-behaviour.mdx';

export default () => <Layout>
    <ContentNav
        content={() => <UIBehaviourMarkdown />}
        pageNav={[
            '# UI behaviour',
            'Submitting forms',
            'Autosaving forms',
            'Validation on user input',
            'Confirmation',
            'Selections',
            'Drag and drop sorting',
            'Debouncing changes',
            'Pure rendering'
        ]}
    />
</Layout>;
