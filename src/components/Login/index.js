import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { useEffect, useState } from "react";
import { BASE_API_URL } from "../../constant";

const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const navigate = useNavigate();

    useEffect(() => {
        const authenticated = localStorage.getItem('authenticated');

        if (authenticated !== null && authenticated !== undefined) {
            navigate('/');
        }
    }, [])

    const submit = async () => {
        if (username == '') {
            setUsernameError('this field is required')
        } else {
            setUsernameError('')
        }

        if (password == '') {
            setPasswordError('this field is required')
        } else {
            setPasswordError('')
        }

        if (username != '' && password != '') {
            const url = BASE_API_URL + '/api/auth';

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password, password
                })
            })

            const data = await res.json();
            
            if (data.result == 'success') {
                localStorage.setItem('authenticated', true);
                localStorage.setItem('username', data.data.username);
                navigate('/');
            } else {
                setErrorMessage(data.data);
            }
        }
    }

    return (
        <div className="w-full h-full flex flex-col relative">
            <Navbar />

            <div className="grow w-full h-full flex flex-col items-center justify-center px-10 py-12 md:px-20 lg:px-32 z-10">
                <div className="text-3xl font-medium italic">Sign in to Plagiarism Checker</div>

                {
                    errorMessage != '' ?
                        <div className="w-96 mt-8 px-3 py-2 border border-red-700 rounded bg-red-200 text-red-700">
                            {errorMessage}
                        </div>
                        :
                        null
                }


                <div className="w-96 mt-8 px-8 py-6 flex flex-col border border-slate-700 rounded shadow-md">
                    <label for='username'>Username or Email Address</label>
                    <input id='username' type='text' value={username} onChange={e => setUsername(e.target.value)} />
                    <span className="mt-1 text-red-600 text-xs">{usernameError}</span>

                    <label for='password' className="mt-5">Password</label>
                    <input id='password' type='password' value={password} onChange={e => setPassword(e.target.value)} />
                    <span className="mt-1 text-red-600 text-xs">{passwordError}</span>

                    <button className="btn btn-blue mt-5" onClick={submit}>Sign in</button>

                    <div className="w-full mt-6 pt-1 flex items-center border-t border-slate-500">
                        No have account yet?
                        <Link to='/register' className="ms-auto text-blue-500 hover:text-blue-700 underline">Register</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;
