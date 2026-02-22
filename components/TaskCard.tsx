import { TaskItem } from '../types';

interface Props {
  task: TaskItem;
  onEdit: (task: TaskItem) => void;
  onDelete: (id: number) => void;
}

const priorityBadge: Record<string, string> = {
  Low: 'bg-success',
  Medium: 'bg-warning text-dark',
  High: 'bg-danger',
};

const statusBadge: Record<string, string> = {
  ToDo: 'bg-secondary',
  InProgress: 'bg-info text-dark',
  Done: 'bg-success',
};

const statusLabel: Record<string, string> = {
  ToDo: 'To Do',
  InProgress: 'In Progress',
  Done: 'Done',
};

export default function TaskCard({ task, onEdit, onDelete }: Props) {
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0 me-2">{task.title}</h5>
          <span className={`badge ${priorityBadge[task.priority] || 'bg-secondary'} text-nowrap`}>
            {task.priority}
          </span>
        </div>

        {task.description && (
          <p className="card-text text-muted small flex-grow-1">{task.description}</p>
        )}

        <div className="mt-auto">
          <div className="d-flex flex-wrap gap-2 mb-2">
            <span className={`badge ${statusBadge[task.status] || 'bg-secondary'}`}>
              {statusLabel[task.status] || task.status}
            </span>
            {task.category && (
              <span className="badge bg-light text-dark border">{task.category}</span>
            )}
          </div>

          {task.dueDate && (
            <p className="text-muted small mb-2">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
          )}

          <div className="d-flex gap-2">
            <button className="btn btn-outline-primary btn-sm flex-fill" onClick={() => onEdit(task)}>
              Edit
            </button>
            <button className="btn btn-outline-danger btn-sm flex-fill" onClick={() => onDelete(task.id)}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
