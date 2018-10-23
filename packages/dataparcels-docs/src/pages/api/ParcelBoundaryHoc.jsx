// @flow
import type {Node} from 'react';
import React from 'react';
import ApiPage from 'component/ApiPage';
import Markdown_ParcelBoundaryHoc from 'docs/api/parcelBoundaryHoc/ParcelBoundaryHoc.md';
import Markdown_name from 'docs/api/parcelBoundaryHoc/name.md';
import Markdown_originalParcelProp from 'docs/api/parcelBoundaryHoc/originalParcelProp.md';
import Markdown_debounce from 'docs/api/parcelBoundaryHoc/debounce.md';
import Markdown_hold from 'docs/api/parcelBoundaryHoc/hold.md';
import Markdown_debugBuffer from 'docs/api/parcelBoundaryHoc/debugBuffer.md';
import Markdown_debugParcel from 'docs/api/parcelBoundaryHoc/debugParcel.md';
import Markdown_childName from 'docs/api/parcelBoundaryHoc/childName.md';
import Markdown_childNameActions from 'docs/api/parcelBoundaryHoc/childNameActions.md';
import Markdown_childOriginalParcelProp from 'docs/api/parcelBoundaryHoc/childOriginalParcelProp.md';

const md = {
    _desc: Markdown_ParcelBoundaryHoc,
    name: Markdown_name,
    originalParcelProp: Markdown_originalParcelProp,
    debounce: Markdown_debounce,
    hold: Markdown_hold,
    debugBuffer: Markdown_debugBuffer,
    debugParcel: Markdown_debugParcel,
    ['${name}']: Markdown_childName,
    ['${name}Actions']: Markdown_childNameActions,
    ['${originalParcelProp}']: Markdown_childOriginalParcelProp
}

const api = `
# Config
name
originalParcelProp
debounce
hold
debugBuffer
debugParcel

# Child props
$\{name\}
$\{name\}Actions
$\{originalParcelProp\}
`;

export default () => <ApiPage
    name="ParcelBoundaryHoc"
    api={api}
    md={md}
/>;
