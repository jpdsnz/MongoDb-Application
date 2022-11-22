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















//---- Import File Upload ----//
var fileUpload = require('express-fileupload');
var fs = require('fs'); //installed by default
app.use(fileUpload());
app.use('/Photos', Express.static(__dirname+'/Photos')); //In order to use directory for photos

//---- Enable Cors Security For All Domains ----//
var cors = require('cors');
app.use(cors());

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
    response.json('Hello World'); //Send a test message on postman
})

//------------ API Department Methods ------------//
//---- Find Method ----//
app.get('/api/department',(request,response)=>{

    database.collection("Department").find({}).toArray((error,result)=>{ //.find({FILTERGOESHERE}), we get all data so no filter needed!
        if(error)
            console.log(error); //Log any errors

        response.json(result);
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

        response.json("Added Succesfully!");
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

        response.json("Updated Succesfully!");
   
})

//---- Delete Method ----//
app.delete('/api/department/:id',(request,response)=>{

    database.collection("Department").deleteOne({
        DepartmentId:parseInt(request.params.id)
    });

    response.json("Deleted Succesfully!");

})

//------------ API Employee Methods ------------//
//---- Find Method ----//
app.get('/api/employee',(request,response)=>{

    database.collection("Employee").find({}).toArray((error,result)=>{ //.find({FILTERGOESHERE}), we get all data so no filter needed!
        if(error)
            console.log(error); //Log any errors

        response.json(result);
    })
})

//---- Post Method ----//
//Remember to post as JSON instead of text in Postman App!!
app.post('/api/employee',(request,response)=>{

    database.collection("Employee").count({}, function(error, numOfDocs){
        if(error)
            console.log("error");

        database.collection("Employee").insertOne({
            EmployeeId : numOfDocs+1,
            EmployeeName : request.body['EmployeeName'],
            Department: request.body['Department'],
            DateOfJoining: request.body['DateOfJoining'],
            PhotoFileName: request.body['PhotoFileName'],
        });

        response.json("Added Succesfully!");
    })
})

//---- Update Method ----//
app.put('/api/employee',(request,response)=>{

        database.collection("Employee").updateOne(
            //Filter Criteria
            {
                "EmployeeId":request.body['EmployeeId']
            },
            //Update Criteria
            {$set:
                {
                    EmployeeName : request.body['EmployeeName'],
                    Department: request.body['Department'],
                    DateOfJoining: request.body['DateOfJoining'],
                    PhotoFileName: request.body['PhotoFileName'],
                }
                
            }
        );

        response.json("Updated Succesfully!");
   
})

//---- Delete Method ----//
app.delete('/api/employee/:id',(request,response)=>{

    database.collection("Employee").deleteOne({
        EmployeeId:parseInt(request.params.id)
    });

    response.json("Deleted Succesfully!"); 

})

//---- Image Post Method ----//
app.post('/api/employee/savefile',(request,response)=>{

    fs.writeFile("./Photos/"+request.files.file.name, request.files.file.data, function(err){
        if(err)
            console.log(err);

        response.json(request.files.file.name);
    }
    )
})



