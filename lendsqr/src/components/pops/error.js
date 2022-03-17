import { useSelector } from "react-redux";
import { error_state } from "../store/error_pop/action";
import { useDispatch } from "react-redux"

function Error() {

    const dispatch = useDispatch();
    const error = useSelector((state) => state.error_state);
    
    return(
        <div id="loading" title="error_pop" className={`${error.show===false ? 'hidden ' :''}fixed z-50 left-0 top-0 w-full h-full overflow-auto bg-[rgba(0,0,0,0.719)]`}>
            <div className="min-h-full flex mx-auto p-5 w-[80%] justify-center items-center">
                <div className="card bg-[#191c24] text-white min-w-[360px] max-w-[400px]">
                    <h5 className="card-header text-red-500 font-extrabold">ERROR</h5>
                    <div className="card-body">
                        <h5 className="card-title">Invalid request</h5>
                        <p className="card-text" id="error_text">{error.message}</p>
                        <div className="d-flex justify-content-center">
                            <button
                                title="hide error"
                                onClick={(e)=>{dispatch(error_state(false))}}
                                className="btn btn-info btn-outline focus:bg-transparent px-5 close_pop">Ok</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Error;