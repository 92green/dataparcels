//@flow
import React from "react";
import type {Node} from 'react';
import Link from 'gatsby-link';

import {
    NavigationList,
    NavigationListItem,
    Text
} from 'dcme-style';

const NavItem = (props: Object): Node => <NavigationListItem>
    <Link to={props.to} className="Link">{props.children}</Link>
</NavigationListItem>;

const NavHeading = (props: Object) => <NavigationListItem><Text modifier="weightMilli">{props.children}</Text></NavigationListItem>;

export default (): Node => {

    return <NavigationList>
        <NavItem to="/">Home</NavItem>
        <NavItem to="/examples">Examples</NavItem>

        <NavHeading>API</NavHeading>
        <NavItem to="/api/EntityApi">EntityApi</NavItem>
        <NavItem to="/api/EntityQueryHock">EntityQueryHock</NavItem>
        <NavItem to="/api/EntityMutationHock">EntityMutationHock</NavItem>

        <NavHeading>Misc</NavHeading>
        <NavItem to="/types">All Types</NavItem>
    </NavigationList>;
}

