import { Routes } from "react-router"
import { Route } from "react-router"
import { NotFoundErrorPage } from "./pages/errors/not-found/not-found-error-page"
import { TodoListWithSuspense } from "../components/todo-list-with-suspense"

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<TodoListWithSuspense />} />
      <Route path="*" element={<NotFoundErrorPage />} />
    </Routes>
  )
}