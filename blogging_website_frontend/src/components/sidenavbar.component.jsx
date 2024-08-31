import { Outlet } from "react-router-dom";


const SideNav = () => {
    return (
        <>
            <h1> This is a Side Navbar Component </h1>

            <Outlet />
        </>
    )
}

export default SideNav;