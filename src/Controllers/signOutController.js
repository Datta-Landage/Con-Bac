const signOut = async function (req, res) {
    try {
        req.session = null;
  
      return res.status(200).send({
        message: "Logged out successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  };
  
  module.exports = { signOut };
  