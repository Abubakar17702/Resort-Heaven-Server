const User = require("../models/User");

// Get All Users
const getAllUsers = async (req, res) => {
    try {
      const users = await User.find({});
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Post a New User
const createUser = async (req, res) => {
    const user = req.body;
    const query = { email: user.email };
    try {
      const existingUser = await User.findOne(query);
      if (existingUser) {
        return res.status(302).json({ message: "User already exists!" });
      }
      const result = await User.create(user);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

//   Delete a User
const deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      // if user not found
      if(!deletedUser){
          return res.status(404).json({ message: "User not found!" });
      }
      res.status(200).json({message: "User deleted successfully!"})
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  
  
// Get Admin
const getAdmin = async (req, res) => {
    const email = req.params.email;
    const query = {email: email};
    try {
        const user = await User.findOne(query);
        // console.log(user)
        if(email !== req.decoded.email){
            return res.status(403).send({message: "Forbidden access"})
        }
        let admin = false;
        if(user ){
            admin = user?.role === "admin";
        }
        res.status(200).json({admin})
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Make a Admin Of a User
const makeAdmin = async (req, res) => {
    const userId = req.params.id;
    const {name, email, photoURL, role} = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            {role: "admin"},
            {new: true, runValidators: true}
        );

        if(!updatedUser){
            return res.status(404).json({message: "User not found"})
        }
        res.status(200).json(updatedUser)
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


  module.exports ={
    getAllUsers,
    createUser,
    deleteUser,
    getAdmin,
    makeAdmin,
  }