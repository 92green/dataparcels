// @flow
import {styled} from 'dcme-style/core';

export default styled.div`
    background-color: ${props => props.theme.colors.bgAlt};
    padding: 1rem;
    margin-bottom: 1rem;
    font-size: ${props => props.theme.fontSizes.s};
`;
