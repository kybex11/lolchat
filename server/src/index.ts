import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser, { json } from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app: Express = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

app.use(express.json());

let users: any = {};

interface User {
    name: any;
    description: any;
    id: number;
    verified: boolean;
    password: string;
    email: any;
    friends: [];
}

interface Message {
    sender: string;
    content: string;
}

try {
    users = JSON.parse(fs.readFileSync('./users.json', 'utf8'));
} catch (err) {
    console.error(err);
}

function register(req: Request, res: Response) {
    const { username, email, password } = req.body;

    if (users[username]) {
        res.json({ success: false, message: 'Username already taken' });
    } else {
        users[username] = {
            email,
            password,
            friends: [],
            name: null,
            description: null,
            id: null,
            verifed: false
        };
        fs.writeFile('users.json', JSON.stringify(users), (err) => {
            if (err) {
                console.error(err);
                res.json({ success: false, message: 'Failed to register' });
            } else {
                res.json({ success: true, message: 'Registered successfully' });
            }
        });
    }
}

function createNewDM(req: Request, res: Response) {
    const { userone, usertwo } = req.body;

    const filePath1 = path.join(__dirname, 'dm', `${userone}+${usertwo}.json`);
    const filePath2 = path.join(__dirname, 'dm', `${usertwo}+${userone}.json`);

    try {
        const data = fs.readFileSync(filePath1, 'utf8');
    } catch (err) {
        try {
            const data = fs.readFileSync(filePath2, 'utf8');
        } catch (err) {
            fs.appendFileSync(`dm/${userone}+${usertwo}.json`, '[]');
            res.json({ success: true });
        }
    }
}

function removeDM(req: Request, res: Response) {
    const { userone, usertwo } = req.body;
    fs.unlinkSync(`dm/${userone}+${usertwo}.json`);
    res.json({ success: true });
}

const createNewMessage = (req: Request, res: Response, next: NextFunction): void => {

    try {

        const { userone, usertwo, message } = req.body;

        const filePath = path.join(__dirname, 'dm', `${userone}+${usertwo}.json`);
        const filePath2 = path.join(__dirname, 'dm', `${usertwo}+${userone}.json`);


        let messages: Message[] = [];


        try {

            const data = fs.readFileSync(filePath, 'utf-8');

            messages = JSON.parse(data);

        } catch (err) {

            try {

                const data = fs.readFileSync(filePath2, 'utf8');

                messages = JSON.parse(data);

            } catch (err) {

                messages = []; // Ensure messages is an empty array if files are not found

                console.log("File not found, starting with an empty message list.");

            }

        }


        messages.push({ sender: userone, content: message });

        fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));

        res.json({ success: true, message: "Message added successfully." });

    } catch (err) {

        next(err); // Pass the error to the next middleware

    }

};


const getMessages = (req: Request, res: Response, next: NextFunction): void => {
    const { userone, usertwo } = req.body;

    const filePath = path.join(__dirname, 'dm', `${userone}+${usertwo}.json`);
    const filePath2 = path.join(__dirname, 'dm', `${usertwo}+${userone}.json`);

    let messages: Message[] = [];

    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        messages = JSON.parse(data);
    } catch (err) {
        try {
            const data = fs.readFileSync(filePath2, 'utf-8');
            messages = JSON.parse(data);
        } catch (err) {
            res.json({ data: "DM not found" }); // Potential double response
            return; // Exit to prevent further execution
        }
    }

    res.json({ data: messages });
};

function addFriend(req: Request, res: Response): void {
    const { username, friendUsername } = req.body;

    if (!users[username]) {
        res.status(404).json({ success: false, message: 'User  not found' });
    }

    if (!users[friendUsername]) {
        res.status(404).json({ success: false, message: 'Friend not found' });
    }

    if (users[username].friends.includes(friendUsername)) {
        res.json({ success: false, message: 'Already friends' });
    }

    users[username].friends.push(friendUsername);
    users[friendUsername].friends.push(username);

    fs.writeFile('users.json', JSON.stringify(users), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Failed to add friend' });
        }

        return res.json({ success: true, message: 'Friend added successfully' });
    });
}

function getFriends(req: Request, res: Response): void {
    const { username } = req.body;

    if (!users[username]) {
        res.status(404).json({ success: false, message: 'User not found' });
    }

    const friendsList = users[username].friends;
    res.json({ success: true, friends: friendsList });
}

function login(req: Request, res: Response) {
    const { username, password } = req.body;
    if (users[username] && users[username].password === password) {
        res.json({ success: true, message: 'Login successful!' });
    } else {
        res.json({ success: false, message: 'Invalid username or password' });
    }
};

app.post('/newdm', createNewDM);//
app.post('/rmdm', removeDM);

app.post('/createMessage', createNewMessage);//
app.post('/getMessages', getMessages);//

app.post('/register', register);//
app.post('/login', login);//

app.post('/addFriends', addFriend);//
app.post('/getFriends', getFriends);//

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
})