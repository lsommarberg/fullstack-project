const getToken = () => {
  const user = window.localStorage.getItem('user');
  return user ? JSON.parse(user).token : null;
};

export default getToken;
