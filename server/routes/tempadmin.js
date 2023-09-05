
// // Update user information
// adminRoutes.put("/users/:id",  authenticateAdmin, async (req, res) => {
//     const { id } = req.params;
//     const user = await User.findByIdAndUpdate(id, req.body, { new: true });
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     return res.status(200).json(user);
//   });
  
//   // Delete user
//   adminRoutes.delete("/users/:id",  authenticateAdmin,async (req, res) => {
//     const { id } = req.params;
//     const user = await User.findByIdAndRemove(id);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     return res.status(200).json({ message: "User deleted successfully" });
//   });
  
//   // Check if user is currently logged in
//   adminRoutes.get("/users/:id/loggedIn", authenticateAdmin,async (req, res) => {
//     const { id } = req.params;
//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     // You need to create a function or middleware that checks if user is logged in
//     const isLoggedIn = checkIfLoggedIn(user);
//     return res.status(200).json({ loggedIn: isLoggedIn });
//   });
  
//   // Get token expiry for a user
//   adminRoutes.get("/users/:id/tokenExpiry", async (req, res) => {
//     const { id } = req.params;
//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     const decodedToken = jwt.verify(user.token, process.env.ADMINSECRET);
//     const expiryDate = new Date(decodedToken.exp * 1000); // Convert from seconds to milliseconds
//     return res.status(200).json({ expiryDate });
//   });
  
//   // Check if any tokens are available
//   adminRoutes.get("/users/:id/tokensAvailable", async (req, res) => {
//     const { id } = req.params;
//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     // You need to create a function or middleware that checks if tokens are available
//     const tokensAvailable = checkTokensAvailable(user);
//     return res.status(200).json({ tokensAvailable });
//   });
  