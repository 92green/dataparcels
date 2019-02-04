// @flow
import type {Node} from 'react';
import React from 'react';
import {Wrapper, Text, Typography} from 'dcme-style';
import Markdown from 'pages/data-editing.md';
import PageLayout from 'component/PageLayout';

export default () => <PageLayout
    modifier="marginBottom"
    content={() => <Typography><Markdown /></Typography>}
/>;
