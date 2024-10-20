import express from "express";
import cors from "cors"

const app = express();
const port = 8000;

const users = {
    users_list: [
        {
            id: "xyz789",
            name: "Charlie",
            job: "Janitor"
        },
        {
            id: "abc123",
            name: "Mac",
            job: "Bouncer"
        },
        {
            id: "ppp222",
            name: "Mac",
            job: "Professor"
        },
        {
            id: "yat999",
            name: "Dee",
            job: "Aspring actress"
        },
        {
            id: "zap555",
            name: "Dennis",
            job: "Bartender"
        }
    ]
};

const findUserByName = (name) => {
    return users["users_list"].filter(
        (user) => user["name"] === name
    );
};

const findUserById = (id) =>
    users["users_list"].find((user) => user["id"] === id);

const findUsersByNameAndJob = (name, job) => {
    return users["users_list"].filter(
        (user) => user["name"].toLowerCase() === name.toLowerCase() &&
            user["job"].toLowerCase() === job.toLowerCase()
    );
};

const generateID = () =>{
    return Math.random().toString(36).substr(2,9);

}
const addUser = (user) => {
    user.id = generateID();
    console.log("Added User ID:", user.id)
    users["users_list"].push(user);
    return user;
};

const removeUserById = (id) =>{
    const userToRemove = findUserById(id);
    if (userToRemove) {
        users["users_list"] = users["users_list"].filter(user => user["id"] !== id);
        return userToRemove;
    }
};

app.use(cors());
app.use(express.json());

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    addUser(userToAdd);
    res.status(201).json(userToAdd);
});

app.get("/users", (req, res) => {
    //this is get for all users and for name and name and job/
    const name = req.query.name;
    const job = req.query.job;

    if (name && job) {
        let result = findUsersByNameAndJob(name, job);
        res.send(result);
    } else if (name) {
        let result = findUserByName(name);
        res.send(result);
    } else {
        res.send(users.users_list);
    }
});

app.get("/users/:id", (req, res) => {
    //this is get by ID
    const id = req.params["id"]; //or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send("Resource not found.");
    } else {
        res.send(result);
    }
});

app.delete("/users/:id", (req, res) => {
    const id = req.params["id"];
    let result = removeUserById(id);
    if (result === undefined){
        res.status(404).send("Resource not found.");
    } else{
        res.status(204).send(result);
    }
});

app.listen(port,() => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});