import React from 'react';

import './TransferItem.css'

const TransferItem = props => {
    return (
        <li className='transfer-item'>
            <div className='transfer-item__content'>
                <div className='transfer-item__info'>
                    <h2>{props.footballer}</h2>
                    <h2>{props.fromClub}</h2>
                    <h2>{props.toClub}</h2>
                    <h2>{props.transferFee}</h2>
                    <h2>{props.transferDate}</h2>
                    <h2>{props.transferType}</h2>
                </div>
            </div>
        </li>
    );
};

export default TransferItem;