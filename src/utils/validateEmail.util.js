const validateEmail = (email) => {
    const re = /\S+@(gmail|outlook)\.(com|es)$/;
    return re.test(email);
};

export default validateEmail;