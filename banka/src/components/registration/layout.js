import Login from "./login"
import Register from "./register"
import { loader_state } from "../store/loader/action";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios"

function Registration(props) {
    document.title = props.title;

    const navigate = useNavigate();
    const dispatch = useDispatch();

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
                navigate("/profile");
            }
            else{
                dispatch(loader_state(false));
            }
        })
        .catch((error) => {
            dispatch(loader_state(false));
        });
        return () =>{
            dispatch(loader_state(false));
        }
    }, [dispatch,navigate])
    

    const type = useSelector((state) => state.login_register_state);

    if (type.layout === 'login')
    {
        return (
            <>
                <Login/>
            </>
        )
    }

    
    else if(type.layout === 'register'){
        return (
            <>
                <Register/>
            </>
        )
    }

    
}
  
export default Registration;