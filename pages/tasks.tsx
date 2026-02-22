import { useEffect, useState } from 'react';
import { TaskItem, TaskCreateDto } from '../types';
import { tasksApi } from '../services/api';
import { withAuth } from '../hooks/withAuth';
import TaskCard from '../components/TaskCard';
import TaskFormModal from '../components/TaskFormModal';

type FilterStatus = 'All' | 'ToDo' | 'InProgress' | 'Done';
type FilterPriority = 'All' | 'Low' | 'Medium' | 'High';

function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<TaskItem | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('All');
  const [filterPriority, setFilterPriority] = useState<FilterPriority>('All');
  const [search, setSearch] = useState('');

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await tasksApi.getAll();
      setTasks(data);
    } catch {
      setError('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTasks(); }, []);

  const handleSave = async (dto: TaskCreateDto) => {
    if (editTask) {
      await tasksApi.update(editTask.id, dto);
    } else {
      await tasksApi.create(dto);
    }
    await loadTasks();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this task?')) return;
    await tasksApi.delete(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const openCreate = () => { setEditTask(null); setShowModal(true); };
  const openEdit = (task: TaskItem) => { setEditTask(task); setShowModal(true); };

  const filtered = tasks.filter((t) => {
    if (filterStatus !== 'All' && t.status !== filterStatus) return false;
    if (filterPriority !== 'All' && t.priority !== filterPriority) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) &&
        !t.category.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 fw-bold mb-0">My Tasks
          <span className="badge bg-primary ms-2 fs-6">{tasks.length}</span>
        </h1>
        <button className="btn btn-primary" onClick={openCreate}>+ New Task</button>
      </div>

      {/* Filters */}
      <div className="row g-2 mb-4">
        <div className="col-12 col-md-4">
          <input className="form-control" placeholder="Search by title or category..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="col-6 col-md-3">
          <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}>
            <option value="All">All Statuses</option>
            <option value="ToDo">To Do</option>
            <option value="InProgress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <div className="col-6 col-md-3">
          <select className="form-select" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value as FilterPriority)}>
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        {(filterStatus !== 'All' || filterPriority !== 'All' || search) && (
          <div className="col-auto">
            <button className="btn btn-outline-secondary" onClick={() => { setFilterStatus('All'); setFilterPriority('All'); setSearch(''); }}>
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-5 text-muted">
          <p className="fs-5">No tasks found.</p>
          <button className="btn btn-primary" onClick={openCreate}>Create your first task</button>
        </div>
      )}
      {!loading && filtered.length > 0 && (
        <div className="row g-3">
          {filtered.map((task) => (
            <div key={task.id} className="col-12 col-sm-6 col-lg-4">
              <TaskCard task={task} onEdit={openEdit} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <TaskFormModal task={editTask} onSave={handleSave} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

export default withAuth(TasksPage);
