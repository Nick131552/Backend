const express = require('express');
const upload = require("express-fileupload");
const libre = require('libreoffice-convert');

const path = require('path');
var fs = require('fs');
const extend = '.pdf'

var nodemailer = require('nodemailer');

process.env.COUNT = 0;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
process.env.PASSWORD = "#Poptropica131552";

require('dotenv').config();

console.log(process.env.FOO);

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'word2pdf131552@gmail.com',
    pass: process.env.PASSWORD
  }
});


const app = express();
app.use(upload())


app.get('/', function(req, res) {
  res.sendFile(__dirname+'/index.html');
})




app.post('/upload', function(req, res) {
  
  
  if(req.files != null){
    if(req.files.upfile.name.indexOf(".docx") != -1){

      const file = req.files.upfile;
      const name = file.name;
      const type = file.mimetype;

      const uploadpath = __dirname + '/uploads/' + name;

      

      file.mv(uploadpath,function(err){
        if(err){
          console.log("File Upload Failed",name,err);
          res.send("Error Occured!")
        }
        else {
          console.log("File Uploaded",name);
          app.use('/'+name.replace(".docx", ".pdf").replace(/\s/g,""), function(req, res) {
            res.sendFile(__dirname+'/downloads/'+name.replace(".docx", ".pdf"));
          })

          fs.readFile("./upload1.html", 'utf8', function(err, html1) {
            console.log(html1)
            fs.readFile("./upload2.html", 'utf8', function(err, html2) {
              res.send(html1+process.env.COUNT+'</h2><p><a download='+name.replace(".docx", ".pdf")+' href="/'+name.replace(".docx", ".pdf").replace(/\s/g,"")+html2)
            });
        });

    
        }
      });
      const sourceFilePath = path.resolve('./uploads/'+name);
      const outputFilePath = path.resolve('./downloads/'+name.replace(".docx", ".pdf"));
  
      const enterPath = fs.readFileSync(sourceFilePath);
      libre.convert(enterPath, extend, undefined, (err, done) => {
          if (err) {
            console.log(`Error converting file: ${err}`);
          }
          
          fs.writeFileSync(outputFilePath, done);
      });

    setTimeout(function(){
      if (req.body.email != ""){
      var mailOptions = {
        from: 'Word2Pdf@gmail.com',
        to: req.body.email,
        subject: 'Your DOCX converted to PDF',
        attachments: [{
          filename: name.replace(".docx", ".pdf"),
          contentType: 'application/pdf',
          path:__dirname+"/downloads/"+name.replace(".docx", ".pdf")
        }]
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }}, 5000)

    setTimeout(function(){
      fs.unlink(__dirname+'/uploads/'+name, function (err) {
        if (err) throw err;
        console.log('File deleted!');
    }); 
    fs.unlink(__dirname+'/downloads/'+name.replace(".docx", ".pdf"), function (err) {
      if (err) throw err;
      console.log('File deleted!');
  }); 
    }, 900000)

    }
  }
  else {
    res.send("No File selected !");
    res.end();
  };
  process.env.COUNT ++
})


// make server listen on port 3000
var server = app.listen(process.env.PORT || 3000, function () {
  var port = server.address().port;
  console.log("Express is working on port " + port);
}); 

