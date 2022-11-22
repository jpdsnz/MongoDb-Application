var Express = require("express");
var bodyParser = require("body-parser");
const { response, request } = require("express");

//---- Init Application ----//
var  app = Express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); //parse data from url

//---- Import Mongodb ----//
var MongoClient = require("mongodb").MongoClient;
// Make sure correct pw is in CONNECTION_STRING!
var CONNECTION_STRING = "mongodb+srv://admin:Eo8xPRdtfN4k4O7O@cluster0.gdemrye.mongodb.net/?retryWrites=true&w=majority"; //Connection string copied from mongodb atlas site















 







//---- Define db Name ----//
var DATABASE = "testdb";
var database;

//---- App Listens -----//
//Port number 49146 for http requests, http://localhost:49146 in postman GET
app.listen(49146,()=>{

    MongoClient.connect(CONNECTION_STRING, {useNewUrlParser:true},(error,client)=>{
        database = client.db(DATABASE);
        console.log("Mongo DB Connection Successful!");
    })

});


app.get('/',(request, response)=>{
    response.send('Hello World'); //Send a test message on postman
})

//------------ API Creation ------------//
//---- Find Method ----//
app.get('/api/department',(request,response)=>{

    database.collection("Department").find({}).toArray((error,result)=>{ //.find({FILTERGOESHERE}), we get all data so no filter needed!
        if(error)
            console.log(error); //Log any errors

        response.send(result);
    })
})

//---- Post Method ----//
//Remember to post as JSON instead of text in Postman App!!
app.post('/api/department',(request,response)=>{

    database.collection("Department").count({}, function(error, numOfDocs){
        if(error)
            console.log("error");

        database.collection("Department").insertOne({
            DepartmentId : numOfDocs+1,
            DepartmentName : request.body['DepartmentName']
        });

        response.send("Added Succesfully!");
    })
})

//---- Update Method ----//
app.put('/api/department',(request,response)=>{

        database.collection("Department").updateOne(
            //Filter Criteria
            {
                "DepartmentId":request.body['DepartmentId']
            },
            //Update Criteria
            {$set:
                {
                    "DepartmentName":request.body['DepartmentName']
                }
                
            }
        );

        response.send("Updated Succesfully!");
   
})

//---- Delete Method ----//
app.delete('/api/department/:id',(request,response)=>{

    database.collection("Department").deleteOne({
        DepartmentId:parseInt(request.params.id)
    });

    response.send("Deleted Succesfully!");

})

