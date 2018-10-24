// @flow
import type {Node} from 'react';
import React from 'react';
import ApiPage from 'component/ApiPage';
import Markdown_ParcelHoc from 'docs/api/parcelHoc/ParcelHoc.md';
import Markdown_ParcelHocAfter from 'docs/api/parcelHoc/ParcelHocAfter.md';
import Markdown_name from 'docs/api/parcelHoc/name.md';
import Markdown_initialValue from 'docs/api/parcelHoc/initialValue.md';
import Markdown_delayUntil from 'docs/api/parcelHoc/delayUntil.md';
import Markdown_onChange from 'docs/api/parcelHoc/onChange.md';
import Markdown_pipe from 'docs/api/parcelHoc/pipe.md';
import Markdown_debugRender from 'docs/api/parcelHoc/debugRender.md';

const md = {
    _desc: Markdown_ParcelHoc,
    _after: Markdown_ParcelHocAfter,
    name: Markdown_name,
    initialValue: Markdown_initialValue,
    delayUntil: Markdown_delayUntil,
    onChange: Markdown_onChange,
    pipe: Markdown_pipe,
    debugRender: Markdown_debugRender
}

const api = `
# Config
name
initialValue
delayUntil
onChange
pipe
debugRender
`;

export default () => <ApiPage
    name="ParcelHoc"
    api={api}
    md={md}
/>;
