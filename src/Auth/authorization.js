const userType = require("../userType/types")
const requireAuthorization = (roles) => {
    const checkAuthorization = (
      req,
      res,
      next
    ) => {
     
      if (!req.currentUser) {
        return res.status(401).send("Token is required") 
      }
  
     let currentRole = req.currentUser.role
    //  console.log("Role",currentRole,"input",roles)
     const exists = roles.includes(currentRole);

     if(exists){
        next();
     }else{
        return res.status(401).send("Not Authorized") 
     }
    };
    return checkAuthorization;
  };

module.exports = {requireAuthorization}