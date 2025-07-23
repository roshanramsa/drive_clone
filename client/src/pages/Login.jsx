import { useEffect } from "react";
import { useState } from "react";
import {useNavigate} from 'react-router-dom'

function Login(){

    const [username, setUsername] = useState();

    const navigate = useNavigate();

    const [data, setData] = useState();

    const handleSubmit = async ()=>{

        const data = await fetch (
            "http://localhost:3000/login",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({username: username})
            }
        );

        const stuff = await data.json()

        setData(stuff);
    }

    useEffect(()=>{
        console.log(data)
        if (data?.code == 1 || data?.code == 2){
            console.log("ok")
            navigate('/files')
        }
    },[data])

    return (

        <div className="flex flex-col bg-gray-300 rounded-2xl gap-10 text-gray-900 p-5">
            <h1>Username</h1>
            <input className="bg-gray-700/10 rounded-xl" onChange={(event) => {setUsername(event.target.value)}} type="text" />
            <button className="cursor-pointer" onClick={handleSubmit}>Submit</button>

            {
            (data?.code) && (
                <h1 className="text-red-500">{data.status}</h1>
            )
        }


        </div>

        

    )
}

export default Login;