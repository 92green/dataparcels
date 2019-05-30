import React from 'react';
import useParcelState from 'react-dataparcels/useParcelState';
import exampleFrame from 'component/exampleFrame';

export default function PersonEditor(props) {

    let [personParcel] = useParcelState({
        value: {
            firstname: "Robert",
            lastname: "Clamps",
            address: {
                postcode: "1234"
            }
        }
    });

    let firstname = personParcel.get('firstname');
    let lastname = personParcel.get('lastname');
    let postcode = personParcel.getIn(['address', 'postcode']);

    return exampleFrame(
        {personParcel},
        <div>
            <label>firstname</label>
            <input type="text" value={firstname.value} onChange={firstname.onChangeDOM} />

            <label>lastname</label>
            <input type="text" value={lastname.value} onChange={lastname.onChangeDOM} />

            <label>postcode</label>
            <input type="text" value={postcode.value} onChange={postcode.onChangeDOM} />
        </div>
    );
}
