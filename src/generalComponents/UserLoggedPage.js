import React from "react";
import ListUsers from '../listUsers/components/ListUsers';
import { DetailUserLogged } from '../userDetail/components/DetailUser';

const UserLoggedPage = (userLogged) => (
    <React.Fragment>    
        <DetailUserLogged />
        <ListUsers />    
    </React.Fragment> 
);

export default UserLoggedPage;