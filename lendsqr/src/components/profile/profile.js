import {BsFillArrowDownCircleFill, BsFillArrowUpRightCircleFill, BsFillArrowUpCircleFill} from "react-icons/bs"
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loader_state } from "../store/loader/action";
import { new_transac_state } from "../store/transaction_pop/action";
import { error_state } from "../store/error_pop/action";
import numbro from "numbro";
import TransacPop from "./transaction_pop";

numbro.zeroFormat("0");
numbro.setDefaults({
    spaceSeparated:true,
    thousandSeparated: true,
    mantissa: 2,
})

function Profile(props) {
    document.title = props.title;

    const dispatch = useDispatch();

    const [result, setResult] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [income, setIncome] = useState(0)
    const [expense, setExpense] = useState(0)
    const [total_page, setTotal_page] = useState(0)
    const [next, setNext] = useState(1)
    const [prev, setPrev] = useState(0)
    
    useEffect(() => {
        dispatch(loader_state(true));
        
        const url = "http://localhost:5000/user/gethistory";
        axios
        ({
            method: 'post',  
            url: url,
            withCredentials: true,
            data: {
                from: 0,
            }  
        })
        .then((res)=>{
            dispatch(loader_state(false));
            const data = res.data
            if(res.data.status === "ok")
            {
                setResult(data.results)
                setIncome(data.income)
                setExpense(data.expense)
                setTotal_page(data.total)
                setNext(data.next_page)
                setPrev(data.prev_page)
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
     
    }, [])// eslint-disable-line react-hooks/exhaustive-deps

    const addZero = (i)=> {
        if (i < 10) {i = "0" + i}
        return i;
    }

    const Refresh =()=>{
        setRefreshing(true)
        const url = "http://localhost:5000/user/gethistory";
        axios
        ({
            method: 'post',  
            url: url,
            withCredentials: true,
            data: {
                page: 0,
            }  
        })
        .then((res)=>{
            const data = res.data
            setRefreshing(false)
            if(res.data.status === "ok")
            {
                setResult(data.results)
                setIncome(data.income)
                setExpense(data.expense)
                setTotal_page(data.total)
                setNext(data.next_page)
                setPrev(data.prev_page)
            }
        })
        .catch((error) => {
            setRefreshing(false)
        });
    }

    const nextPage =(page)=>{
        setRefreshing(true)
        console.log(page, next);
        const url = "http://localhost:5000/user/gethistory";
        axios
        ({
            method: 'post',  
            url: url,
            withCredentials: true,
            data: {
                page: page,
            }  
        })
        .then((res)=>{
            const data = res.data
            setRefreshing(false)
            if(res.data.status === "ok")
            {
                setResult(data.results)
                setIncome(data.income)
                setExpense(data.expense)
                setTotal_page(data.total)
                setNext(data.next_page)
                setPrev(data.prev_page)
            }
        })
        .catch((error) => {
            setRefreshing(false)
        });
    }

    const prevPage =(page)=>{
        setRefreshing(true)
        const url = "http://localhost:5000/user/gethistory";
        axios
        ({
            method: 'post',  
            url: url,
            withCredentials: true,
            data: {
                page: page,
            }  
        })
        .then((res)=>{
            const data = res.data
            setRefreshing(false)
            if(res.data.status === "ok")
            {
                setResult(data.results)
                setIncome(data.income)
                setExpense(data.expense)
                setTotal_page(data.total)
                setNext(data.next_page)
                setPrev(data.prev_page)
            }
        })
        .catch((error) => {
            setRefreshing(false)
        });
    }

    return (
        <>
            <TransacPop/>
            <div className="px-8 w-full h-full mb-20 mt-20">
                <div className="bg-[#191c24] min-h-[100px] max-w-[1000px] mx-auto py-[30px] px-[10px] rounded">
                    <nav className="navbar navbar-expand-lg navbar-dark dark d-lg-flex align-items-lg-start">
                        <button className="navbar-brand block">
                            Transactions 
                            <p className="text-muted pl-1">Welcome to your transactions</p> 
                        </button>
                       
                    </nav>

                    <div className="w-full flex justify-center">
                        <button title="refresh" onClick={()=>{Refresh()}} className={`${refreshing ? 'loading': ''} focus:bg-transparent btn btn-info btn-outline `}>refresh</button>
                    </div>

                    <div className="row mt-2 pt-2 text-white">
                        <div className="col-md-6" id="income">
                            <div className="d-flex justify-content-start align-items-center">
                                <BsFillArrowDownCircleFill className="text-green-300 font-bold text-[20px]" />
                                <p className="text mx-3">Income</p>
                                <p className="ml-4 money uppercase text-green-300">#{numbro(income).format()}</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="d-flex justify-content-md-end align-items-center">
                                <BsFillArrowUpCircleFill className="text-red-300 font-bold text-[20px]"/>
                                <div className="text mx-3">Expense</div>
                                <div className="ml-4 money uppercase text-red-400">#{numbro(expense).format()}</div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <ul className="nav nav-tabs w-75">
                            <li className="nav-item bg-black"> 
                                <button className="btn bg-[#191c24] btn-outline rounded-none active:text-black focus:text-black text-white">History</button>
                            </li>
                            <p className="text-green-600 ml-5 font-mono text-base font-bold">Balance: #{numbro(income-expense).format()}</p>
                        </ul> <button className="btn btn-outline" title="new_transaction" onClick={(e)=>{dispatch(new_transac_state(true))}}>New Transaction</button>
                    </div>

                    {result !== false &&
                        <>
                            <div className="table-responsive mt-2">
                                <table className="table bg-black table-borderless">
                                    <thead>
                                        <tr className="font-bold text-base text-gray-300">
                                            <th scope="col">Activity</th>
                                            <th scope="col">Mode</th>
                                            <th scope="col">Date</th>
                                            <th scope="col" className="text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.map((data, i) => (
                                            <tr className={`${i%2 === 0 ? 'bg-[#191c24]' : ''}`} key={i+"a"}>
                                                <td key={i+"b"} className="font-bold text-white flex items-center"> 
                                                    {data.Mode === "Deposite" ?
                                                        <BsFillArrowDownCircleFill key={i+"c"} className="text-green-300 mr-2 font-bold text-[20px]" /> 
                                                        
                                                    : data.Mode === "Withdraw" ?
                                                        <BsFillArrowUpCircleFill className="text-red-300 mr-2 font-bold text-[20px]" />

                                                    :
                                                        <BsFillArrowUpRightCircleFill className="text-red-300 mr-2 font-bold text-[20px]" />
                                                    }
                                                    {data.Account}
                                                     
                                                </td>
                                                <td key={i+"d"}  className="font-light text-base text-gray-200">{data.Mode}</td>
                                                <td key={i+"e"} className="text-muted">{new Date(data.Created).toDateString()} {addZero(new Date(data.Created).getHours())}
                                                    :
                                                    {addZero(new Date(data.Created).getMinutes())}
                                                    :
                                                    {addZero(new Date(data.Created).getSeconds())}
                                                </td>
                                                <td key={i+"f"} className="flex justify-end font-bold text-white">#{numbro(data.Amount).format()} </td>
                                            </tr>
                                        ))}
                                        
                                        
                                    </tbody>
                                </table>
                            </div>
                            <div className="d-flex justify-content-between text-white align-items-center results"> <span className="pl-md-3">Showing page <b className="text-white"> {next} of {total_page} </b></span>
                                <div className="pt-3">
                                    <nav aria-label="Page navigation example">
                                        <ul className="pagination">
                                            <li className={`${prev < 0 ?'disabled' :''} page-item `}> 
                                                <button onClick={()=>{prevPage(prev)}} className="page-link bg-black text-white" href="#" aria-label="Previous">
                                                     <span aria-hidden="true">&lt;</span> 
                                                </button> 
                                            </li>
                                            <li className={`${next >= total_page ?'disabled' :''} page-item`}> 
                                                <button onClick={()=>{nextPage(next)}} className="page-link bg-black text-white" href="#" aria-label="Next"> 
                                                    <span aria-hidden="true">&gt;</span> 
                                                </button> 
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </>
                    }

                    {result===false &&
                    
                        <div className="flex my-5 justify-center items-center">
                            <p className="font-extrabold text-white text-lg">
                                You don't have any history yet
                            </p>

                        </div>
                    }
                </div>
            </div>
        </>
    )
}
  
export default Profile;