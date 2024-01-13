import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [username, setUsername] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    const collapseNavbar = () => {
        document.getElementById("collapse-navbar").classList.toggle("hidden");
    }

    useEffect(() => {
        if (location.pathname == '/login' || location.pathname == '/register') {
            return;
        }

        const authenticated = localStorage.getItem('authenticated');

        if (authenticated === null || authenticated === undefined) {
            navigate('/login');
        } else {
            setAuthenticated(true);
            setUsername(localStorage.getItem('username'));
        }
    }, [])

    const logout = () => {
        localStorage.removeItem('authenticated');
        localStorage.removeItem('username');

        navigate('/login')
    }

    return (
        <nav className="bg-gray-800 shadow-lg">
            <div className="text-slate-50 flex flex-col items-center px-10 md:flex-row md:px-20 lg:px-32">
                <div className="w-full h-16 flex items-center md:w-auto">
                    <div className="text-2xl font-serif">Plagiarism Checker</div>
                    <FontAwesomeIcon icon={faBars} className="block md:hidden text-2xl text-slate-300 ms-auto" onClick={collapseNavbar} />
                </div>

                <div id="collapse-navbar" className="hidden grow md:flex flex-col space-y-3 pt-5 pb-5 gap-x-6 items-center justify-center text-center md:ms-10 md:flex-row md:space-y-0 md:pt-0 md:pb-0">
                    <div className="ms-auto flex items-center">
                        {
                            isAuthenticated ?
                                <>
                                    <div className="italic">Welcome, {username}</div>
                                    <div className="navbar ms-8" onClick={logout}>Logout</div>
                                </>
                                :
                                null
                        }
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
