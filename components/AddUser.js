import { useState } from "react";
import api from '../serverCalls'

export default function AddUser() {
    const [name, setName] = useState("");
    const [rating, setRating] = useState("");
    const user = {
      name: name,
      gamesWon: 0,
      gamesLost: 0,
      rating: parseInt(rating)
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      api.addUser(user)
      setRating("");
      setName("");
    }
  
    const handleNameChange = (event) => {
      setName(event.target.value);
    };
  
    const handleRatingChange = (event) => {
      setRating(event.target.value);
    };
    return (
      <form className="box">
        <div className="field">
          <label className="label">Name</label>
          <input className="input" value={name} onChange={handleNameChange}></input>
          <label className="label">Rating</label>
          <input className="input" type="number" value={rating} onChange={handleRatingChange}></input>
          <input type="submit" value="Add user" className='button is-primary' onClick={handleSubmit} />
        </div>
      </form>
    );
  }