const validateEmail = (email) => {
    const re = /\S+@(gmail|outlook)\.com$/;
    return re.test(email);
};

export default validateEmail;