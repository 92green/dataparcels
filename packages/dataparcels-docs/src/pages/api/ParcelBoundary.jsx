// @flow
import type {Node} from 'react';
import React from 'react';
import ApiPage from 'component/ApiPage';
import Markdown_ParcelBoundary from 'docs/api/parcelBoundary/ParcelBoundary.md';
import Markdown_ParcelBoundaryAfter from 'docs/api/parcelBoundary/ParcelBoundaryAfter.md';
import Markdown_parcel from 'docs/api/parcelBoundary/parcel.md';
import Markdown_forceUpdate from 'docs/api/parcelBoundary/forceUpdate.md';
import Markdown_debounce from 'docs/api/parcelBoundary/debounce.md';
import Markdown_hold from 'docs/api/parcelBoundary/hold.md';
import Markdown_pure from 'docs/api/parcelBoundary/pure.md';
import Markdown_debugBuffer from 'docs/api/parcelBoundary/debugBuffer.md';

const md = {
    _desc: Markdown_ParcelBoundary,
    _after: Markdown_ParcelBoundaryAfter,
    parcel: Markdown_parcel,
    forceUpdate: Markdown_forceUpdate,
    debounce: Markdown_debounce,
    hold: Markdown_hold,
    pure: Markdown_pure,
    debugBuffer: Markdown_debugBuffer
}

const api = `
# Props
parcel
debounce
pure
forceUpdate
hold
debugBuffer
`;

export default () => <ApiPage
    name="ParcelBoundary"
    api={api}
    md={md}
/>;
