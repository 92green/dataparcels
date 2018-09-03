// @flow
import type {Node} from 'react';
import React from 'react';
import {NavigationList, NavigationListItem, Typography} from 'dcme-style';
import Markdown from 'pages/api/ParcelHoc.md';
import PageLayout from 'component/PageLayout';

export default () => <PageLayout
    content={() => <Typography><Markdown /></Typography>}
    nav={() => <NavigationList>
        <NavigationListItem>ParcelHoc</NavigationListItem>
    </NavigationList>}
/>;