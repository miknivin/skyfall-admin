export default (user, statusCode, res) => {

  const token = user.getJwtToken();

  const options = {
    expires: new Date(
      Date.now() + Number(process.env.COOKIE_EXPIRES_TIME) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "None", // Lax for local, None for production
    secure: process.env.NODE_ENV === "production", // Secure only in production (HTTPS)
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user, 
  });
};
