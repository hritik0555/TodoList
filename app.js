//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");


const _=require("lodash");

const mongoose=require("mongoose");

mongoose.connect("mongodb+srv://admin-Hritik:Apple@1095@cluster0.9zypy.mongodb.net/todolistdb?retryWrites=true&w=majority",{useNewUrlParser:true ,useUnifiedTopology: true,
useCreateIndex: true,
useFindAndModify: false});



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const day = date.getDate();
const itemSchema=new mongoose.Schema({
  name:String
});


const listSchema=new mongoose.Schema({
  name:String,
  list:[itemSchema]
});





const Task=mongoose.model("Task",itemSchema);

const  List=mongoose.model("List",listSchema);


const task1=new Task({
  name:"First Task"
});

const task2=new Task({
  name:"Second Task"
});

const task3=new Task({
  name:"Third Task"
});











app.get("/", function(req, res) {




Task.find(function(err,tasks){


  if(tasks.length===0)
  {
     Task.insertMany([task1,task2,task3],function(err){
      if(err)
      {
        console.log(err);
      }
      else
      {
        console.log("Successfully Inserted Default Items");
      }

      res.redirect("/");
    });
   
  }

  else
  {
    if(err)
    {
      console.log(err);
    }
    else
    {
    
      res.render("list", {listTitle: day,newListItems: tasks});
    }
  }

 
  
  });
  

});

app.post("/", function(req, res){

  const item = req.body.newItem;

  const list1=req.body.list;
  


  const newitem=new Task({
    name:item
  });

  if(list1===day)
  {
    newitem.save();
    res.redirect("/");
  }
  else
  {
     List.findOne({name:list1},function(err,result){
       result.list.push(newitem);
       result.save();
       console.log("Saved");
       res.redirect("/" + list1);
       
     })
  }




  


 

  
    

});




app.get("/:nextItem",function(req,res){
  const nextItem1=req.params.nextItem;


  const nextItem= _.capitalize(nextItem1);



List.findOne({name:nextItem},function(err,result){
 
  if(result!=null)
  {

    res.render("list",{listTitle:nextItem,newListItems:result.list});
    
  }
  else
  {
    const list=new List({
      name:nextItem,
      list:[task1,task2,task3]
    });
    
    list.save();

    res.redirect("/" + nextItem);


    
    
  }
});
  
});


app.post("/delete",function(req,res){

const listname= req.body.listname;

const deleteItem= req.body.checkbox;


if(listname===day)
{
  Task.deleteOne({_id:deleteItem},function(err){
    if(err)
    {
      console.log(err);
    }
    else
    {
      console.log("successfully deleted");
      res.redirect("/");
    }
  });
}
else
{
  List.findOneAndUpdate({name:listname},{$pull: {list:{_id:deleteItem}}},function(err,result){
    if(!err)
    {
      res.redirect("/" + listname);
    }
  })

}



});



app.get("/about", function(req, res){
  res.render("about");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
