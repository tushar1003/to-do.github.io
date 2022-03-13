const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
// const date=require(__dirname+"/date.js");
const _=require("lodash");
const app=express();

var items=[];
var workItems=[];
const port=process.env.PORT || 5000

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-tushar:Test123@cluster0.os5nk.mongodb.net/todolistDB",{useNewUrlParser:true});
// myFirstDatabase?retryWrites=true&w=majority/

const itemsSchema={
    name:String

};

const Item=mongoose.model("Item",itemsSchema)

const item1=new Item({
    name:"Create your own Custom TO-DO List by adding the title of your customized list to the address bar after adding / "
});

const item2=new Item({
    name:"Hit the + button to add the item."
});

const item3=new Item({
    name:"<-- Hit this to delete an item"
});
// const item4=new Item({
//     name:""
// });


const elements=[item1,item2,item3];

const listSchema={
    name:String,
    items:[itemsSchema]
}

const List=mongoose.model("List",listSchema)

app.get("/",function(req,res){
    Item.find({},function(err,foundItems){
        if(foundItems.length===0){
            Item.insertMany(elements,function(err){
                if(err){
                    console.log(err);
                }
                else {
                    console.log("Successfully added to the database")
                }
            });
            res.redirect("/");
        }
        else{
            res.render("list",{listTitle:"Today",NewListItems:foundItems})
        }
    });
//    let day=date.getDate();
});

app.get("/:customListName",function(req,res){
    const customListName=_.capitalize(req.params.customListName);
    // const customListName=_.capitalize(req.body.NewList);

    List.findOne({name:customListName},function(err,foundList){
        if(!err){
            if(!foundList) {
                const list=new List({
                    name:customListName,
                    items:elements
                })
                list.save();
                res.redirect("/"+customListName)
                // console.log("Doesn't exist");
            }
            else{
                // console.log("Exists");
            res.render("list",{listTitle:foundList.name,NewListItems:foundList.items})
             
            }
        }
    })

    

});

app.post("/",function(req,res){
   const itemName=req.body.NewItem;
   const listName=req.body.list;
   const item=new Item({
       name:itemName
   });

    if(item==="")
    {
         let alert = require('alert'); 
         alert("Enter something to add")
    }
   else {
       if(listName==="Today"){
       item.save();
       res.redirect("/");
    }
    else{
        List.findOne({name:listName},function(err,foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+ listName);

        })
    }
}
})


app.post("/delete",function(req,res){
    const checkedItem=req.body.checkbox;
    const listName=req.body.listName;
    if(listName=="Today"){
        Item.findByIdAndRemove(checkedItem,function(err){
            if(!err) {
                console.log("Successfully deleted")
                res.redirect("/");
            }
        });

    }else{
        List.findOneAndUpdate({name: listName},{$pull:{items:{_id:checkedItem}}},function(err,founndList){
            if(!err){
                res.redirect("/"+listName);
            }
        })
    }
   
})


 


app.listen(port ,function(){
    console.log("Server started on port 3000");
}); 