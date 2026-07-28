import React from 'react'

function Sidebar({ activeContactId, loggedIn }) {

    return (

        <div className={`sidebar ${activeContactId ? "sidebar_collapsed" : ""}`}>
            {loggedIn?.name || "Loading..."}
        </div>
        
    )
}

export default Sidebar
