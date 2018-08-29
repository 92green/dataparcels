// @flow
import type {Node} from 'react';
import React from 'react';
import {Box, Text, Typography} from 'dcme-style';
import IndexMarkdown from 'pages/index.md';
import PageLayout from 'component/PageLayout';

export default () => <PageLayout
    content={() => <Typography><IndexMarkdown /></Typography>}
/>;
