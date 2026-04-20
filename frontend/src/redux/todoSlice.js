import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API = '/api/tasks'

const authHeader = (token) => ({ headers: { Authorization: `Bearer ${token}` } })

export const fetchTodos = createAsyncThunk('todos/fetchAll', async (_, { getState }) => {
    const token = getState().auth.accessToken
    const { data } = await axios.get(API, authHeader(token))
    return data
})

export const createTodo = createAsyncThunk('todos/create', async (title, { getState }) => {
    const token = getState().auth.accessToken
    const { data } = await axios.post(API, { title }, authHeader(token))
    return data
})

export const updateTodo = createAsyncThunk('todos/update', async ({ id, ...fields }, { getState }) => {
    const token = getState().auth.accessToken
    const { data } = await axios.put(`${API}/${id}`, fields, authHeader(token))
    return data
})

export const deleteTodo = createAsyncThunk('todos/delete', async (id, { getState }) => {
    const token = getState().auth.accessToken
    await axios.delete(`${API}/${id}`, authHeader(token))
    return id
})

const todoSlice = createSlice({
    name: 'todos',
    initialState: { items: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.pending, (s) => { s.loading = true })
            .addCase(fetchTodos.fulfilled, (s, { payload }) => { s.loading = false; s.items = payload })
            .addCase(fetchTodos.rejected, (s, { error }) => { s.loading = false; s.error = error.message })

        builder.addCase(createTodo.fulfilled, (s, { payload }) => { s.items.unshift(payload) })
        builder.addCase(updateTodo.fulfilled, (s, { payload }) => {
            const i = s.items.findIndex((t) => t._id === payload._id)
            if (i !== -1) s.items[i] = payload
        })
        builder.addCase(deleteTodo.fulfilled, (s, { payload }) => {
            s.items = s.items.filter((t) => t._id !== payload)
        })
    },
})

export default todoSlice.reducer
