const express = require('express');
const router =  express.Router();
const Video = require('../models/video');
const Formation = require('../models/formation')
const multer = require('multer');



var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null,  Date.now()+ '-' +file.originalname );
  }
});

var uploadvideo = multer({ storage : storage,
  limits: {
  fileSize: 1000000000 // 10000000 Bytes = 10 MB
  },});
//getting all videos
router.get('/videos', (req, res) => {
    console.log('getting all videos');
    Video.find({})
    .then(result =>res.status(200).json(result) )
    .catch(err => res.status(500).json(err)); 
  });
 
  router.post('/add/:idf', uploadvideo.single('video') ,async function(req,res){
    let idform = req.params.idf;
     try {
       let lienVideo = req.file.filename
     const video = new Video({...req.body,lienVideo});

     const resVideo =   await video.save();
     console.log(resVideo);
     const resFormation = await Formation.findByIdAndUpdate(
      idform,{  $push: { listVideo: resVideo._id }}
      ,{new : true}
    )
  
     res.status(201).json(resFormation)
     } catch (error) {
     res.status(500).json(error)
     }
     }); 
 
 
    //get one video
    router.get('/details/:id', (req, res) =>
    // console.log('getting all books');
    Video.findOne({
       _id: req.params.id
       }) .then(result =>res.status(200).json(result) )
       .catch(err => res.status(500).json(err))
       );

  //delete video
  router.delete('videos/:id', (req, res) => {
    Video.findOneAndRemove({
      _id: req.params.id
    }).then(result =>res.json({message : "removed with success"}) )
      .catch(err => res.json(err) ); 
  });


 /* //add formation without video
router.post('/formation', (req, res) => {
  let newFormation = new Formation();
  newFormation.nom = req.body.nom;
  newFormation.imagef = req.body.imagef;
  newFormation.dure = req.body.dure;
  newFormation.nomformateur = req.body.nomformateur;
  newFormation.description = req.body.description;
  newFormation.notes = req.body.notes;
  newFormation.prix = req.body.prix;
  
console.log(newFormation);
 newFormation.save()
    .then(result =>res.status(201).json(result) )
    .catch(err => res.status(500).json(err)); 

}); */


module.exports = router;