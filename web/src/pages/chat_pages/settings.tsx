import { checkLogin } from "../../cookies";

import '../../styles/chat.css';

export default function Settings() {
    if (checkLogin()) {
        return (
            <>

            </>
        )
    } else {
        return <h1 style={{color: 'white'}}>Internal Error.</h1>
    }
}