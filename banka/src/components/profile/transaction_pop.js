import { useSelector } from "react-redux";
import { useState } from "react";
import { new_transac_state } from "../store/transaction_pop/action";
import { error_state } from "../store/error_pop/action";
import { success_state } from "../store/success_pop/action";
import { loader_state } from "../store/loader/action";
import { useDispatch } from "react-redux";
import { Accordion } from "react-bootstrap";
import axios from "axios";

function Transac_pop() {

    const dispatch = useDispatch();
    const error = useSelector((state) => state.new_transac_state);

    const [validUser, setValidUser] = useState(null)
    const [name, setName] = useState(null)

    const deposite = (e) =>{
        e.preventDefault();
        
        const { amount } = Object.fromEntries(
            new FormData(e.currentTarget)
        );
        dispatch(loader_state(true));
        dispatch(new_transac_state(false));

        const url = "http://localhost:5000/user/deposite";
        axios
        ({
            method: 'post',  
            url: url,
            withCredentials: true,
            data:
                {  
                    amount: amount,
                }  
        })
        .then((res)=>{
            dispatch(loader_state(false));
            if(res.data.status === "ok")
            {
                dispatch(success_state(true, res.data.message));
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

    const withdraw = (e) =>{
        e.preventDefault();
        
        const { amount } = Object.fromEntries(
            new FormData(e.currentTarget)
        );
        dispatch(loader_state(true));
        dispatch(new_transac_state(false));
        
        const url = "http://localhost:5000/user/withdraw";
        axios
        ({
            method: 'post',  
            url: url,
            withCredentials: true,
            data:
                {  
                    amount: amount,
                }  
        })
        .then((res)=>{
            dispatch(loader_state(false));
            if(res.data.status === "ok")
            {
                dispatch(success_state(true, res.data.message));
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

    const transfer = (e) =>{
        e.preventDefault();
        
        const { amount, account } = Object.fromEntries(
            new FormData(e.currentTarget)
        );
        if(amount.length>=4 && account>=10)
        {
            dispatch(loader_state(true));
            dispatch(new_transac_state(false));

            const url = "http://localhost:5000/user/transfer";
            axios
            ({
                method: 'post',  
                url: url,
                withCredentials: true,
                data:
                    {  
                        account_number: account,
                        amount: amount
                    }  
            })
            .then((res)=>{
                dispatch(loader_state(false));
                if(res.data.status === "ok")
                {
                    dispatch(success_state(true, res.data.message));
                }
                else{
                    dispatch(error_state(true, res.data.message));
                }
            })
            .catch((error) => {
                dispatch(loader_state(false));
                dispatch(error_state(true, "Something went wrong, check your connection or the server cannot be reached"));   
        
            });
        }
    }

    const findUser = (acc) =>{
        
        if(acc.length >= 10)
        {
            const url = "http://localhost:5000/user/finduser";
            axios
            ({
                method: 'post',  
                url: url,
                withCredentials: true,
                data:
                    {  
                        account_number: acc,
                    }  
            })
            .then((res)=>{
                if(res.data.status === "ok")
                {
                    setValidUser(true)
                    setName(res.data.message)
                }
                else{
                    setName(res.data.message)
                    setValidUser(false)
                }
            })
            .catch((error) => {
                setValidUser('unable to verify user')
            });
        }
        else{
            setValidUser(null)
        }
    }
    
    return(
        <div id="loading" className={`${error.show===false ? 'hidden ' :''}fixed z-50 left-0 top-0 w-full h-full overflow-auto bg-[rgba(0,0,0,0.719)]`}>
            <div className="min-h-full flex mx-auto p-5 w-[80%] justify-center items-center">
                <div className="card bg-[#191c24] text-white min-w-[360px] max-w-[400px]">
                    <h5 className="card-header text-green-500 font-extrabold">TRANSACTION</h5>
                    <div className="card-body">
                        <Accordion>
                            <Accordion.Item eventKey="0" title="open_deposite" alwaysopen="true" className="bg-[#191c24] mb-3">
                                <Accordion.Header className="">Deposit Money</Accordion.Header>
                                <Accordion.Body>
                                    <form onSubmit={deposite}>
                                        <div className="form-control text-white bg-black border-none">
                                            <label className="label">
                                                <span className="label-text">Enter amount</span>
                                            </label>
                                            <label className="input-group">
                                                <span className="w-[20%]">#</span>
                                                <input type="number" title="deposite_amount" name="amount" placeholder="1000" required min="1000" max="200000" className="input w-[80%] input-bordered"/>
                                            </label>
                                            <button type="submit" title="deposite_btn" className="btn mt-3 btn-outline btn-info focus:bg-transparent btn-sm">Deposit</button>
                                        </div>
                                    </form>
                                </Accordion.Body>
                            </Accordion.Item>

                            <Accordion.Item eventKey="1" title="open_transfer" className="bg-[#191c24] mb-3">
                                <Accordion.Header>Transfer money</Accordion.Header>
                                <Accordion.Body>
                                    <form onSubmit={transfer} className="needs-validation">
                                        <div className="form-control text-white bg-black border-none">
                                            <label className="label">
                                                <span className="label-text">User account</span>
                                            </label>
                                                <div>

                                                    <input type="number"
                                                        onBlur={(e)=>{
                                                            findUser(e.target.value);
                                                        }}
                                                        name="account"
                                                        placeholder="10928374653" required minLength={10}
                                                        className={`${validUser===true ? `is-valid` : validUser===false ? `is-invalid`:''} w-full input input-bordered`}/>
                                                    <div className="valid-feedback">
                                                        {name}
                                                    </div>
                                                    <div className="invalid-feedback">
                                                        {name}
                                                    </div>

                                                </div>
                                                
                                            
                                            <label className="label">
                                                <span className="label-text">Enter amount</span>
                                            </label>
                                            <label className="input-group w-full">
                                                <span className="w-[20%]">#</span>
                                                <input type="number" name="amount" placeholder="1000" required min="1000" max="200000" className="input w-[80%] input-bordered"/>
                                            </label>

                                            <button className="btn mt-3 btn-outline btn-info focus:bg-transparent btn-sm">Transfer</button>
                                        </div>
                                    </form>
                                </Accordion.Body>
                            </Accordion.Item>

                            <Accordion.Item eventKey="2" title="open_withdraw" className="bg-[#191c24] mb-3">
                                <Accordion.Header>Withdraw</Accordion.Header>
                                <Accordion.Body>
                                    <form onSubmit={withdraw}>
                                        <div className="form-control text-white bg-black border-none">
                                                                                      
                                            <label className="label">
                                                <span className="label-text">Enter amount</span>
                                            </label>
                                            <label className="input-group w-full">
                                                <span className="w-[20%]">#</span>
                                                <input type="number" title="withdraw_amount" name="amount" placeholder="1000" required min="1000" max="200000" className="input w-[80%] input-bordered"/>
                                            </label>

                                            <button title="withdraw_btn" className="btn mt-3 btn-outline btn-info focus:bg-transparent btn-sm">Withraw</button>
                                        </div>
                                    </form>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                        <button
                            onClick={(e)=>{dispatch(new_transac_state(false))}}
                            className="btn btn-info btn-outline focus:bg-transparent px-5 close_pop">Close</button>
                       
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Transac_pop;