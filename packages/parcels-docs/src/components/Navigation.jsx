//@flow
import React from "react";
import type {Node} from 'react';
import Link from 'gatsby-link';

import {ListItem} from 'obtuse';
import {Text} from 'obtuse';

export default function Navigation(): Node {

    function NavItem(props: Object): Node {
        return <ListItem>
            <Link to={props.to} className="Link">{props.children}</Link>
        </ListItem>;
    }

    const NavHeading = (props) => <ListItem style={{marginTop: '1rem'}}><Text modifier="muted">{props.children}</Text></ListItem>;

    return <ul className="Navigation">
        <NavHeading>Parcels</NavHeading>
        <NavItem to="/">Home</NavItem>
        <NavItem to="/examples">Examples</NavItem>
    </ul>;
}

