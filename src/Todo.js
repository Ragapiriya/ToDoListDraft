import { useEffect, useState } from "react";

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [editId, setEditId] = useState(-1);

  //edit
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const apiUrl = "http://localhost:7000"; //this prefix is common to all CRUD operations.

  const handleSubmit = () => {
    setError("");
    if (title.trim() !== "" && description.trim() !== "") {
      fetch("http://localhost:7000/todos", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            setTodos([...todos, { title, description }]);
            setMsg("Item added succesfully");
            setTimeout(() => {
              setMsg("");
            }, 3000);
          } else {
            setError("Unable to create Todo item.");
          }
        })
        .catch((error) => {
          setError(error.message || "Failed to fetch");
          setTimeout(() => {
            setError("");
          }, 3000);
        });
    }
  };
  const handleUpdate = () => {
      if (editTitle.trim() !== "" && editDescription.trim() !== "") {
        fetch("http://localhost:7000/todos/"+editId, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ title:editTitle, description:editDescription }),
        })
          .then((res) => {
            if (res.ok) {
              //update item
              const updatedTodos = todos.map((item)=>{
                if (item._id == editId)
                  {
                    item.title=editTitle;
                    item.description=editDescription;
                  }
                  return item;
              })


              setTodos(updatedTodos);
              setMsg("Item updated succesfully");
              setTimeout(() => {
                setMsg("");
              }, 3000);
              setEditId(-1);
            } else {
              setError("Unable to create Todo item.");
            }
          })
          .catch((error) => {
            setError(error.message || "Failed to fetch");
            setTimeout(() => {
              setError("");
            }, 3000);
          });
      
    };
  };
  useEffect(() => {
    getItems();
  }, []);
  const getItems = () => {
    fetch(apiUrl + "/todos") //get method to that API
      .then((res) => res.json())
      .then((res) => {
        setTodos(res);
      });
  };
  const handleEdit=(item)=>{
     setEditId(item._id);
     setEditTitle(item.title);
     setEditDescription(item.description);
  };
  const handleEditCancel=()=>{
    setEditId(-1);
  };
  const handleDelete=(id)=>{
    if(window.confirm("Are you really want to delete?"))
      {
        fetch("http://localhost:7000/todos/"+id,
          {
            method:'DELETE'
          }
        ).then(()=>{
            const updatedTodos = todos.filter((item)=>item._id !== id);
            setTodos(updatedTodos);
        })
      }
  };
  return (
    <>
      <div className="row p-3 bg-success text-light">
        <h1>ToDo Project with MERN stack</h1>
      </div>

      {/* Form */}
      <div className="row">
        <h3>Add Item</h3>
        {/* {msg ? <p className="text-success">{msg}</p> : null}
         */}
        {msg && <p>{msg}</p>}

        <div className="form-group d-flex gap-2">
          <input
            placeholder="Tilte"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="form-control"
            type="text"
          />
          <input
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="form-control"
            type="text"
          />
          <button className="btn btn-dark" onClick={handleSubmit}>
            Submit
          </button>
          {/* {error ? <p>{error}</p> : null} */}
          {error && <p>{error}</p>}
        </div>
      </div>

      {/* Listing */}
      <div className="row mt-3">
        <h3>Tasks</h3>
        <ul className="list-group">
          {todos.map((item) => (
            <li className="list-group-item bg-secondary d-flex justify-content-between align-items-center my-2">


              {/* Listing-1.Title and description area for presentation and editing purpose */}
              <div className="d-flex flex-column me-2">
                {editId == -1 || editId !== item._id ? (
                  <>
                    <span className="fw-bold">{item.title}</span>
                    <span>{item.description}</span>
                  </>
                ) : (
                  <>
                    <div className="form-group d-flex gap-2">
                      <input
                        placeholder="Tilte"
                        onChange={(e) => setEditTitle(e.target.value)}
                        value={editTitle}
                        className="form-control"
                        type="text"
                      />
                      <input
                        placeholder="Description"
                        onChange={(e) => setEditDescription(e.target.value)}
                        value={editDescription}
                        className="form-control"
                        type="text"
                      />
                      {error && <p>{error}</p>}
                    </div>
                  </>
                )}
              </div>


              {/* Listing-2.Buttons */}
              <div className="d-flex gap-2">
                {editId == -1 || editId !== item._id ? 
                // Listing-2.Buttons EDIT or UPDATE
                  <button
                    className="btn btn-warning"
                    onClick={()=>handleEdit(item)}
                  >
                    Edit
                  </button>
                 : 
                  <button onClick={handleUpdate}>Update</button>
                } 
                {/* Listing-2.Button DELETE or CANCEL */}
                { editId ==-1 || editId !== item._id ?
                <button className="btn btn-danger" onClick={()=>handleDelete(item._id)}>Delete</button>
                : <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>
                }
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
