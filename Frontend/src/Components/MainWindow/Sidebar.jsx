import React from 'react'

function Sidebar({ activeContactId }) {
    return (

        <div className={`sidebar ${activeContactId ? "sidebar_collapsed" : ""}`}>
            <h1>1</h1>
        </div>
        
    )
}

export default Sidebar
