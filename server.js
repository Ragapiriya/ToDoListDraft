const { json } = require("body-parser");
const expressModule = require("express");
const app = expressModule();
const mongoose = require("mongoose");
const cors = require('cors');
app.use(cors());

app.use(expressModule.json()); //decode json data
// app.get('/',(req,res,next)=>{
//     res.send("HEllo. im ragapiriya")
// })

// let todos=[];
mongoose
  .connect("mongodb://localhost:27017/mern-app") //in that server, there will be mern-app database will be formed.
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

//creating schema
const todoSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  description: String,
 
});

//creating model to facilitate the schema
const todoModel = mongoose.model("Todo", todoSchema);

app.post("/todos", async (req, res, next) => {
  const { title, description } = req.body;
  // const newToDo={
  //     id:todos.length+1,
  //     title,
  //     description
  // }
  // todos.push(newToDo);
  // console.log(todos);

  //registering the data into database using mdodel instead of arrays.
  try {
    const newToDo = new todoModel({ title, description });
    await newToDo.save();
    res.status(201).json(newToDo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
});

app.get("/todos", async (req, res, next) => {
  // res.json(todos); //the data we send will be sent as json data format
  try {
    const todos = await todoModel.find();
    res.json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
});

//id[of data that is needed to be modified] is a parameter(params)
app.put("/todos/:id", async(req, res) => {
  try {
            const { title, description } = req.body; //input or new data
            const id = req.params.id;
            const updatedToDo = await todoModel.findByIdAndUpdate(
                id, 
                {
                title,
                description,
                },
                {new:true} );
                // const oldToDo = await todoModel.findByIdAndUpdate(
                //     id, 
                //     {
                //     title,
                //     description,
                //     },
                //     {new:true} );
            if (!updatedToDo) {
            //terminating the program execution
            return res.status(404).json({ msg: "To Do not found" });
            }
            res.json(updatedToDo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
});

app.delete('/todos/:id',async (req,res)=>{
    try{
        const id= req.params.id;
        const deletedToDo= await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({msg:error.message});
    }
    

})
app.listen(7000, () => {
  console.log("Listening");
});
