import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { use, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import {useMutation,useQueryClient} from '@tanstack/react-query'
import { makeRequest } from "../../axios";
import { useState } from "react";
import { useRef } from "react";


const Share = () => {
  
  const [file,setFile] = useState(null);
  const [desc,setDesc] = useState("");

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file",file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (error) {
      console.log("Image upload error:", error);
      return ""; 
    }
  }
  
  const fileInputRef = useRef();

  const {currentUser} = useContext(AuthContext);

  const queryClient = useQueryClient()

  const mutation = useMutation(
    (newPost) => {
      return makeRequest.post("/posts", newPost);
    },
    {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setDesc("");
      setFile(null);
    },
  })

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();
    mutation.mutate({desc,img:imgUrl})
  }

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <img
            src={currentUser.profilePic}
            alt=""
          />
          <input type="text" value={desc} placeholder={`What's on your mind ${currentUser.name}?`}
           onChange={(e)=>setDesc(e.target.value)}/>
        </div>
        <div className="right">
          {file && (
            <img
              className="file"
              alt=""
              src={URL.createObjectURL(file)}
            />
          )}
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input type="file" id="file" ref={fileInputRef} style={{display:"none"}} 
            onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
