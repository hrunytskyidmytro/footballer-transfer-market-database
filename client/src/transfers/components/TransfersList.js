import React from 'react';

import TransferItem from './TransferItem';
import './TransfersList.css';

const TransfersList = props => {
    if (props.items.length === 0) {
        return (
            <div className='center'>
                <h2>No transfers found.</h2>
            </div>
        );
    }

    return (
        <ul className='transfers-list'>
            {props.items.map(transfer => (
                <TransferItem 
                    key={transfer.id} 
                    id={transfer.id} 
                    footballer={transfer.footballer}
                    fromClub={transfer.fromClub} 
                    toClub={transfer.toClub} 
                    transferFee={transfer.transferFee} 
                    transferDate={transfer.transferDate} 
                    transferType={transfer.transferType} 
                />
            ))}
        </ul>
    );
};

export default TransfersList;