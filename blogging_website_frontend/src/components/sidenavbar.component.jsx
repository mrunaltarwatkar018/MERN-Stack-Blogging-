// import { useContext, useEffect, useRef, useState } from "react";
// import { Navigate, NavLink, Outlet } from "react-router-dom";
// import { UserContext } from "../App";

// const SideNav = () => {

//     let { userAuth: { access_token, new_notification_available } } = useContext(UserContext);

//     let page = location.pathname.split("/")[2];

//     let [ pageState, setPageState ] = useState(page.replace("-", " "));
//     let [ showSideNav, setShowSideNav ] = useState(false);

//     let activeTabLine = useRef();
//     let sideBarIconTab = useRef();
//     let pageStateTab = useRef();

//     const changePageState = (e) => {

//         let { offsetWidth, offsetLeft } = e.target; 

//         activeTabLine.current.style.width = offsetWidth + "px";
//         activeTabLine.current.style.left = offsetLeft + "px";

//         if(e.target == sideBarIconTab.current){
//             setShowSideNav(true);
//         } else {
//             setShowSideNav(false);
//         }

//     }

//     useEffect(() => {
//         setShowSideNav(false); // hide the side bar
//         pageStateTab.current.click();
//     }, [pageState])

//     return (

//         access_token === null ? <Navigate to="/signin" /> :
//         <>
//             <section className="relative flex gap-10 py-0 m-0 max-md:flex-col">

//                 <div className="sticky top-[80px] z-30">

//                     <div className="md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto">
//                         <button ref={sideBarIconTab} className="p-5 capitalize" onClick={changePageState}>
//                             <i className="fi fi-rr-bars-staggered pointer-events-none"></i>
//                         </button>

//                         <button ref={pageStateTab} className="p-5 capitalize" onClick={changePageState}>
//                             { pageState }
//                         </button>

//                         <hr ref={activeTabLine} className="absolute bottom-0 duration-500 border-dark-grey" />
//                     </div>
                

//                     <div className={"min-w-[200px] h-[calc(100vh-80px-60px)] md:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 duration-500 " + (!showSideNav ? "max-md:opacity-0 max-md:pointer-events-none" : "opacity-100 pointer-events-auto")}>

//                         <h1 className="text-xl text-dark-grey mb-3">Dashboard</h1>
//                         <hr className="border-grey -ml-6 mb-8 mr-6" />

//                         <NavLink to="/dashboard/blogs" onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
//                             <i className="fi fi-rr-document"></i>
//                             Blogs
//                         </NavLink>

//                         <NavLink to="/dashboard/notifications" onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
//                             <div className="relative">
//                                 <i className="fi fi-rr-bell"></i>
//                                 {
//                                     new_notification_available 
//                                     ?
//                                     <span className="bg-red w-2 h-2 rounded-full absolute z-10 top-0 right-0"></span> 
//                                     : 
//                                     ""
//                                 }
//                             </div>
//                             Notifications
//                         </NavLink>

//                         <NavLink to="/editor" onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
//                             <i className="fi fi-rr-file-edit"></i>
//                             Write
//                         </NavLink>

//                         <h1 className="text-xl text-dark-grey mt-20 mb-3">Settings</h1>
//                         <hr className="border-grey -ml-6 mb-8 mr-6" />

//                         <NavLink to="/settings/edit-profile" onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
//                             <i className="fi fi-rr-user"></i>
//                             Edit Profile
//                         </NavLink>

//                         <NavLink to="/settings/change-password" onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
//                             <i className="fi fi-rr-lock"></i>
//                             Change Password
//                         </NavLink>

//                     </div>

//                 </div> 

//                 <div className="max-md:-mt-8 mt-5 w-full">
//                     <Outlet />
//                 </div>

//             </section>

//         </>
//     )
// }

// export default SideNav;



// if blog is allow to write only admin, other users can not write or delete the blog
import { useContext, useEffect, useRef, useState } from "react";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import { UserContext } from "../App";

