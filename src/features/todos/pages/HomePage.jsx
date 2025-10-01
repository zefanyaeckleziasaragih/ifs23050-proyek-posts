import { useSelector, useDispatch } from "react-redux";
import "../resources/custom.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AddModal from "../modals/AddModal";
import ChangeModal from "../modals/ChangeModal";
import {
  asyncSetIsTodoDelete,
  asyncSetTodos,
  setIsTodoDeleteActionCreator,
} from "../states/action";
import { formatDate, showConfirmDialog } from "../../../helpers/toolsHelper";

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Ambil data dari reducer
  const profile = useSelector((state) => state.profile);
  const todos = useSelector((state) => state.todos);
  const isTodoDeleted = useSelector((state) => state.isTodoDeleted);

  const [filter, changeFilter] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);

  const [showChangeModal, setShowChangeModal] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState(null);

  // Ambil data todos
  useEffect(() => {
    dispatch(asyncSetTodos(filter));
  }, [filter]);

  // Jika todo berhasil dihapus, perbarui daftar todos
  useEffect(() => {
    if (isTodoDeleted) {
      dispatch(setIsTodoDeleteActionCreator(false));
      dispatch(asyncSetTodos());
    }
  }, [isTodoDeleted]);

  if (!profile) return;

  function handleDeleteTodo(todoId) {
    // Gunakan
    const confirmDelete = showConfirmDialog(
      "Apakah Anda yakin ingin menghapus todo ini?"
    );
    confirmDelete.then((result) => {
      if (result.isConfirmed) {
        dispatch(asyncSetIsTodoDelete(todoId));
      }
    });
  }

  return (
    <>
      {/* <!-- Main Content --> */}
      <div className="main-content">
        <div className="container-fluid mt-3">
          <h2>Beranda</h2>
          <hr />
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <h5 className="card-title">Jumlah Todo</h5>
                  <h2 className="card-text">{todos.length}</h2>
                  <i
                    className="bi bi-list-check opacity-50 position-absolute bottom-0 end-0 pe-3"
                    style={{ fontSize: "3rem" }}
                  ></i>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <h5 className="card-title">Todo Selesai</h5>
                  <h2 className="card-text">
                    {todos.filter((todo) => todo.is_finished).length}
                  </h2>
                  <i
                    className="bi bi-check-circle opacity-50 position-absolute bottom-0 end-0 pe-3"
                    style={{ fontSize: "3rem" }}
                  ></i>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card bg-warning text-dark">
                <div className="card-body">
                  <h5 className="card-title">Todo Proses</h5>
                  <h2 className="card-text">
                    {todos.filter((todo) => !todo.is_finished).length}
                  </h2>
                  <i
                    className="bi bi-hourglass-split opacity-50 position-absolute bottom-0 end-0 pe-3"
                    style={{ fontSize: "3rem" }}
                  ></i>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="d-flex">
                <div className="flex-fill">
                  <h4 className="pt-1">Daftar Todo</h4>
                </div>
                <div>
                  <div className="input-group">
                    <span className="input-group-text">Filter</span>
                    <select
                      className="form-select"
                      value={filter}
                      onChange={(e) => changeFilter(e.target.value)}
                    >
                      <option value="">Semua</option>
                      <option value="1">Selesai</option>
                      <option value="0">Proses</option>
                    </select>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setShowAddModal(true)}
                    >
                      <i className="bi bi-plus"></i> Tambah
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th className="text-center">ID</th>
                    <th>Judul</th>
                    <th>Tanggal Dibuat</th>
                    <th>Tanggal Diubah</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {todos.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center">
                        Belum ada data todo yang tersedia.
                      </td>
                    </tr>
                  )}
                  {todos.map((todo) => (
                    <tr key={`todo-${todo.id}`}>
                      <td className="text-center">{todo.id}</td>
                      <td>{todo.title}</td>
                      <td>{formatDate(todo.created_at)}</td>
                      <td>{formatDate(todo.updated_at)}</td>
                      <td>
                        <span
                          className={`badge bg-${
                            todo.is_finished ? "success" : "warning"
                          }`}
                        >
                          {todo.is_finished ? "Selesai" : "Proses"}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button type="button" className="btn btn-info">
                            <i
                              className="bi bi-eye"
                              onClick={() => navigate(`/todos/${todo.id}`)}
                            ></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-warning"
                            onClick={() => {
                              setSelectedTodoId(todo.id);
                              setShowChangeModal(true);
                            }}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="btn btn-danger"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AddModal show={showAddModal} onClose={() => setShowAddModal(false)} />
      <ChangeModal
        show={showChangeModal}
        onClose={() => setShowChangeModal(false)}
        todoId={selectedTodoId}
      />
    </>
  );
}

export default HomePage;
