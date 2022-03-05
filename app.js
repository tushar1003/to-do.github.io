const express=require("express");
const bodyParser=require("body-parser");
// var popup = require('popups');
const date=require(__dirname+"/date.js");

const app=express();

var items=[];
var workItems=[];
const port=process.env.PORT || 5000

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){

   let day=date.getDate();

   res.render("list",{listTitle:day,NewListItems:items})
  
});

app.post("/",function(req,res){
    // console.log(req.body);
    item=req.body.NewItem;

    if(item==="")
    {
      let alert = require('alert'); 
  alert("Enter something to add")
    }

   else if(req.body.list==="Work"){
        workItems.push(item);
    res.redirect("/work");

    }
   
   
    else {
    items.push(item);
    // console.log(item);
    res.redirect("/");
    }   
})

app.get("/work",function(req,res){
    res.render("list",{listTitle:"Work List",NewListItems:workItems})
});


// app.post("/work",function(req,res){

//     let item=req.body.NewItem;
//     workItems.push(item);
//     res.redirect("/work");
// })


app.listen(port ,function(){
    console.log("Server started on port 3000");
}); 