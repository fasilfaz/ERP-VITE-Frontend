import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    user: {
        userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
        token: localStorage.getItem('token') ? localStorage.getItem('token') : null,
        tokenExpiry: localStorage.getItem('tokenExpiry') ? localStorage.getItem('tokenExpiry') : null,
    },
}

const userSlice = createSlice({
    name: "userCrud",
    initialState,
    reducers: {
        adduserInfo: (state, action) => {
            state.user.userInfo = action.payload;
            localStorage.setItem("userInfo", JSON.stringify(action.payload))
        }
    },
});

export const {
    adduserInfo,
} = userSlice.actions;
export default userSlice.reducer;