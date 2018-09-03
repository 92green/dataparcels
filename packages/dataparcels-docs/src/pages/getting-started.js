// @flow
import type {Node} from 'react';
import React from 'react';
import {Wrapper, Text, Typography} from 'dcme-style';
import GettingStartedMarkdown from 'pages/getting-started.md';
import PageLayout from 'component/PageLayout';

export default () => <PageLayout
    content={() => <Typography><GettingStartedMarkdown /></Typography>}
/>;
