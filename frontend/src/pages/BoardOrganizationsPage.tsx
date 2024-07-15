import React from 'react'
import { useParams } from 'react-router-dom';

const BoardOrganizationPage
 = () => {
    
    const { organizationId } = useParams();

    return <div>{organizationId}</div>;
}

export default BoardOrganizationPage
