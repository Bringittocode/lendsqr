import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { verifyEmail_main, verifyName_main } from "./function";
import { loader_state } from "../store/loader/action";
import { error_state } from "../store/error_pop/action";
import { success_state } from "../store/success_pop/action";

function Settings(props) {
    document.title = props.title;

    const dispatch = useDispatch();

    const [validEmail, setValidEmail] = useState(null)
    const [validFirstname, setValidFirstname] = useState(null)
    const [validLastname, setValidLastname] = useState(null)

    const [email, setEmail] = useState("")
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [account_num, setAccount_num] = useState("")

    const [verify, setVerify] = useState(false)

    const verifyEmail = (email) =>{
        const result = verifyEmail_main(email)
        setValidEmail(result)
    }

    const verifyFirstname = (name) =>{
        const result = verifyName_main(name)
        setValidFirstname(result)
    }

    const verifyLastname = (name) =>{
        const result = verifyName_main(name)
        setValidLastname(result)
    }

    const updateProfile = (e) =>{
        e.preventDefault();
        const { email, firstname, lastname } = Object.fromEntries(
            new FormData(e.currentTarget)
        );
        var mail = verifyEmail_main(email)
        var first = verifyName_main(firstname)
        var last = verifyName_main(lastname)
        
        if(mail && first && last)
        {
            
            dispatch(loader_state(true));
            const url = "http://localhost:5000/user/updateprofile";
            axios
            ({
                method: 'post',  
                url: url,
                withCredentials: true,
                data:
                    {
                        email: email,  
                        firstname: firstname,
                        lastname: lastname
                    }  
            })
            .then((res)=>{
                dispatch(loader_state(false));
                const data = res.data
                if(data.status === "ok")
                {
                    dispatch(success_state(true, res.data.message));
                }
                else{
                    dispatch(error_state(true, data.message));
                }
            })
            .catch((error) => {
                console.log(error);
                dispatch(loader_state(false));
                dispatch(error_state(true, "Something went wrong, check your connection or the server cannot be reached"));   
            });
        }
    }

    useEffect(() => {
        dispatch(loader_state(true));
        
        const url = "http://localhost:5000/user/getprofile";
        axios
        ({
            method: 'post',  
            url: url,
            withCredentials: true,
            data: {}  
        })
        .then((res)=>{
            dispatch(loader_state(false));
            const data = res.data
            if(res.data.status === "ok")
            {
                setEmail(data.email)
                setFirstname(data.firstname)
                setLastname(data.lastname)
                setAccount_num(data.acc_num)
                setVerify(data.verify)
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
    }, [dispatch])
    

    return (
        <>
            <div className="px-8 w-full h-full mb-20 mt-20">
                <div className="bg-[#191c24] min-h-[100px] max-w-[1000px] mx-auto py-[30px] px-[10px] rounded">
                    <h4 className="pb-4 border-bottom font-extrabold text-2xl text-white">Account settings</h4>
                    
                    <div className="py-2">
                        <form id="default_form" onSubmit={updateProfile} className="needs-validation" noValidate={true}>
                            <div className="row py-2 text-white">
                                <div className="col-md-6 pt-4"> 
                                    <label htmlFor="firstname">First Name</label> 
                                    <input type="text" name="firstname"
                                        onBlur={(e)=>{
                                            verifyFirstname(e.target.value);
                                        }}
                                        title="first_name"
                                        defaultValue={firstname}
                                        className={`${validFirstname===true ? `is-valid` : validFirstname===false ? `is-invalid`:''} ${verify===1 ? 'btn-disabled text-gray-400' :'text-white'} form-control bg-[#000] border-transparent focus:bg-[#2A3038] focus:border-[1px] focus:border-[#008000] focus:shadow-none`}
                                        required placeholder="Lendsql"/>

                                    <div className="valid-feedback">
                                        Looks good!
                                    </div>
                                    <div className="invalid-feedback">
                                        Provide a valid First Name..
                                    </div>
                                </div>
                                <div className="col-md-6 pt-4"> 
                                    <label htmlFor="lastname">Last Name</label> 
                                    <input type="text" name="lastname"
                                        onBlur={(e)=>{
                                            verifyLastname(e.target.value);
                                        }}
                                        title="last_name"
                                        defaultValue={lastname}
                                        className={`${validLastname===true ? `is-valid` : validLastname===false ? `is-invalid`:''} ${verify===1 ? 'btn-disabled text-gray-400' :'text-white'} form-control bg-[#000] border-transparent focus:bg-[#2A3038] focus:border-[1px] focus:border-[#008000] focus:shadow-none`}
                                        required placeholder="fullstack"/>

                                    <div className="valid-feedback">
                                        Looks good!
                                    </div>
                                    <div className="invalid-feedback">
                                        Provide a valid Last Name..
                                    </div>
                                </div>
                                <div className="col-md-6 pt-4"> 
                                    <label htmlFor="email">Email Address</label> 
                                    <input type="text" name="email"
                                        onBlur={(e)=>{
                                            verifyEmail(e.target.value);
                                        }}
                                        defaultValue={email}
                                        className={`${validEmail===true ? `is-valid` : validEmail===false ? `is-invalid`:''} ${verify===1 ? 'btn-disabled text-gray-400' :'text-white'} form-control bg-[#000] border-transparent focus:bg-[#2A3038] focus:border-[1px] focus:border-[#008000] focus:shadow-none`}
                                        required placeholder="fullstack@lendsqr.com"/>

                                    <div className="valid-feedback">
                                        Looks good!
                                    </div>
                                    <div className="invalid-feedback">
                                        Provide a valid Email..
                                    </div>
                                </div>
                            </div>

                            <div className="py-3 pb-4 border-bottom">
                                {verify===0 &&
                                    <button type="submit" title="save_setting" className="btn btn-outline mr-3 btn-success focus:bg-transparent">Save Changes</button>
                                }
                            </div>
                        </form>

                        <div className="py-3 pb-4 border-bottom"> 
                            <div className="col-md-6 pt-4 text-white"> 
                                <label htmlFor="firstname">Account Number</label> 
                                <input type="text" name="firstname"
                                    id="firstname"
                                    defaultValue={account_num}
                                    className={`btn-disabled text-gray-400 form-control bg-[#000] border-transparent focus:bg-[#2A3038] focus:border-[1px] focus:border-[#008000] focus:shadow-none`}
                                    required placeholder="01293484537"/>
                            </div>
                            <button type="button" className="btn btn-outline mr-3 mt-3 btn-success focus:bg-transparent">Copy</button> 
                        </div>

                        <div className="d-sm-flex align-items-center pt-3 text-white" id="deactivate">
                            <div> 
                                <b>Deactivate your account</b>
                                <p>All your money will be lost but your account history stays with us, please be certain</p>
                            </div>
                            <div className="ml-auto"> 
                                <button className="btn btn-error btn-outline">Deactivate</button> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
  
export default Settings;