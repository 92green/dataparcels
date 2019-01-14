// @flow
import type {Node} from 'react';
import React from 'react';
import ApiPage from 'component/ApiPage';
import Markdown_StaticParcel from 'docs/api/staticParcel/StaticParcel.md';
import Markdown_value from 'docs/api/staticParcel/value.md';
import Markdown_meta from 'docs/api/staticParcel/meta.md';
import Markdown_data from 'docs/api/staticParcel/data.md';
import Markdown_key from 'docs/api/staticParcel/key.md';
import Markdown_get from 'docs/api/staticParcel/get.md';
import Markdown_getIn from 'docs/api/staticParcel/getIn.md';
import Markdown_children from 'docs/api/staticParcel/children.md';
import Markdown_toObject from 'docs/api/staticParcel/toObject.md';
import Markdown_toArray from 'docs/api/staticParcel/toArray.md';
import Markdown_has from 'docs/api/staticParcel/has.md';
import Markdown_size from 'docs/api/staticParcel/size.md';
import Markdown_set from 'docs/api/staticParcel/set.md';
import Markdown_setIn from 'docs/api/staticParcel/setIn.md';
import Markdown_update from 'docs/api/staticParcel/update.md';
import Markdown_updateShape from 'docs/api/staticParcel/updateShape.md';
import Markdown_updateIn from 'docs/api/staticParcel/updateIn.md';
import Markdown_updateShapeIn from 'docs/api/staticParcel/updateShapeIn.md';
import Markdown_delete from 'docs/api/staticParcel/delete.md';
import Markdown_deleteIn from 'docs/api/staticParcel/deleteIn.md';
import Markdown_insertAfter from 'docs/api/staticParcel/insertAfter.md';
import Markdown_insertBefore from 'docs/api/staticParcel/insertBefore.md';
import Markdown_pop from 'docs/api/staticParcel/pop.md';
import Markdown_push from 'docs/api/staticParcel/push.md';
import Markdown_shift from 'docs/api/staticParcel/shift.md';
import Markdown_swap from 'docs/api/staticParcel/swap.md';
import Markdown_swapNext from 'docs/api/staticParcel/swapNext.md';
import Markdown_swapPrev from 'docs/api/staticParcel/swapPrev.md';
import Markdown_unshift from 'docs/api/staticParcel/unshift.md';
import Markdown_setMeta from 'docs/api/staticParcel/setMeta.md';
import Markdown_isChild from 'docs/api/staticParcel/isChild.md';
import Markdown_isElement from 'docs/api/staticParcel/isElement.md';
import Markdown_isIndexed from 'docs/api/staticParcel/isIndexed.md';
import Markdown_isParent from 'docs/api/staticParcel/isParent.md';
import Markdown_isTopLevel from 'docs/api/staticParcel/isTopLevel.md';
import Markdown_toConsole from 'docs/api/staticParcel/toConsole.md';

const md = {
    _desc: Markdown_StaticParcel,
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
    updateShape: Markdown_updateShape,
    updateIn: Markdown_updateIn,
    updateShapeIn: Markdown_updateShapeIn,
    delete: Markdown_delete,
    deleteIn: Markdown_deleteIn,
    insertAfter: Markdown_insertAfter,
    insertBefore: Markdown_insertBefore,
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
    isTopLevel: Markdown_isTopLevel,
    toConsole: Markdown_toConsole
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
updateShape()
updateIn()
updateShapeIn()

# Indexed & element change methods
insertAfter()
insertBefore()
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

# Debug methods
toConsole()

`;

export default () => <ApiPage
    name="StaticParcel"
    api={api}
    md={md}
/>;
