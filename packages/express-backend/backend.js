import express from "express";
import cors from "cors"
import mongoose from "mongoose"

const app = express();
const port = 8000;


const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        job: {
            type: String,
            required: true,
            trim: true,
            validate(value) {
                if (value.length < 2)
                    throw new Error("Invalid job, must be at least 2 characters.");
            },
        },
    },
    { collection: "users_list" }
);

const User = mongoose.model("User", UserSchema);

mongoose.set("debug", true);

mongoose
    .connect("mongodb://localhost:27017/users", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch((error) => console.log("MongoDB connection error:", error));


function getUsers(name, job) {
    let promise;
    if (name === undefined && job === undefined) {
        promise = User.find();
    } else if (name && !job) {
        promise = findUserByName(name);
    } else if (job && !name) {
        promise = findUserByJob(job);
    }
    return promise;
}

function findUserById(id) {
    return User.findById(id);
}

function addUser(user) {
    const userToAdd = new User(user);
    const promise = userToAdd.save();
    return promise;
}

function findUserByName(name) {
    return User.find({ name: name });
}

function findUserByJob(job) {
    return User.find({ job: job });
}

function findUsersByNameAndJob(name, job) {
    return User.find({ name: name, job: job });
}




app.use(cors());
app.use(express.json());

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    addUser(userToAdd)
        .then(result => {
            res.status(201).json(result); // Send back saved user
        })
        .catch(error => {
            res.status(500).send("Error adding user");
        });
});


app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;

    if (name && job) {
        findUsersByNameAndJob(name, job)
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                res.status(500).send("Error fetching users");
            });
    } else if (name) {
        findUserByName(name)
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                res.status(500).send("Error fetching users");
            });
    } else {
        getUsers()
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                res.status(500).send("Error fetching users");
            });
    }
});


app.get("/users/:id", (req, res) => {
    const id = req.params.id;
    findUserById(id)
        .then(result => {
            if (!result) {
                res.status(404).send("Resource not found.");
            } else {
                res.send(result);
            }
        })
        .catch(error => {
            res.status(500).send("Error fetching user by ID");
        });
});


app.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    User.findByIdAndRemove(id)
        .then(result => {
            if (!result) {
                res.status(404).send("Resource not found.");
            } else {
                res.status(204).send();
            }
        })
        .catch(error => {
            res.status(500).send("Error deleting user");
        });
});


app.listen(port,() => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});
//thats my dawg