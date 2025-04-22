import { UserType } from "../types/global";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


type UserState = {
    user: UserType | null
    admin: UserType | null
}


// Load user from localStorage safely
const storedUser = localStorage.getItem('user');
const storedAdmin = localStorage.getItem('admin')
const initialState: UserState = {
    user: storedUser ? (JSON.parse(storedUser) as UserType) : null,
    admin: storedAdmin ? (JSON.parse(storedAdmin) as UserType) : null
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addUser: (state,action: PayloadAction<UserType>) => {
            state.user = action.payload
            localStorage.setItem('user',JSON.stringify(action.payload))
        },
        addAdmin: (state, action) => {
            state.admin = action.payload
            localStorage.setItem('admin',JSON.stringify(action.payload))
        },
        logoutUser: (state) => {
            state.user = null;
            localStorage.removeItem('user');
        },
        logoutAdmin: (state) => {
            state.admin = null;
            localStorage.removeItem('admin');
        }
    }
})

export const {addUser, addAdmin, logoutAdmin, logoutUser} = userSlice.actions;
export default userSlice.reducer;