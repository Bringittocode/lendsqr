import {OverlayTrigger, Tooltip} from "react-bootstrap"
import { login_register_state } from "../store/login_register/action";
import { loader_state } from "../store/loader/action";
import { error_state } from "../store/error_pop/action";
import { success_state } from "../store/success_pop/action";
import { useDispatch } from "react-redux";
import { verifyConfirmPassword_main_reg, verifyEmail_main_reg, verifyPassword_main_reg } from "./function";
import { useRef, useState } from "react";
import axios from "axios"

function Register() {

    const dispatch = useDispatch();
    const passwordElement = useRef();
    const emailElement = useRef();
    const confirmPasswordElement = useRef();
    const [validEmail, setValidEmail] = useState(null)
    const [validPassword, setValidPassword] = useState(null)
    const [validConfirmPassword, setValidConfirmPassword] = useState(null)

    const registration_type = (type) => {
        dispatch(login_register_state(type));
    }

    const verifyEmail = (email) =>{
        const result = verifyEmail_main_reg(email)
        setValidEmail(result)
    }

    const verifyPassword = (password) =>{
        const confirmPassword = confirmPasswordElement.current.value;
        const result = verifyPassword_main_reg(password, confirmPassword)
        setValidPassword(result.password)
        setValidConfirmPassword(result.confirmPassword)
    }

    const verifyConfirmPassword = (confirmPassword) =>{
        const password = passwordElement.current.value;
        const result = verifyConfirmPassword_main_reg(confirmPassword, password)
        setValidConfirmPassword(result)
    }

    const register = (e) =>{
        e.preventDefault();
        const email = emailElement.current.value;
        const password = passwordElement.current.value;
        const confirmPassword = confirmPasswordElement.current.value;
        var pass = verifyPassword_main_reg(password, confirmPassword)
        var cpass = verifyConfirmPassword_main_reg(confirmPassword, password)
        var mail = verifyEmail_main_reg(email)

        if(mail && pass.password && cpass)
        {
            const { email, password } = Object.fromEntries(
                new FormData(e.currentTarget)
            );
            dispatch(loader_state(true));
            const url = "http://localhost:5000/auth/register";
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
                    dispatch(success_state(true, res.data.message));
                    dispatch(login_register_state("login"));
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
                            <h4 className="card-title fw-bolder">Register</h4>
                            <p className="card-description">Join us by <span className="fw-bolder"> registering </span>a new account.</p>
                        
                            
                            <form className="needs-validation" method="post" onSubmit={register} noValidate={true}>
                                <input type="hidden" name="token" value="" />
                                
                                <div className="mb-3 row">
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id="register_email_tooltip">We will never share your email</Tooltip>}>

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
                                            onBlur={(e)=>{
                                                verifyEmail(e.target.value);
                                            }}
                                            title="register_email_input"
                                            className={`${validEmail===true ? `is-valid` : validEmail===false ? `is-invalid`:''} bg-[#000] form-control text-white border-transparent focus:bg-[#2A3038] focus:border-[1px] focus:border-[#008000] focus:shadow-none`}
                                            ref={emailElement} placeholder="Email"/>
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
                                        overlay={<Tooltip id="register_pass_tooltip">Provide a strong password</Tooltip>}>

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
                                            id="password"
                                            ref={passwordElement}
                                            title="register_password_input"
                                            onBlur={(e)=>{
                                                verifyPassword(e.target.value);
                                            }}
                                            className={`${validPassword===true ? `is-valid` : validPassword===false ? `is-invalid`:''} bg-[#000] form-control text-white border-transparent focus:bg-[#2A3038] focus:border-[1px] focus:border-[#008000] focus:shadow-none`}
                                            required placeholder="Password"/>

                                        <div className="valid-feedback">
                                            Looks good!
                                        </div>
                                        <div className="invalid-feedback">
                                            (The Password can contain Uppercase and Lowercase character.)
                                            (The Password can contain digit.)
                                            (The Password can have Special Symbol.)
                                            (The Password must be minimum of 8 characters long.)
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3 row">
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id="register_pass_tooltip">Provide a strong confirmation password</Tooltip>}>

                                        {({ ref, ...triggerHandler }) => (
                                        <label htmlFor="cpassword" className="col-sm-3 col-form-label">
                                            Confirm Password
                                            <img
                                                ref={ref}
                                                {...triggerHandler}
                                                src="/info.png" alt="" width="20" height="20" className="inline-block align-text-top"
                                            />
                                        </label>
                                        )}
                                    </OverlayTrigger>
                                    <div className="col-sm-9">
                                        <input type="text" name="confirm password"
                                            id="cpassword"
                                            ref={confirmPasswordElement}
                                            title="register_cpassword_input"
                                            onBlur={(e)=>{
                                                verifyConfirmPassword(e.target.value);
                                            }}
                                            className={`${validConfirmPassword===true ? `is-valid` : validConfirmPassword===false ? `is-invalid`:''} bg-[#000] form-control text-white border-transparent focus:bg-[#2A3038] focus:border-[1px] focus:border-[#008000] focus:shadow-none`}
                                            required placeholder="Confirm Passowrd"/>

                                        <div className="valid-feedback">
                                            Looks good!
                                        </div>
                                        <div className="invalid-feedback">
                                            Password must match.
                                        </div>
                                    </div>
                                </div>

                                <div className="w-100 mt-3 text-center flex justify-between">
                                    <button type="submit" title="register_btn" className="btn btn-outline focus:bg-transparent btn-info px-5">Signup</button>
                                    <button type="button" title="login_lay_btn" className="btn btn-outline px-5 focus:bg-transparent"
                                        onClick={()=>{registration_type('login')}}
                                    >Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                
            </div>
        </>
    )
}
  
export default Register;