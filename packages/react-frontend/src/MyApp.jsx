import React, {useState, useEffect} from 'react';
import Table from "./Table";
import Form from "./Form.jsx"

function MyApp() {
    const [characters, setCharacters] = useState([]);

    useEffect(() => {
        fetchUsers()
            .then((res) => res.json())
            .then((json) => setCharacters(json))
            .catch((error) => {
                console.log(error);
            });
    }, []);

    function updateList(person) {
        postUser(person)
            .then((newUser) => setCharacters([...characters, person]))
            .catch((error) => {
                console.log(error);
            })
    }

    function removeOneCharacter(index) {
        const characterToDelete = characters[index];
        deleteCharInBackEnd(characterToDelete._id).then((res) => {
            if (res.status == 204){
                const updated = characters.filter((character, i) => i !== index);
                setCharacters(updated);
            }
            else{
                    throw new Error("Did Not Delete Character in the Backend")
                }
        })
            .catch((error)=> {
                console.log(error)
            });
        }


    function deleteCharInBackEnd(_id){
        return fetch(`http://localhost:8000/users/${_id}`, {method: 'DELETE',
            });
    }

    return (
        <div className="container">
            <Table
                characterData={characters}
                removeCharacter={removeOneCharacter}
            />
            <Form handleSubmit={updateList}/>
        </div>
    );

    function fetchUsers() {
        const promise = fetch("http://localhost:8000/users");
        return promise;
    }

    function postUser(person) {
        const promise = fetch("http://localhost:8000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(person),
        }).then((res) => {
            if (res.status === 201) {
                return res.json(); // Return the JSON if the insertion was successful
            } else {
                throw new Error("Failed to create user"); // Handle error
            }
        });
    }
}
export default MyApp;