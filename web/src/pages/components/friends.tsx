import { useEffect, useState } from "react";
import { getUsername } from "../../cookies";

interface ResponseData {
    success: boolean;
    friends: any;
}

export default function FriendsComponent() {
    const [friends, setFriends] = useState<string[]>([]);
    const username = getUsername();
    
    const updateFriends = () => {
        fetch('http://localhost:3001/getFriends', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username})
        })
        .then((response: Response) => response.json())
        .then((data: ResponseData) => {
            if (data.success) {
                setFriends(data.friends);
                console.log(data.friends);
            } else {
                console.error("internal error");
            }
        })
        .catch(error => console.error('Error fetching friends:', error));
    } 

    useEffect(() => {
        updateFriends();
    }, []);

    function removeFriend(friend: string) {
        console.log("В данный момент удалить: " + friend + " невозможно")
    }
        

    return (
        <>
        <ul>
            {friends.map(friend => (
                <li key={friend}>{friend} <button onClick={() => removeFriend(friend)}>-</button></li>
            ))}
        </ul>
        </>
    )
}