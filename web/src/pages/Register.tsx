import React, { useRef } from "react"
import { setLoginTrue, setPasswordValue, setUsernameValue } from "../cookies";
import '../styles/forms.css';

interface FormData {
    username: string;
    email: string;
    password: string;
}

interface ResponseData {
    success: boolean;
    message: string;
}

export default function Register() {
    const usernameInputRef = useRef<HTMLInputElement>(null);
    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const retryPasswordInputRef = useRef<HTMLInputElement>(null);

    function moveToLogin() {
        window.location.href = "/router/login";
    }

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();

        const username = usernameInputRef.current?.value;
        const email = emailInputRef.current?.value;
        const password = passwordInputRef.current?.value;
        const retryPassword = retryPasswordInputRef.current?.value;

        if (!username || !email || !password || !retryPassword) {
            alert('Please fill in all fields!');
            return;
        }

        if (username.length >= 18) {
            alert('max length on username 18');
            return;
        }

        if (password !== retryPassword) {
            alert('Passwords do not match!');
            return;
        }

        const formData: FormData = {
            username: username,
            email: email,
            password: password,
        };

        fetch('http://localhost:3001/register', {
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
                const status = document.getElementById("status");
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
            <h1 className="h1_">Register</h1>
            <br />
            <input type="text" ref={usernameInputRef} name="username" placeholder="Username"/>
            <br />
            <input type="email" ref={emailInputRef} name="email" placeholder="Email"/>
            <br />
            <input type="password" ref={passwordInputRef} name="password" placeholder="Password" />
            <br />
            <input type="password" ref={retryPasswordInputRef} name="retryPassword" placeholder="Retry Password"/>
            <br /><br />
            <button onClick={handleSubmit} className="button_">Register</button>
            <p id="status"></p>
            <br /><br />
            <button onClick={moveToLogin} className="button_">You have account?</button>
        </div>
        </>
    )
}