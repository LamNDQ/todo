import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API = '/api/tasks'

// ── Async thunks ──────────────────────────────────────────────────────────────

export const fetchTodos = createAsyncThunk('todos/fetchAll', async () => {
    const { data } = await axios.get(API)
    return data
})

// export const fetchTasks = createAsyncThunk(
//     "tasks/fetchTasks",
//     async ({ page = 1, limit = 5, sort = "createdAt", order = "desc" }) => {
//         const res = await fetch(
//             `/api/tasks?page=${page}&limit=${limit}&sort=${sort}&order=${order}`
//         );

//         const data = await res.json();
//         return data;
//     }
// );

export const createTodo = createAsyncThunk('todos/create', async (title) => {
    const { data } = await axios.post(API, { title })
    return data
})

export const updateTodo = createAsyncThunk('todos/update', async ({ id, ...fields }) => {
    const { data } = await axios.put(`${API}/${id}`, fields)
    return data
})

export const deleteTodo = createAsyncThunk('todos/delete', async (id) => {
    await axios.delete(`${API}/${id}`)
    return id
})

// ── Slice ─────────────────────────────────────────────────────────────────────

const todoSlice = createSlice({
    name: 'todos',
    initialState: {
        items: [],
        loading: false,
        error: null,
        // page: 1,
        // totalPages: 1,
    },
    reducers: {},
    extraReducers: (builder) => {
        // fetch
        builder
            .addCase(fetchTodos.pending, (state) => { state.loading = true })
            .addCase(fetchTodos.fulfilled, (state, { payload }) => {
                state.loading = false
                state.items = payload
                // state.page = action.payload.page;
                // state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchTodos.rejected, (state, { error }) => {
                state.loading = false
                state.error = error.message
            })

        // create
        builder.addCase(createTodo.fulfilled, (state, { payload }) => {
            state.items.unshift(payload)
        })

        // update
        builder.addCase(updateTodo.fulfilled, (state, { payload }) => {
            const idx = state.items.findIndex((t) => t._id === payload._id)
            if (idx !== -1) state.items[idx] = payload
        })

        // delete
        builder.addCase(deleteTodo.fulfilled, (state, { payload }) => {
            state.items = state.items.filter((t) => t._id !== payload)
        })
    },
})

export default todoSlice.reducer
