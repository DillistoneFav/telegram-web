import {AppDispatch} from "../../store";
import {IUser} from "../../../interfaces/IUser";
import {userSlice} from "./UserSlice";
import {$host} from "../AxiosConfig";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const fetchLogin = (username: string, password: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(userSlice.actions.userFetching)
        await $host.post('/login', {
            username: username,
            password: password
        }).then(response => {
            let expireDate = new Date(response.headers["expire-token"]);
            cookies.set("user", response.headers["access-token"], { path: "/", expires: expireDate})
            localStorage.setItem('user', JSON.stringify(response.data))
            dispatch(userSlice.actions.userFetchingSuccess(response.data))
        })
    } catch(error) {
        if (error instanceof Error) {
            //dispatch(userSlice.actions.userFetchingError(error.message))
            dispatch(userSlice.actions.userFetchingError("Incorrect Username or Password!"))
        }
    }
}

export const fetchRegister = (login: string, name: string, password: string, phone: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(userSlice.actions.userFetching)
        await $host.post<IUser>(`/register`, {
            login: login,
            name: name,
            password: password,
            phone: phone,
        }).then(response => {
            dispatch(userSlice.actions.userFetchingSuccess(response.data))
        })
    } catch(error) {
        if (error instanceof Error) {
            dispatch(userSlice.actions.userFetchingError(error.message))
        }
    }
}

export const fetchLogOut = () => async (dispatch: AppDispatch) => {
    await $host.get('/logout')

    dispatch(userSlice.actions.resetUser())
    localStorage.removeItem('user')
    cookies.remove('user')
}