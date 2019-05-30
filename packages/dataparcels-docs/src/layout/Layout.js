// @flow
import type {Node} from "react";

import React from "react";
import Helmet from "react-helmet";
import {Head, Wrapper} from 'dcme-style';
import {IsRenderingStaticHtml} from 'dcme-gatsby';
import Parcel from 'react-dataparcels';

import "./index.scss";

type Props = {
    children: *
};

if(!IsRenderingStaticHtml()) {
    window.Parcel = Parcel;
}

export default ({children}: Props): Node => <div>
    <Helmet>
        <meta charSet="utf-8" />
        <title>Dataparcels</title>
        <meta name="description" content="A library for editing data structures that works really well with React." />
    </Helmet>
    <Head />
    {children}
</div>;
