import { useSelector } from "react-redux";

function Loader() {

    const loader = useSelector((state) => state.loader_state);

    return(
        <div className={`${loader.show===false ? 'hidden ' :''}fixed z-50 left-0 top-0 w-full h-full overflow-auto bg-[rgba(0,0,0,0.719)]`}>
            <div className="min-h-full flex mx-auto p-5 w-[80%] justify-center items-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    )

}

export default Loader;