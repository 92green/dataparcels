// @flow
import type {Node} from 'react';
import React from 'react';
import {Fragment} from 'react';
import {Wrapper} from 'dcme-style';
import {Typography} from 'dcme-style';
import {Text} from 'dcme-style';
import {NavigationList} from 'dcme-style';
import {NavigationListItem} from 'dcme-style';
import Markdown from 'pages/data-editing.md';
import PageLayout from 'component/PageLayout';
import Link from 'component/Link';
import FeaturesNavigation from 'component/FeaturesNavigation';

export default () => <PageLayout
    modifier="marginBottom"
    content={() => <Typography><Markdown /></Typography>}
    nav={() => <Fragment>
        <FeaturesNavigation />
        <NavigationList modifier="margin">
            <NavigationListItem>Data editing</NavigationListItem>
        </NavigationList>
        <NavigationList>
            <NavigationListItem>- <Link to="/data-editing#">Data editing</Link></NavigationListItem>
            <NavigationListItem>- <Link to="/data-editing#Indexed-data-types">Indexed data types</Link></NavigationListItem>
            <NavigationListItem>- <Link to="/data-editing#Modifying-data-to-fit-the-UI">Modifying data to fit the UI</Link></NavigationListItem>
            <NavigationListItem>- <Link to="/data-editing#Derived-data">Derived data</Link></NavigationListItem>
            <NavigationListItem>- <Link to="/data-editing#Fields-that-interact-with-each-other">Fields that interact with each other</Link></NavigationListItem>
            <NavigationListItem>- <Link to="/data-editing#Managing-your-own-Parcel-state">Managing your own Parcel state</Link></NavigationListItem>
        </NavigationList>
    </Fragment>}
/>;
