// @flow
import type {Node} from 'react';
import React from 'react';
import ApiPage from 'component/ApiPage';
import Markdown_ParcelShape from 'docs/api/parcelShape/ParcelShape.md';
import Markdown_value from 'docs/api/parcelShape/value.md';
import Markdown_meta from 'docs/api/parcelShape/meta.md';
import Markdown_data from 'docs/api/parcelShape/data.md';
import Markdown_key from 'docs/api/parcelShape/key.md';
import Markdown_get from 'docs/api/parcelShape/get.md';
import Markdown_getIn from 'docs/api/parcelShape/getIn.md';
import Markdown_children from 'docs/api/parcelShape/children.md';
import Markdown_toObject from 'docs/api/parcelShape/toObject.md';
import Markdown_toArray from 'docs/api/parcelShape/toArray.md';
import Markdown_has from 'docs/api/parcelShape/has.md';
import Markdown_size from 'docs/api/parcelShape/size.md';
import Markdown_set from 'docs/api/parcelShape/set.md';
import Markdown_setIn from 'docs/api/parcelShape/setIn.md';
import Markdown_update from 'docs/api/parcelShape/update.md';
import Markdown_updateIn from 'docs/api/parcelShape/updateIn.md';
import Markdown_map from 'docs/api/parcelShape/map.md';
import Markdown_delete from 'docs/api/parcelShape/delete.md';
import Markdown_deleteIn from 'docs/api/parcelShape/deleteIn.md';
import Markdown_insertAfter from 'docs/api/parcelShape/insertAfter.md';
import Markdown_insertBefore from 'docs/api/parcelShape/insertBefore.md';
import Markdown_move from 'docs/api/parcelShape/move.md';
import Markdown_pop from 'docs/api/parcelShape/pop.md';
import Markdown_push from 'docs/api/parcelShape/push.md';
import Markdown_shift from 'docs/api/parcelShape/shift.md';
import Markdown_swap from 'docs/api/parcelShape/swap.md';
import Markdown_swapNext from 'docs/api/parcelShape/swapNext.md';
import Markdown_swapPrev from 'docs/api/parcelShape/swapPrev.md';
import Markdown_unshift from 'docs/api/parcelShape/unshift.md';
import Markdown_setMeta from 'docs/api/parcelShape/setMeta.md';
import Markdown_isChild from 'docs/api/parcelShape/isChild.md';
import Markdown_isElement from 'docs/api/parcelShape/isElement.md';
import Markdown_isIndexed from 'docs/api/parcelShape/isIndexed.md';
import Markdown_isParent from 'docs/api/parcelShape/isParent.md';
import Markdown_isTopLevel from 'docs/api/parcelShape/isTopLevel.md';

const md = {
    _desc: Markdown_ParcelShape,
    value: Markdown_value,
    meta: Markdown_meta,
    data: Markdown_data,
    key: Markdown_key,
    get: Markdown_get,
    getIn: Markdown_getIn,
    children: Markdown_children,
    toObject: Markdown_toObject,
    toArray: Markdown_toArray,
    has: Markdown_has,
    size: Markdown_size,
    set: Markdown_set,
    setIn: Markdown_setIn,
    update: Markdown_update,
    updateIn: Markdown_updateIn,
    map: Markdown_map,
    delete: Markdown_delete,
    deleteIn: Markdown_deleteIn,
    insertAfter: Markdown_insertAfter,
    insertBefore: Markdown_insertBefore,
    move: Markdown_move,
    pop: Markdown_pop,
    push: Markdown_push,
    shift: Markdown_shift,
    swap: Markdown_swap,
    swapNext: Markdown_swapNext,
    swapPrev: Markdown_swapPrev,
    unshift: Markdown_unshift,
    setMeta: Markdown_setMeta,
    isChild: Markdown_isChild,
    isElement: Markdown_isElement,
    isIndexed: Markdown_isIndexed,
    isParent: Markdown_isParent,
    isTopLevel: Markdown_isTopLevel
}

const api = `
# Properties
value
meta
data
key

# Parent methods
get()
getIn()
children()
toObject()
toArray()
has()
size()

# Set methods
set()
setIn()
delete()
deleteIn()
update()
updateIn()
map()

# Indexed & element change methods
insertAfter()
insertBefore()
move()
push()
pop()
shift()
swap()
swapNext()
swapPrev()
unshift()

# Type methods
isChild()
isElement()
isIndexed()
isParent()
isTopLevel()

`;

export default () => <ApiPage
    name="ParcelShape"
    api={api}
    md={md}
/>;
