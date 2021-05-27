export const fakeAuth = {
    authenticate() {
        const token = localStorage.getItem("access_token");
        return !!token ? true : false;
    },
    setToken(token) {
        localStorage.setItem("access_token", token);
        return true;
    },
    signout() {
        localStorage.clear()
    }
};