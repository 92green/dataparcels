// @flow
import type {Node} from 'react';
import React from 'react';
import ApiPage from 'component/ApiPage';
import Markdown_ParcelBoundary from 'docs/api/parcelBoundary/ParcelBoundary.md';
//import Markdown_ParcelBoundaryAfter from 'docs/api/parcelBoundary/ParcelBoundaryAfter.md';
// import Markdown_name from 'docs/api/parcelBoundary/name.md';
// import Markdown_initialValue from 'docs/api/parcelBoundary/initialValue.md';
// import Markdown_delayUntil from 'docs/api/parcelBoundary/delayUntil.md';
// import Markdown_onChange from 'docs/api/parcelBoundary/onChange.md';
// import Markdown_pipe from 'docs/api/parcelBoundary/pipe.md';
// import Markdown_debugRender from 'docs/api/parcelBoundary/debugRender.md';

const md = {
    _desc: Markdown_ParcelBoundary
    // _after: Markdown_ParcelBoundaryAfter,
    // name: Markdown_name,
    // initialValue: Markdown_initialValue,
    // delayUntil: Markdown_delayUntil,
    // onChange: Markdown_onChange,
    // pipe: Markdown_pipe,
    // debugRender: Markdown_debugRender
}

const api = `
# Props
parcel
debounce
hold
forceUpdate
pure
debugBuffer
`;

export default () => <ApiPage
    name="ParcelBoundary"
    api={api}
    md={md}
/>;
