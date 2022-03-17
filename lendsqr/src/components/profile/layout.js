import {Link, useParams } from "react-router-dom";
import { loader_state } from "../store/loader/action";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios"
import Profile from './profile'
import Settings from "./settings";



function Layout() {
    let params = useParams();

    const currentPage = params.pages || '';

    const dispatch = useDispatch()

    const navigate = useNavigate();



    useEffect(() => {
        dispatch(loader_state(true));
        // cookie validation
        const url = "http://localhost:5000/auth/cookie";
        axios
        ({
            method: 'post',  
            url: url,
            withCredentials: true,
            data: {}
        })
        .then((res)=>{
            if(res.data.status === "ok")
            {
                dispatch(loader_state(false));
            }
            else{
                navigate("/registration");
            }
        })
        .catch((error) => {
            navigate("/registration");
        });
    }, [navigate,dispatch])
    
    return (
        <>
                <div className="navbar text-white bg-[#191c24] z-10 w-full sticky top-0 shadow-xl rounded-bl-box rounded-br-box  ">
                    <div className="flex-1">
                        <a className="btn btn-ghost normal-case text-xl" href="/">Lendsqr Assessment</a>
                    </div>

                    <div className="flex-none">

                        <div className="dropdown dropdown-end">
                            <label tabIndex="0"title="show_menu" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img alt="logo" src="https://api.lorem.space/image/face?hash=33791"/>
                                </div>
                            </label>
                            <ul tabIndex="0" className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                                <li>
                                    <Link
                                        exact="true"
                                        to="/profile"
                                        title="profile_btn"
                                        className={`justify-between hover:text-white focus:bg-base-200 ${currentPage === '' ? 'focus:bg-black active:bg-black disabled bg-black' : ''} `}
                                        >
                                        Profile
                                        <span className="badge">New</span>
                                    </Link>
                                </li>
                                <li>
                                <Link
                                        exact="true"
                                        to="/profile/settings"
                                        title="setting_btn"
                                        className={`justify-between hover:text-white focus:bg-base-200 ${currentPage === 'settings' ? 'focus:bg-black active:bg-black disabled bg-black' : ''} `}
                                        >
                                        Settings
                                    </Link>
                                </li>
                                <li>
                                    <button className="focus:bg-base-200">Logout</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                { currentPage === '' ?
                    (
                        <Profile title="Profile"/>
                    )
                : currentPage === 'settings' ?
                    (
                        <Settings title="Registration" />
                    )
                :
                    (
                        <h1>PAGE NOT FOUND</h1>
                    )
                }
        </>
    )
}
  
export default Layout;