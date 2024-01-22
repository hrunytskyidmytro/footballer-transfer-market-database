import React from 'react';

import TransfersList from '../components/TransfersList';

const Transfers = () => {
    const TRANSFERS = [
        {
            id: 't1',
            footballer: 'Messi',
            fromClub: 'Barcelona',
            toClub: 'Real Madrid',
            transferFee: 100000,
            transferDate: '2024-01-22',
            transferType: 'internal'
        }
    ];

    return <TransfersList items={TRANSFERS} />;
};

export default Transfers;