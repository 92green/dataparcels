// @flow
import React from 'react';
import {styled} from 'dcme-style/core';

export default styled((props) => <img {...props} />)`
    display: none !important;
    float: right;
    width: 30%;
    margin-top: -2rem;
    margin-bottom: 0;
    margin-left: 1rem;

    @media (min-width: ${props => props.theme.breakpoints[2]}) {
        display: block !important;
    }
`;
