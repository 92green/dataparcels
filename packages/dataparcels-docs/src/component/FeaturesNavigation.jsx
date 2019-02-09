// @flow
import React from "react";
import {NavigationList} from 'dcme-style';
import {NavigationListItem} from 'dcme-style';
import Link from './Link';

export default () => <NavigationList>
    <NavigationListItem><Link to="/#Features">Features</Link></NavigationListItem>
    <NavigationListItem>- <Link to="/data-editing">Data editing</Link></NavigationListItem>
    <NavigationListItem>- <Link to="/ui-behaviour">UI behaviour</Link></NavigationListItem>
    <NavigationListItem>- <Link to="/data-synchronisation">Data synchronisation</Link></NavigationListItem>
</NavigationList>;
