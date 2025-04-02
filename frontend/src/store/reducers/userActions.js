export const setUser = (user) => {
    return {
        type: "SET_USER",
        payload: { user },
    };
};

export const setAuth = (accessToken, auth) => {
    return {
        type: "SET_AUTH",
        payload: { accessToken, auth },
    };
}

export const logout = () => {
    localStorage.clear();
    return {
        type: "LOGOUT",
    };
};