const SideNav = () => {

    let { userAuth: { access_token, new_notification_available, isAdmin } } = useContext(UserContext);

    let page = location.pathname.split("/")[2];

    let [ pageState, setPageState ] = useState(page.replace("-", " "));
    let [ showSideNav, setShowSideNav ] = useState(false);

    let activeTabLine = useRef();
    let sideBarIconTab = useRef();
    let pageStateTab = useRef();

    const changePageState = (e) => {

        let { offsetWidth, offsetLeft } = e.target; 

        activeTabLine.current.style.width = offsetWidth + "px";
        activeTabLine.current.style.left = offsetLeft + "px";

        if(e.target == sideBarIconTab.current){
            setShowSideNav(true);
        } else {
            setShowSideNav(false);
        }

    }

    useEffect(() => {
        setShowSideNav(false); // hide the side bar
        pageStateTab.current.click();
    }, [pageState])

    return (

        access_token === null ? <Navigate to="/signin" /> :
        <>
            <section className="relative flex gap-10 py-0 m-0 max-md:flex-col">

                <div className="sticky top-[80px] z-30">

                    <div className="md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto">
                        <button ref={sideBarIconTab} className="p-5 capitalize" onClick={changePageState}>
                            <i className="fi fi-rr-bars-staggered pointer-events-none"></i>
                        </button>

                        <button ref={pageStateTab} className="p-5 capitalize" onClick={changePageState}>
                            { pageState }
                        </button>

                        <hr ref={activeTabLine} className="absolute bottom-0 duration-500 border-dark-grey" />
                    </div>
                

                    <div className={"min-w-[200px] h-[calc(100vh-80px-60px)] md:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 duration-500 " + (!showSideNav ? "max-md:opacity-0 max-md:pointer-events-none" : "opacity-100 pointer-events-auto")}>

                        <h1 className="text-xl text-dark-grey mb-3">Dashboard</h1>
                        <hr className="border-grey -ml-6 mb-8 mr-6" />

                        <NavLink to="/dashboard/blogs" onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
                            <i className="fi fi-rr-document"></i>
                            Blogs
                        </NavLink>

                        <NavLink to="/dashboard/notifications" onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
                            <div className="relative">
                                <i className="fi fi-rr-bell"></i>
                                {
                                    new_notification_available 
                                    ?
                                    <span className="bg-red w-2 h-2 rounded-full absolute z-10 top-0 right-0"></span> 
                                    : 
                                    ""
                                }
                            </div>
                            Notifications
                        </NavLink>

                        {
                            isAdmin 
                            ?
                            <NavLink to="/editor" onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
                                <i className="fi fi-rr-file-edit"></i>
                                Write
                            </NavLink>
                            :
                            ""
                        }

                        <h1 className="text-xl text-dark-grey mt-20 mb-3">Settings</h1>
                        <hr className="border-grey -ml-6 mb-8 mr-6" />

                        <NavLink to="/settings/edit-profile" onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
                            <i className="fi fi-rr-user"></i>
                            Edit Profile
                        </NavLink>

                        <NavLink to="/settings/change-password" onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
                            <i className="fi fi-rr-lock"></i>
                            Change Password
                        </NavLink>

                    </div>

                </div> 

                <div className="max-md:-mt-8 mt-5 w-full">
                    <Outlet />
                </div>

            </section>

        </>
    )
}

export default SideNav;




/*

    Overview

        This is a React functional component named SideNav. 
        It appears to be a part of a larger application, likely a 
        dashboard or settings section, and is responsible for rendering 
        a sidebar navigation menu. The component uses React Router for 
        client-side routing and React Context for state management.

    Imports

        The component imports various dependencies:

            useContext, useEffect, useRef, and useState from React
            Navigate, NavLink, and Outlet from React Router
            UserContext from a separate file (../App)

    Component Structure

        The component consists of several sections:

            Authentication Check: The component checks if the user is authenticated by verifying 
            the presence of an access_token. If not, it redirects the user to the signin page using Navigate.
            
            Sidebar Navigation: The component renders a sidebar navigation menu with several links to 
            different routes (e.g., blogs, notifications, write, edit profile, change password).
            
            Active Tab Line: The component uses a ref (activeTabLine) to style the active tab line, which is 
            updated when a navigation link is clicked.
            
            Sidebar Toggle: The component uses a ref (sideBarIconTab) to toggle the visibility of the sidebar 
            on smaller screens.
            
            Outlet: The component renders an Outlet component from React Router, which will render the content 
            of the current route.

    State and Effects

        The component uses several state variables and effects:

            pageState: stores the current page state (e.g., "Blogs", "Notifications")

            showSideNav: stores the visibility state of the sidebar on smaller screens

            useEffect: updates the showSideNav state when the pageState changes.

    Event Handlers

        The component defines two event handlers:

            changePageState: updates the pageState and showSideNav states when a navigation link is clicked

            onClick: updates the pageState when a navigation link is clicked.

    Styles and Class Names

        The component uses various class names and styles to customize the appearance of the sidebar navigation menu.

    Overall, this component is responsible for rendering a responsive sidebar navigation menu that 
    updates dynamically based on the current route and user interactions.

*/