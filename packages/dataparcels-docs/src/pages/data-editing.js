// @flow
import React from 'react';
import Layout from 'layout/Layout';
import ContentNav from 'shape/ContentNav';
import DataEditingMarkdown from './data-editing.mdx';

export default () => <Layout>
    <ContentNav
        content={() => <DataEditingMarkdown />}
        pageNav={[
            '# Data editing',
            'Editing collections',
            'Indexed data types',
            '# Modifying data to fit the UI',
            'Restricting input characters',
            'Number to string',
            'Compensating for missing values',
            'Editing strings as arrays',
            '# Derived data',
            'Deriving a value',
            'Deriving meta',
            '# Advanced usage',
            'Fields that interact with each other',
            'Managing your own Parcel state',
            '# Next'
        ]}
    />
</Layout>;
