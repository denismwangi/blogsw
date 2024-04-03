const express = require('express');
const router = express.Router();
const { admin,protect } =  require('../middleware/authMiddleware');

const { 
        getUsers,
        deleteUser,
        getUserById,
        updateUserById, 
        getUserProfile,
        updateUserProfile
    } = require('../controllers/users/UsersController');

router.route('/').get(protect,admin,getUsers);
router.get('/:id')
    .delete(protect,admin,deleteUser)
    .put(protect,admin,updateUserById)
    .get(getUserById);


router.get('/profile',protect,getUserProfile);
router.put('/profile/update',protect,updateUserProfile);



module.exports =  router;