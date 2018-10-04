import React from 'react';
import Parcel, {ParcelBoundary} from 'react-dataparcels';

export default class ManagingOwnParcelState extends React.Component {
    constructor(props) {
        super(props);

        let personParcel = new Parcel({
            value: {
                firstname: "Robert",
                lastname: "Clamps"
            },
            handleChange: (personParcel) => this.setState({personParcel})
        });

        this.state = {personParcel};
    }

    render() {
        let {personParcel} = this.state;
        return <div>
            <label>firstname</label>
            <ParcelBoundary parcel={personParcel.get('firstname')}>
                {(firstname) => <input type="text" {...firstname.spreadDOM()} />}
            </ParcelBoundary>

            <label>lastname</label>
            <ParcelBoundary parcel={personParcel.get('lastname')}>
                {(lastname) => <input type="text" {...lastname.spreadDOM()} />}
            </ParcelBoundary>
        </div>;
    }
}
