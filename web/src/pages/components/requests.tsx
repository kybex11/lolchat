import { useRef } from "react";
import { getUsername } from "../../cookies";

interface ResponseData {
    success: boolean;
    message: string;
}

export default function FriendRequestsComponent() {
    const inputRef = useRef<HTMLInputElement>(null);
    const username = getUsername();
    
    function send() {
        const friendName = inputRef.current?.value;
        console.log(friendName);

        if (!friendName) {
            alert('Field is empty');
            return;
        }

        fetch('http://lolchat.online/server/addFriends', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username, friendUsername: friendName })
        })
        .then((response: Response) => response.json())
        .then((data: ResponseData) => {
            console.log(data);
            if (data.success) {
                alert('Friend added');
            } else {
                alert(`Error: ${data.message}`);
            }
        })
    }

    return (
        <>
        <input type="text" ref={inputRef} placeholder="Enter a friend name"/>
        <button onClick={send} className="button">Add Friend</button>
        </>
    )
}