const formularioLogin = (req, res) => {
  res.render("auth/login", {
    autenticado: false,
  });
};

export { formularioLogin };
