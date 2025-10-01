import { useSelector, useDispatch } from "react-redux";
import "../resources/custom.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import AddModal from "../modals/AddModal";
import ChangeModal from "../modals/ChangeModal";
import {
  asyncSetIsTodoDelete,
  asyncSetTodo,
  asyncSetTodos,
  setIsTodoActionCreator,
  setIsTodoDeleteActionCreator,
} from "../states/action";
import { formatDate, showConfirmDialog } from "../../../helpers/toolsHelper";
import ChangeCoverModal from "../modals/ChangeCoverModal";

function DetailPage() {
  const { todoId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showChangeCoverModal, setShowChangeCoverModal] = useState(false);

  // Ambil data dari reducer
  const profile = useSelector((state) => state.profile);
  const todo = useSelector((state) => state.todo);
  const isTodo = useSelector((state) => state.isTodo);

  // 1. Ambil data todo sesuai todoId
  useEffect(() => {
    if (todoId) {
      dispatch(asyncSetTodo(todoId));
    }
  }, [todoId]);

  // Periksa apakah pengabilan data todo sudah selesai
  useEffect(() => {
    if (isTodo) {
      dispatch(setIsTodoActionCreator(false));
      if (!todo) {
        navigate("/todos");
      }
    }
  });

  if (!profile || !todo) return;

  return (
    <>
      {/* <!-- Main Content --> */}
      <div className="main-content">
        <div className="container-fluid mt-3">
          <div className="d-flex">
            <div className="flex-fill">
              <h2>
                {todo.title}
                {todo.is_finished ? (
                  <span className="badge bg-success ms-2">Selesai</span>
                ) : (
                  <span className="badge bg-warning ms-2">Proses</span>
                )}
              </h2>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-warning"
                onClick={() => setShowChangeCoverModal(true)}
              >
                <i className="bi bi-image"></i> Ubah Cover
              </button>
            </div>
          </div>
          <hr />

          <div className="card">
            <div className="card-body">
              {todo.cover ? (
                <div>
                  <img width="100%" src={todo.cover} alt="Cover Todo" />
                </div>
              ) : null}

              {todo.description}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ChangeCoverModal
        show={showChangeCoverModal}
        onClose={() => setShowChangeCoverModal(false)}
        todo={todo}
      />
    </>
  );
}

export default DetailPage;
