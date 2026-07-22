import "./Layout.css";

import Sidebar from "./Sidebar";

export default function Layout({

    children,

    phase

}){

    return(

        <div className="layout">

            <Sidebar phase={phase}/>

            <div className="layout-content">

                {children}

            </div>

        </div>

    )

}