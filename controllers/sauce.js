const Sauce = require('../models/sauce');
const fs = require('fs');

exports.getSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error}));
};

exports.getSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes:0

    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  var sauceObject = {};
  if (req.file) {
    console.log('MAJ avec image');
    console.log(req.body);
    //Il y a un nouveau fichier, il faut supprimer l'ancien avant
    Sauce.findById({_id: req.params.id})
      .then(sauce =>{
        const filename = sauce.imageUrl.split('images/')[1];
       fs.unlink(`images/${filename}`, function (err) {
         if (err) {
           console.log('MAJ : ancien fichier image : '+filename+' non trouvé');
         }
         else {
          // if no error, file has been deleted successfully
          console.log('MAJ ancien Fichier '+filename+' supprimé');
         }
       });
      }
    );
    sauceObject = {...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`};
  } else {
    console.log('MAJ sans image');
    console.log(req.body);
     sauceObject = { ...req.body };
  }
    // const sauceObject = req.file ?
    // {
    //   ...JSON.parse(req.body.sauce),
    //   imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    // } : { ...req.body };
    console.log(sauceObject);
    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
    .then(() => res.status(200).json( {message : 'Objet Modifié !'}))
    .catch(error => res.status(400).json({error}));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findById({_id: req.params.id})
  .then(sauce => {
    const filename = sauce.imageUrl.split('images/')[1];
     fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({ _id: req.params.id})
      .then( () => res.status(200).json( {message : 'Objet Supprimé !'}))
      .catch(error => res.status(400).json({error}));
    });
  })
  .catch(error => res.status(404).json({message : 'Erreur FindbyId id='+req.params.id+' !'}));
};

exports.likeSauce = (req, res, next) => {
  Sauce.findById({_id: req.params.id})
  .then(sauce => {
    switch(req.body.like){
      case 0:
        if(sauce.usersLiked.indexOf(req.body.userId) !== -1) {
          sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId),1);
          sauce.likes -= 1;
        }
        if(sauce.usersDisliked.indexOf(req.body.userId) !== -1) {
          sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.body.userId),1);
          sauce.dislikes -= 1;
        }
        break;
      case 1:
        // Est-ce que l'utilisateur a déjà liké ?
        if(sauce.usersLiked.indexOf(req.body.userId) == -1) {
          sauce.usersLiked.push(req.body.userId);
          sauce.likes += 1;
        }
        //console.log(sauce);
        break;
      case -1:
        // Est-ce que l'utilisateur a déjà disliké ?
        if(sauce.usersDisliked.indexOf(req.body.userId) == -1) {
          sauce.usersDisliked.push(req.body.userId);
          sauce.dislikes += 1;
        }
        //console.log('dislike');
        break;
      default:
        console.log('Valeur erronée');
      
    };
    //console.log(sauce.usersLiked);
    sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
  })
  .catch(error => res.status(404).json({message : 'Erreur FindbyId id='+req.params.id+' !'}));
};