import { useSelector } from "react-redux";
import { success_state } from "../store/success_pop/action";
import { useDispatch } from "react-redux"

function Success() {

    const dispatch = useDispatch();
    const success = useSelector((state) => state.success_state);

    return(
        <div id="loading" className={`${success.show===false ? 'hidden ' :''}fixed z-50 left-0 top-0 w-full h-full overflow-auto bg-[rgba(0,0,0,0.719)]`}>
            <div className="min-h-full flex mx-auto p-5 w-[80%] justify-center items-center">
                <div className="card bg-[#191c24] text-white min-w-[360px] max-w-[400px]">
                    <h5 className="card-header text-green-500 font-extrabold">SUCCESS</h5>
                    <div className="card-body">
                        <h5 className="card-title">Request sent</h5>
                        <p className="card-text" id="error_text">{success.message}</p>
                        <div className="d-flex justify-content-center">
                            <button
                                title="success_btn"
                                onClick={(e)=>{dispatch(success_state(false))}}
                                className="btn btn-info btn-outline focus:bg-transparent px-5 close_pop">Ok</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Success;