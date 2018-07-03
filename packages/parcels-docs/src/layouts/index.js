// @flow
import React from "react";
import type {Node} from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import {Wrapper} from 'dcme-style';
import Navigation from '../components/Navigation';
import {Column, Grid, Head} from 'dcme-style';

import "./index.scss";

function TemplateWrapper(props: Object): Node {
    const {
        children,
        wrapper = true
    } = props;

    const {allSitePage} = props.data;
    return <div>
        <Helmet
            title="Parcels"
            meta={[
                //{name: "description", content: "Sample"},
                //{name: "keywords", content: "sample, something"}
            ]}
        />
        <Head />
        <Grid modifier="auto">
            <Column modifier="shrink padding">
                <Navigation allSitePage={allSitePage}/>
            </Column>
            <Column modifier="padding">
                {wrapper
                    ? <Wrapper>{children()}</Wrapper>
                    : children()
                }
            </Column>
        </Grid>
    </div>;
}


export const query = graphql`
    query NavigationQuery {
      allSitePage {
        edges {
          node {
            id
            path
          }
        }
      }
    }
`;

TemplateWrapper.propTypes = {
    children: PropTypes.func
};

export default TemplateWrapper;
