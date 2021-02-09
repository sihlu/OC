const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

exports.signup = (req, res, next) => {
    // Validation du mot de passe
    // Le mot de passe doit avoir une longueur min de 10 caractères,
    // et doit contenir au minimum 1 minuscule, 1 majuscule, un chiffre et 1 caractère spécial
    if (req.body.password.match( /[0-9]/g) && 
      req.body.password.match( /[A-Z]/g) && 
      req.body.password.match(/[a-z]/g) && 
      req.body.password.match( /[^a-zA-Z\d]/g) &&
      req.body.password.length >= 10
    ) {
      bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
    }
    else {
      throw error => res.status(400).json({ error: 'Le mot passe doit avoir 1 minuscule, 1 majuscule, 1 chiffre, 1 caractère spécial et faire au moins 10 caractères !' }); 
    } 

};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id},
                'lERoECk%2fdU2AWrUvWLyNuw%3d%3d',
                {expiresIn: '24h'}
              )
            });
        })
          .catch(error => res.status(500).json({ error }));
    })
      .catch(error => res.status(500).json({ error }));
};
