// Create token, remove existing token if present, and save in the cookie
export default (user, statusCode, res) => {
  // Create JWT Token
  const token = user.getJwtToken();

  // Clear existing token cookie (if any)
  res.clearCookie("token");
  console.log(" cleared token");

  // Options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // Set new token in cookie and send response
  res.status(statusCode).cookie("token", token, options).json({
    token,
  });
};
