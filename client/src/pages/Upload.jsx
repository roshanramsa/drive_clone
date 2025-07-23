import { useState } from "react";

function Upload(){

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
        const upload = await fetch(
            "http://localhost:3000/upload",
            {
                method: "POST",
                credentials: "include",
                body: formData
            }
        )
    }

    return(

        <div className="w-full flex flex-col mt-100">
            <div className="bg-gray-100 rounded-xl p-5 text-black">
                <h1>Upload Files Here</h1>
                <form me className="flex flex-col items-center justify-center my-2 w-full">
                    <label htmlFor="img" className="w-30 h-30 bg-no-repeat bg-contain">
                        <img src={(imgurl != null) ? imgurl : "./src/assets/uplad.svg"} className="rounded-xl w-full h-full" alt="Upload Image" />
                    </label>
                    <input id="fileInput" onChange={(e)=>{changeImage(e); setImg(e.target.files[0])}} type="file" className="ml-25 block text-center text-xs text-transparent" title="Upload Image" name="img" />

                    <button onClick={handleSubmit}>Submit</button>
                </form>
            </div>
        </div>

    )
 
}

export default Upload