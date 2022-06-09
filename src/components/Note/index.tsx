import React,{useState, useEffect, FC} from "react";
import { useAppSelector } from "../../app/hooks";
import { selectAuth, LoginStatus } from "../Login/authslice";

export function Note() {
  const auth = useAppSelector(selectAuth);
  const [note, setNote] = useState("");
  const [fetchNote, fetchDone] = useState(false)

  const noteChangeHandler = (val:string)=>{
       setNote(val);
  }
  const noteUpdateHandler = async(userId:string)=>{
       try {
        await fetch(
          `https://60b793ec17d1dc0017b8a6bc.mockapi.io/users/${userId}`,
          {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              note: note,
            }),
          }
        );
      
       } catch (error) {
             throw error;
       }
  }
  if (auth.status !== LoginStatus.LOGGED_IN) return null;
  const {
    apiToken,
    user: { id: userId },
  } = auth;
  if(note === "" && !fetchNote){
    fetchDone(true)
    setNote(auth.user.note);
    
  }
  
 
  return (
    <div>
      {NoteField(note, noteChangeHandler, auth.user.id, noteUpdateHandler)}
    </div>
  );
}

function NoteField(note:string,noteChangeHandler:Function, userId:string, noteUpdateHandler: Function) {

  return <div>
    <textarea  onChange={(e)=>{noteChangeHandler(e.target.value)}} value={note}/>
    <button onClick={()=>{noteUpdateHandler(userId)}}>Update note</button>
  </div>;
}
