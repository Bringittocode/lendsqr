import { Link } from "react-router-dom";

function Home(props) {
    document.title = props.title;

    return (
        <div className="w-[100vw] flex bg-black items-center h-[100vh]">
            <div className="card w-[360px] mx-auto sm:w-96 bg-[#191c24] sm:mx-auto shadow-xl">
                <div className="card-body text-white">
                    <h2 className="card-title uppercase">Lendsqr assessment</h2>
                    <p>My name is 
                        <span className="font-extrabold"> AZEEZ IBRAHIM</span>.<br/>
                        This project is been made using 
                        <span className="font-extrabold"> REACT</span>, and 
                        <span className="font-extrabold"> NODEJS</span>. <br/><br/>

                        <span className="font-extrabold"> FRONTEND MAKEUP:</span><br/>
                        <a className=" text-blue-400" href="https://reactjs.org/">React</a>,
                        <a className=" text-blue-400" href="https://tailwindcss.com/"> tailwindcss</a>,
                        <a className=" text-blue-400" href="https://daisyui.com/"> daisyui</a><br/><br/>

                        <span className="font-extrabold"> BACKEND MAKEUP:</span><br/>
                        <a className=" text-blue-400" href="https://nodejs.org/">Nodejs</a>,
                        <a className=" text-blue-400" href="https://fastify.io/"> Fastify</a>,
                        <a className=" text-blue-400" href="https://knexjs.org/"> Knexjs</a>
                    </p>

                    <div className="card-actions justify-center">
                        <Link className="btn btn-outline btn-info mt-3" to="/registration">Continue</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
  
export default Home;