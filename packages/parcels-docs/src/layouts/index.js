// @flow
import React from "react";
import type {Node} from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import {Wrapper} from 'obtuse';
import Navigation from '../components/Navigation';
import {Column, Grid} from 'obtuse';

import "./index.scss";

function TemplateWrapper(props: Object): Node {
    const {allSitePage} = props.data;
    return <div>
        <Helmet
            title="Parcels"
            meta={[
                //{name: "description", content: "Sample"},
                //{name: "keywords", content: "sample, something"}
            ]}
        />
        <Grid modifier="auto">
            <Column modifier="shrink padding">
                <Navigation allSitePage={allSitePage}/>
            </Column>
            <Column modifier="padding">
                <Wrapper>
                    {props.children()}
                </Wrapper>
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
