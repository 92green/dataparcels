// @flow
import React from "react";
import {NavigationList, NavigationListItem} from 'dcme-style';
import Link from 'component/Link';

type Props = {
    default?: string,
    name: string,
    optional?: boolean,
    type: string
};

export default () => <NavigationList modifier="margin">
    <NavigationListItem>
        <Link to="/">Dataparcels</Link>
    </NavigationListItem>
    <NavigationListItem>
        <a className="Link" href="https://github.com/blueflag/dataparcels">Github</a>
    </NavigationListItem>
</NavigationList>;
