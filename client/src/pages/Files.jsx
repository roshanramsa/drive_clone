import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react"

function Files(){

    const [add, setAdd] = useState(false);

    const [type, setType] = useState("file")

    const [pop, setPop] = useState(false)

    const [folder, setFolder] = useState([])

    const [foldername, setFolderName] = useState(null)

    const [files, setFiles] = useState([]);

    const index = useRef(0);

    const [imgurl, setImgurl] = useState(null);
    const [img, setImg] = useState(null)

    const changeImage = (e) => {
        const img = e.target.files[0];
        if (img != null){
            const url = URL.createObjectURL(img);
            setImgurl(url);
        } 
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()
        const formData = new FormData();
        formData.append('file', img)
        console.log(folder.join('/'));
        formData.append('folder', folder.join('/'))
        const upload = await fetch(
            "http://localhost:3000/upload",
            {
                method: "POST",
                credentials: "include",
                body: formData
            }
        )
    }

    const addFolder = async () => {
        await fetch(
            "http://localhost:3000/add-folder",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({foldername: foldername, folder: folder.join('/')})
            }
        )
    }


    async function getStuff(){
        const get =  await fetch(
            "http://localhost:3000/get-stuff",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({folder: folder.join('/')})
            }
        )

        const data = await get.json();

        setFiles(data.files);
    }

    useEffect(()=>{
        console.log(new Array(folder).join('/'))
        getStuff();
    },[folder])

    return(

        <div className="w-full mt-30 min-h-screen flex flex-col items-center">

            <div className="w-full z-1 bg-gray-200/50 rounded-2xl p-5">
                <div className="w-full mb-5 flex justify-between">
                    <button onClick={()=>{setFolder(prev => prev.slice(0, -1))}} className="cursor-pointer">{"<"}</button>

                    <h1>/{folder.join('/')}</h1>

                    <div className="flex gap-5">
                        <select onChange={(e) => {setType(e.target.value)}} name="" id="">
                            <option value="file">File</option>
                            <option value="folder">Folder</option>
                        </select>
                        <button onClick={()=>{setPop(true)}} className="cursor-pointer hover:scale-105">+</button>
                    </div>
                    
                </div>
                
                <div className="min-h-150 bg-white/10 text-2xl rounded-xl">
                    {
                        files.map((file, index) => (
                            <div onClick={()=>{if (file.type == "folder") setFolder(prev => [...prev, file.name]); else window.location.href = `http://localhost:3000/download?folder=${folder.join('/')}&filename=${file.name}`}} className="p-2 py-3 bg-white/10 mx-1 cursor-pointer hover:scale-101 rounded-xl my-1">
                                <h1>{file.type == "folder" ? '/' : ''}{file.name}</h1>
                            </div>
                            
                        ))
                    }
                </div>

                {
                    (pop) && (
                        <div className="z-1 top-0 left-0 fixed w-screen h-screen flex flex-col items-center justify-center">
                            <div onClick={()=>{setPop(false

                            )}} className="fixed -z-1 bg-black/50 w-full h-full"></div>
                            <div className="bg-gray-400 rounded-xl p-5 flex flex-col justify-center items-center">
                                <h1 className="self-start">{(type == "folder" ? "Name of Folder" : "Upload File")}</h1>
                                {
                                    (type == "folder") && (
                                        <input onChange={(e) => {setFolderName(e.target.value)}} className="bg-gray-900 rounded-xl p-3 my-4" type="text" />
                                    )
                                }
                                {
                                    (type == "file") && (
                                        <form me className="flex flex-col items-center justify-center my-2 w-full">
                                            <label htmlFor="img" className="w-30 h-30 bg-no-repeat bg-contain">
                                                <img src={(imgurl != null) ? imgurl : "./src/assets/uplad.svg"} className="rounded-xl w-full h-full" alt="Upload Image" />
                                            </label>
                                            <input onChange={(e)=>{changeImage(e); setImg(e.target.files[0])}} type="file" className="ml-25 block text-center text-xs text-transparent" title="Upload Image" name="img" id="img" />

                                            <button onClick={handleSubmit}>Submit</button>
                                        </form>
                                    )
                                }
                                <button onClick={(type == "folder" ? addFolder : handleSubmit)} className="p-2 bg-green-800/30 cursor-pointer rounded-xl w-fit">Add</button>
                            </div>
                        </div>
                    )
                }
                
            </div>

        </div>

    )

}

export default Files