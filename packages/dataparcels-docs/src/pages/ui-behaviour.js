// @flow
import type {Node} from 'react';
import React from 'react';
import {Fragment} from 'react';
import {Wrapper} from 'dcme-style';
import {Typography} from 'dcme-style';
import {Text} from 'dcme-style';
import {NavigationList} from 'dcme-style';
import {NavigationListItem} from 'dcme-style';
import Markdown from 'pages/ui-behaviour.md';
import PageLayout from 'component/PageLayout';
import Link from 'component/Link';
import FeaturesNavigation from 'component/FeaturesNavigation';

export default () => <PageLayout
    modifier="marginBottom"
    content={() => <Typography><Markdown /></Typography>}
    nav={() => <Fragment>
        <FeaturesNavigation />
        <NavigationList modifier="margin">
            <NavigationListItem>UI behaviour</NavigationListItem>
        </NavigationList>
        <NavigationList>
            <NavigationListItem>- <Link to="/ui-behaviour#Submit-buttons-and-autosave">Submit buttons and autosave</Link></NavigationListItem>
            <NavigationListItem>- <Link to="/ui-behaviour#Validation-on-user-input">Validation on user input</Link></NavigationListItem>
            <NavigationListItem>- <Link to="/ui-behaviour#Confirmation">Confirmation</Link></NavigationListItem>
            <NavigationListItem>- <Link to="/ui-behaviour#Selections">Selections</Link></NavigationListItem>
            <NavigationListItem>- <Link to="/ui-behaviour#Drag-and-drop-sorting">Drag and drop sorting</Link></NavigationListItem>
            <NavigationListItem>- <Link to="/ui-behaviour#Debouncing-changes">Debouncing changes</Link></NavigationListItem>
            <NavigationListItem>- <Link to="/ui-behaviour#Pure-rendering">Pure rendering</Link></NavigationListItem>
        </NavigationList>
    </Fragment>}
/>;
