import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { BASE_API_URL } from "../../constant";

const Register = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const [emailError, setEmailError] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [password2Error, setPassword2Error] = useState('')

    const [errorMessage, setErrorMessage] = useState('')

    const navigate = useNavigate();

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const checkEmailExist = async () => {
        const url = BASE_API_URL + '/api/email_exist';

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email
            })
        })

        const data = await res.json();

        if (data.result == 'success') {
            return false;
        } else {
            return true;
        }
    }

    const checkUsernameExist = async () => {
        const url = BASE_API_URL + '/api/username_exist';

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username
            })
        })

        const data = await res.json();

        if (data.result == 'success') {
            return false;
        } else {
            return true;
        }
    }

    const submit = async () => {
        let valid = true;

        if (email == '') {
            setEmailError('this field is required');
            valid = false;
        } else if (!validateEmail(email)) {
            setEmailError('email is invalid');
            valid = false;
        } else {
            setEmailError('');
        }

        if (username == '') {
            setUsernameError('this field is required')
            valid = false;
        } else if (username.length < 8 || username.length > 20) {
            setUsernameError('username length must between 8-20')
            valid = false;
        } else {
            setUsernameError('')
        }

        if (password == '') {
            setPasswordError('this field is required')
            valid = false;
        } else {
            setPasswordError('')
        }

        if (password2 == '') {
            setPassword2Error('this field is required')
            valid = false;
        } else if (password2 != password) {
            setPassword2Error('passwords are not same')
            valid = false;
        } else {
            setPassword2Error('')
        }

        if (valid) {
            // check email is already exist
            const isEmailExist = await checkEmailExist();
            const isUsernameExist = await checkUsernameExist();

            if (isEmailExist) {
                setErrorMessage('Email already exists');
                return;
            } else {
                setErrorMessage('');
            }

            // check username is already exist
            if (isUsernameExist) {
                setErrorMessage('Username already exists');
                return;
            } else {
                setErrorMessage('');
            }

            const url = BASE_API_URL + '/api/register';

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    username: username,
                    password: password
                })
            })

            const data = await res.json();

            if (data.result == 'success') {
                navigate('/login');
            }
        }
    }

    return (
        <div className="w-full h-full flex flex-col relative">
            <Navbar />

            <div className="grow w-full h-full flex flex-col items-center justify-center px-10 py-12 md:px-20 lg:px-32 z-10">
                <div className="text-3xl font-medium italic">Register new account</div>

                {
                    errorMessage != '' ?
                        <div className="w-96 mt-8 px-3 py-2 border border-red-700 rounded bg-red-200 text-red-700">
                            {errorMessage}
                        </div>
                        :
                        null
                }


                <div className="w-96 mt-8 px-8 py-6 flex flex-col border border-slate-700 rounded shadow-md">
                    <label for='email'>Email</label>
                    <input id='email' type='email' value={email} onChange={e => setEmail(e.target.value)} />
                    <span className="mt-1 text-red-600 text-xs">{emailError}</span>

                    <label for='username' className="mt-5">Username</label>
                    <input id='username' type='text' value={username} onChange={e => setUsername(e.target.value)} />
                    <span className="mt-1 text-red-600 text-xs">{usernameError}</span>

                    <label for='password' className="mt-5">Password</label>
                    <input id='password' type='password' value={password} onChange={e => setPassword(e.target.value)} />
                    <span className="mt-1 text-red-600 text-xs">{passwordError}</span>

                    <label for='password2' className="mt-5">Confirmed Password</label>
                    <input id='password2' type='password' value={password2} onChange={e => setPassword2(e.target.value)} />
                    <span className="mt-1 text-red-600 text-xs">{password2Error}</span>

                    <button className="btn btn-blue mt-5" onClick={submit}>Sign Up</button>

                    <div className="w-full mt-6 pt-1 flex items-center border-t border-slate-500">
                        Already have an account?
                        <Link to='/login' className="ms-auto text-blue-500 hover:text-blue-700 underline">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;
