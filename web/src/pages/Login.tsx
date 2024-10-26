import { setLoginTrue, setPasswordValue, setUsernameValue } from '../cookies';
import '../styles/forms.css';
import React, { useRef } from 'react';

interface FormData {
    username: string;
    password: string;
  }
  
interface ResponseData {
    success: boolean;
    message: string;
}

export default function Login() {
    const usernameInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);

    function moveToRegister() {
        window.location.href = "/router/register";
    }

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();

        const username = usernameInputRef.current?.value;
        const password = passwordInputRef.current?.value;

        if (!username || !password) return;

        const formData: FormData = {
            username: username,
            password: password,
        };

        fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then((response: Response) => response.json())
        .then((data: ResponseData) => {
            if (data.success) {
                setLoginTrue();
                setUsernameValue(formData.username);
                setPasswordValue(formData.password);
                window.location.href = "/web";
            } else {
                const status = document.getElementById('status');
                if (status) {
                    status.innerHTML = data.message;
                }
            }
        })
        .catch((error: Error) => console.error(error));
        
    }

    return (
        <>
        <div className="container">
            <h1 className="h1_">Authorization</h1>
            <br />
            <input type="text" ref={usernameInputRef} placeholder='Username'/>
            <br />
            <input type="password" ref={passwordInputRef} placeholder='Password'/>
            <br /><br />
            <button onClick={handleSubmit} className="button_">Login</button>
            <p id="status"></p>
            <br /><br />
            <button onClick={moveToRegister} className="button_">Don't have account?</button>
        </div>
        </>
    )
}