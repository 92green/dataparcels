// @flow
import React from 'react';
import {NavigationList} from 'dcme-style';
import {NavigationListItem} from 'dcme-style';
import {ContentNav} from 'dcme-style';
import {Link} from 'dcme-gatsby';

const nav = () => <NavigationList>
    <NavigationListItem><Link to="/">Dataparcels</Link></NavigationListItem>
    <NavigationListItem><Link to="/getting-started">Getting started</Link></NavigationListItem>
    <NavigationListItem modifier="section">Features</NavigationListItem>
    <NavigationListItem><Link to="/data-editing">Data editing</Link></NavigationListItem>
    <NavigationListItem><Link to="/ui-behaviour">UI behaviour</Link></NavigationListItem>
    <NavigationListItem><Link to="/data-synchronisation">Data synchronisation</Link></NavigationListItem>
    <NavigationListItem modifier="section">API</NavigationListItem>
    <NavigationListItem><Link to="/api/Parcel">Parcel</Link></NavigationListItem>
    <NavigationListItem><Link to="/api/ParcelBoundary">ParcelBoundary</Link></NavigationListItem>
    <NavigationListItem><Link to="/api/useParcelForm">useParcelForm</Link></NavigationListItem>
    <NavigationListItem><Link to="/api/useParcelState">useParcelState</Link></NavigationListItem>
    <NavigationListItem><Link to="/api/validation">validation</Link></NavigationListItem>
    <NavigationListItem><Link to="/api/ParcelDrag">ParcelDrag</Link></NavigationListItem>
    <NavigationListItem><Link to="/api">more...</Link></NavigationListItem>
    <NavigationListItem modifier="section">Concepts</NavigationListItem>
    <NavigationListItem><Link to="/parcel-keys">Parcel keys</Link></NavigationListItem>
    <NavigationListItem><Link to="/parcel-meta">Parcel meta</Link></NavigationListItem>
    <NavigationListItem><Link to="/parcel-types">Parcel types</Link></NavigationListItem>
    <NavigationListItem><Link to="/parcel-updaters">Parcel updaters</Link></NavigationListItem>
</NavigationList>;

export default (props) => <ContentNav nav={nav} {...props} />;
