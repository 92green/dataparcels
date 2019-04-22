// @flow
import type {Node} from 'react';
import React from 'react';
import {Fragment} from 'react';
import {Wrapper} from 'dcme-style';
import {Typography} from 'dcme-style';
import {Text} from 'dcme-style';
import {NavigationList} from 'dcme-style';
import {NavigationListItem} from 'dcme-style';
import Markdown from 'pages/data-synchronisation.md';
import Layout from 'layouts/Layout';
import PageLayout from 'component/PageLayout';
import Link from 'component/Link';
import FeaturesNavigation from 'component/FeaturesNavigation';

export default () => <Layout>
    <PageLayout
        modifier="marginBottom"
        content={() => <Typography><Markdown /></Typography>}
        nav={() => <Fragment>
            <FeaturesNavigation />
            <NavigationList modifier="margin">
                <NavigationListItem>Data synchronisation</NavigationListItem>
            </NavigationList>
            <NavigationList>
                <NavigationListItem>- <Link to="/data-synchronisation#ParcelHoc-as-a-slave">ParcelHoc as a slave</Link></NavigationListItem>
                <NavigationListItem>- <Link to="/data-synchronisation#Sending-failable-requests">Sending failable requests</Link></NavigationListItem>
                <NavigationListItem>- <Link to="/data-synchronisation#Sending-partial-requests">Sending partial requests</Link></NavigationListItem>
                <NavigationListItem>- <Link to="/data-synchronisation#Caching-unsaved-changes">Caching unsaved changes</Link></NavigationListItem>
                <NavigationListItem>- <Link to="/data-synchronisation#Retaining-Parcel-keys">Retaining Parcel keys</Link></NavigationListItem>
            </NavigationList>
        </Fragment>}
    />
</Layout>
