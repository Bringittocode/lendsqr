import Registration from './components/registration/layout';
import PROFILE_LAYOUT from './components/profile/layout';
import Loader from './components/pops/loader'
import ERROR_PAGE from './components/404'
import Home from './components/home'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from 'react';
import axios from "axios"
import Error from './components/pops/error';
import Success from './components/pops/success';

function App() {
   
    useEffect(() => {
        const url = "http://localhost:5000/auth/access";
        axios
        ({
            method: 'post',  
            url: url,
            withCredentials: true,
            data:{}
        })
        .then()
        .catch((error) => {});
    }, [])
    

    return (
        <>
        <Loader/>
        <Error/>
        <Success/>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home title="Home" />}></Route>
                <Route path="registration" element={<Registration title="Registration" />} />
                <Route path="profile" element={<PROFILE_LAYOUT />}>
                    <Route path=":pages" element={<PROFILE_LAYOUT />} />
                </Route>
                <Route path="*" element={<ERROR_PAGE />} />
            </Routes>
        </BrowserRouter>
        </>
    );
}

export default App;
