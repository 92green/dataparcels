// @flow
import type {Node} from 'react';
import React from 'react';
import ApiPage from 'component/ApiPage';
import Markdown_Parcel from 'docs/api/parcel/Parcel.md';
import Markdown_ParcelAfter from 'docs/api/parcel/ParcelAfter.md';
import Markdown_value from 'docs/api/parcel/value.md';
import Markdown_meta from 'docs/api/parcel/meta.md';
import Markdown_data from 'docs/api/parcel/data.md';
import Markdown_key from 'docs/api/parcel/key.md';
import Markdown_id from 'docs/api/parcel/id.md';
import Markdown_path from 'docs/api/parcel/path.md';
import Markdown_spread from 'docs/api/parcel/spread.md';
import Markdown_spreadDOM from 'docs/api/parcel/spreadDOM.md';
import Markdown_get from 'docs/api/parcel/get.md';
import Markdown_getIn from 'docs/api/parcel/getIn.md';
import Markdown_children from 'docs/api/parcel/children.md';
import Markdown_toObject from 'docs/api/parcel/toObject.md';
import Markdown_toArray from 'docs/api/parcel/toArray.md';
import Markdown_has from 'docs/api/parcel/has.md';
import Markdown_size from 'docs/api/parcel/size.md';
import Markdown_isFirst from 'docs/api/parcel/isFirst.md';
import Markdown_isLast from 'docs/api/parcel/isLast.md';
import Markdown_onChange from 'docs/api/parcel/onChange.md';
import Markdown_onChangeDOM from 'docs/api/parcel/onChangeDOM.md';
import Markdown_set from 'docs/api/parcel/set.md';
import Markdown_setIn from 'docs/api/parcel/setIn.md';
import Markdown_update from 'docs/api/parcel/update.md';
import Markdown_updateDeep from 'docs/api/parcel/updateDeep.md';
import Markdown_updateIn from 'docs/api/parcel/updateIn.md';
import Markdown_updateInDeep from 'docs/api/parcel/updateInDeep.md';
import Markdown_delete from 'docs/api/parcel/delete.md';
import Markdown_deleteIn from 'docs/api/parcel/deleteIn.md';
import Markdown_insertAfter from 'docs/api/parcel/insertAfter.md';
import Markdown_insertBefore from 'docs/api/parcel/insertBefore.md';
import Markdown_pop from 'docs/api/parcel/pop.md';
import Markdown_push from 'docs/api/parcel/push.md';
import Markdown_shift from 'docs/api/parcel/shift.md';
import Markdown_swap from 'docs/api/parcel/swap.md';
import Markdown_swapNext from 'docs/api/parcel/swapNext.md';
import Markdown_swapPrev from 'docs/api/parcel/swapPrev.md';
import Markdown_unshift from 'docs/api/parcel/unshift.md';
import Markdown_setMeta from 'docs/api/parcel/setMeta.md';
import Markdown_setChangeRequestMeta from 'docs/api/parcel/setChangeRequestMeta.md';
import Markdown_dispatch from 'docs/api/parcel/dispatch.md';
import Markdown_batch from 'docs/api/parcel/batch.md';
import Markdown_batchAndReturn from 'docs/api/parcel/batchAndReturn.md';
import Markdown_modifyDown from 'docs/api/parcel/modifyDown.md';
import Markdown_modifyUp from 'docs/api/parcel/modifyUp.md';
import Markdown_modifyChange from 'docs/api/parcel/modifyChange.md';
import Markdown_initialMeta from 'docs/api/parcel/initialMeta.md';
import Markdown_isChild from 'docs/api/parcel/isChild.md';
import Markdown_isElement from 'docs/api/parcel/isElement.md';
import Markdown_isIndexed from 'docs/api/parcel/isIndexed.md';
import Markdown_isParent from 'docs/api/parcel/isParent.md';
import Markdown_isTopLevel from 'docs/api/parcel/isTopLevel.md';
import Markdown_hasDispatched from 'docs/api/parcel/hasDispatched.md';
import Markdown_log from 'docs/api/parcel/log.md';
import Markdown_spy from 'docs/api/parcel/spy.md';
import Markdown_spyChange from 'docs/api/parcel/spyChange.md';
import Markdown_pipe from 'docs/api/parcel/pipe.md';
import Markdown_toConsole from 'docs/api/parcel/toConsole.md';

const md = {
    _desc: Markdown_Parcel,
    _after: Markdown_ParcelAfter,
    value: Markdown_value,
    meta: Markdown_meta,
    data: Markdown_data,
    key: Markdown_key,
    id: Markdown_id,
    path: Markdown_path,
    spread: Markdown_spread,
    spreadDOM: Markdown_spreadDOM,
    get: Markdown_get,
    getIn: Markdown_getIn,
    children: Markdown_children,
    toObject: Markdown_toObject,
    toArray: Markdown_toArray,
    has: Markdown_has,
    size: Markdown_size,
    isFirst: Markdown_isFirst,
    isLast: Markdown_isLast,
    onChange: Markdown_onChange,
    onChangeDOM: Markdown_onChangeDOM,
    set: Markdown_set,
    setIn: Markdown_setIn,
    update: Markdown_update,
    updateDeep: Markdown_updateDeep,
    updateIn: Markdown_updateIn,
    updateInDeep: Markdown_updateInDeep,
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
    setChangeRequestMeta: Markdown_setChangeRequestMeta,
    dispatch: Markdown_dispatch,
    batch: Markdown_batch,
    batchAndReturn: Markdown_batchAndReturn,
    modifyDown: Markdown_modifyDown,
    modifyUp: Markdown_modifyUp,
    modifyChange: Markdown_modifyChange,
    initialMeta: Markdown_initialMeta,
    isChild: Markdown_isChild,
    isElement: Markdown_isElement,
    isIndexed: Markdown_isIndexed,
    isParent: Markdown_isParent,
    isTopLevel: Markdown_isTopLevel,
    hasDispatched: Markdown_hasDispatched,
    log: Markdown_log,
    spy: Markdown_spy,
    spyChange: Markdown_spyChange,
    pipe: Markdown_pipe,
    toConsole: Markdown_toConsole
}

const api = `
# Properties
value
meta
data
key
id
path

# Spread methods
spread()
spreadDOM()

# Branch methods
get()
getIn()
children()
toObject()
toArray()

# Parent methods
has()
size()

# Child methods
isFirst()
isLast()

# Change methods
onChange()
onChangeDOM()
set()
setIn()
delete()
deleteIn()
update()
updateDeep()
updateIn()
updateInDeep()

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

# Advanced change methods
setMeta()
setChangeRequestMeta()
dispatch()
batch()
batchAndReturn()

# Modify methods
modifyDown()
modifyUp()
modifyChange()
initialMeta()

# Type methods
isChild()
isElement()
isIndexed()
isParent()
isTopLevel()

# Status methods
hasDispatched()

# Side-effect methods
spy()
spyChange()

# Composition methods
pipe()

# Debug methods
log()
toConsole()

`;

export default () => <ApiPage
    name="Parcel"
    api={api}
    md={md}
/>;
