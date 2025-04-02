export const initialState = {
    accessToken: null,
    authenticated: false,
    user: null
}

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_AUTH":
            return {
                ...state,
                accessToken: action.payload.accessToken,
                authenticated: action.payload.auth,
            };
        case "SET_USER":
            return {
                ...state,
                user: action.payload.user,
            };
        case "LOGOUT":
            return { ...initialState };
        default:
            return state;
    }
}