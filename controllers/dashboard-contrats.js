const dashboardContrats = async (req, res) => {
  const user = await req.user;
  console.log('the user name: ', user);
  res.render('dashboards/production-contrats.ejs', { user});
};


module.exports = {
  dashboardContrats
};