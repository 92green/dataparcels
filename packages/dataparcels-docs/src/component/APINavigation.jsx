// @flow
import React from "react";
import {NavigationList, NavigationListItem, Text} from 'dcme-style';
import Link from 'component/Link';

export default () => <NavigationList>
    <NavigationListItem><Link to="/api">Api</Link></NavigationListItem>
    <NavigationListItem>- <Link to="/api/Parcel">Parcel</Link></NavigationListItem>
    <NavigationListItem>- <Link to="/api/useParcelState">useParcelState</Link></NavigationListItem>
    <NavigationListItem>- <Link to="/api/useParcelBuffer">useParcelBuffer</Link></NavigationListItem>
    <NavigationListItem>- <Link to="/api/ParcelBoundary">ParcelBoundary</Link></NavigationListItem>
    <NavigationListItem>- <Link to="/api/ParcelShape">ParcelShape</Link></NavigationListItem>
    <NavigationListItem>- <Link to="/api/ChangeRequest">ChangeRequest</Link></NavigationListItem>
    <NavigationListItem>- <Link to="/api/CancelActionMarker">CancelActionMarker</Link></NavigationListItem>
    <NavigationListItem>- <Link to="/api/shape">shape</Link></NavigationListItem>
    <NavigationListItem>- <Link to="/api/ParcelHoc">ParcelHoc</Link></NavigationListItem>
    <NavigationListItem>- <Link to="/api/ParcelBoundaryHoc">ParcelBoundaryHoc</Link></NavigationListItem>
</NavigationList>;
