import {OverlayTrigger, Tooltip} from "react-bootstrap"
import { useNavigate } from "react-router-dom";
import { login_register_state } from "../store/login_register/action";
import { loader_state } from "../store/loader/action";
import { error_state } from "../store/error_pop/action";
import { useDispatch } from "react-redux";
import { useRef, useState } from "react";
import { verifyEmail_main_log, verifyPassword_main_log } from "./function";
import axios from "axios"

function Login() {

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const passwordElement = useRef();
    const emailElement = useRef();
    const [validEmail, setValidEmail] = useState(null)
    const [validPassword, setValidPassword] = useState(null)

    const registration_type = (type) => {
        dispatch(login_register_state(type));
    }

    const verifyEmail = (email) =>{
        const result = verifyEmail_main_log(email)
        setValidEmail(result)
    }

    const verifyPassword = (password) =>{
        const result = verifyPassword_main_log(password)
        setValidPassword(result)
    }

    const login = (e) =>{
        e.preventDefault();
        const email = emailElement.current.value;
        const password = passwordElement.current.value;
        
        var pass = verifyPassword_main_log(password)
        var mail = verifyEmail_main_log(email)
        
        if(mail && pass)
        {
            const { email, password } = Object.fromEntries(
                new FormData(e.currentTarget)
            );
            dispatch(loader_state(true));
            const url = "http://localhost:5000/auth/login";
            axios
            ({
                method: 'post',  
                url: url,
                withCredentials: true,
                data:
                    {  
                        email: email,  
                        password: password, 
                    }  
            })
            .then((res)=>{
                dispatch(loader_state(false));
                if(res.data.status === "ok")
                {
                    navigate("/profile");
                }
                else{
                    dispatch(error_state(true, res.data.message));
                }
            })
            .catch((error) => {
                console.log(error);
                dispatch(loader_state(false));
                dispatch(error_state(true, "Something went wrong, check your connection or the server cannot be reached"));   
            });
        }
    }

    return (
        <>
            <div className="w-[100vw] flex bg-black items-center h-[100vh]">
                <div className="container max-w-[760px]">

                    <div className="card text-white bg-[#191c24]">
                        <div className="card-body">
                            <h4 className="card-title fw-bolder">Login</h4>
                            <p className="card-description">Provide your <span className="fw-bolder">Credentials</span> to continue.</p>
                        
                            
                            <form id="default_form" onSubmit={login} className="needs-validation" noValidate={true}>

                                <div className="mb-3 row">
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id="login_email_tooltip">We will never share your email</Tooltip>}>

                                        {({ ref, ...triggerHandler }) => (
                                        <label htmlFor="email" data-tip="" className="col-sm-3 col-form-label">
                                            Email
                                            <img
                                                ref={ref}
                                                {...triggerHandler}
                                                src="/info.png" alt="" width="20" height="20" className="inline-block align-text-top"
                                            />
                                        </label>
                                        )}
                                    </OverlayTrigger>
                                    <div className="col-sm-9">
                                        <input type="email" name="email" required
                                            ref={emailElement}
                                            title="login_email_input"
                                            onBlur={(e)=>{
                                                verifyEmail(e.target.value);
                                            }}
                                            className={`${validEmail===true ? `is-valid` : validEmail===false ? `is-invalid`:''} bg-[#000] form-control text-white border-transparent focus:bg-[#2A3038] focus:border-[1px] focus:border-[#008000] focus:shadow-none`}
                                            placeholder="Email"
                                        />
                                        <div className="valid-feedback">
                                            Looks good!
                                        </div>
                                        <div className="invalid-feedback">
                                            A valid email is required..
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mb-3 row">
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id="login_pass_tooltip">Provide a valid password</Tooltip>}>

                                        {({ ref, ...triggerHandler }) => (
                                        <label htmlFor="password" className="col-sm-3 col-form-label">
                                            Password
                                            <img
                                                ref={ref}
                                                {...triggerHandler}
                                                src="/info.png" alt="" width="20" height="20" className="inline-block align-text-top"
                                            />
                                        </label>
                                        )}
                                    </OverlayTrigger>
                                    <div className="col-sm-9">
                                        <input type="text" name="password"
                                            ref={passwordElement}
                                            title="login_password_input"
                                            onBlur={(e)=>{
                                                verifyPassword(e.target.value);
                                            }}
                                            className={`${validPassword===true ? `is-valid` : validPassword===false ? `is-invalid`:''} form-control bg-[#000] text-white border-transparent focus:bg-[#2A3038] focus:border-[1px] focus:border-[#008000] focus:shadow-none`}
                                            required placeholder="Password"
                                        />

                                        <div className="valid-feedback">
                                            Looks good!
                                        </div>
                                        <div className="invalid-feedback">
                                            Provide a valid Password..
                                        </div>
                                    </div>
                                </div>

                                <div className="w-100 text-center">
                                    <button type="submit" title="login_btn" className="btn btn-outline btn-info px-5">Login</button>
                                </div>
                                <div className="w-100 mt-3 text-center">
                                    <p className="mb-3">Forgotten your password? <button className=" text-info bg-neutral" type="button">click me</button> to request new password</p>
                                    <button type="button" title="register_lay_btn" className="btn btn-outline px-5"
                                        onClick={()=>{registration_type('register')}} 
                                    >Register</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                
            </div>
        </>
    )
}
  
export default Login;