import { Routes } from "react-router"
import { Route } from "react-router"
import { NotFoundErrorPage } from "./pages/errors/not-found/not-found-error-page"
import { TodoList } from "./home-page"

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<TodoList />} />
      <Route path="*" element={<NotFoundErrorPage />} />
    </Routes>
  )
}