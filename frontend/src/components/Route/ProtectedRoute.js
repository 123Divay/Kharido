import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import {Navigate} from 'react-router-dom';

const ProtectedRoute = ({element:Component}) => {
    const {loading,isAuthenticated} = useSelector((state)=>state.user);

  return (
    <Fragment>
        {!loading && (
            <Fragment>
                {isAuthenticated ?<Component />:<Navigate to="/login"/>}
            </Fragment>

        
        )}
    </Fragment>
    
  )
}

export default ProtectedRoute