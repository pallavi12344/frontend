import { useEffect, useState } from 'react';
import { TaskCreateDto, TaskItem } from '../types';

interface Props {
  task: TaskItem | null;
  onSave: (dto: TaskCreateDto) => Promise<void>;
  onClose: () => void;
}

const emptyForm: TaskCreateDto = {
  title: '',
  description: '',
  dueDate: null,
  priority: 'Medium',
  status: 'ToDo',
  category: '',
};

export default function TaskFormModal({ task, onSave, onClose }: Props) {
  const [form, setForm] = useState<TaskCreateDto>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate ? task.dueDate.substring(0, 10) : null,
        priority: task.priority,
        status: task.status,
        category: task.category,
      });
    } else {
      setForm(emptyForm);
    }
    setError('');
  }, [task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value === '' ? null : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required.'); return; }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch {
      setError('Failed to save task. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="modal show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">{task ? 'Edit Task' : 'New Task'}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={onClose} />
              </div>
              <div className="modal-body">
                {error && <div className="alert alert-danger py-2">{error}</div>}

                <div className="mb-3">
                  <label className="form-label fw-semibold">Title *</label>
                  <input name="title" className="form-control" value={form.title} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea name="description" className="form-control" rows={3} value={form.description} onChange={handleChange} />
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Priority</label>
                    <select name="priority" className="form-select" value={form.priority} onChange={handleChange}>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Status</label>
                    <select name="status" className="form-select" value={form.status} onChange={handleChange}>
                      <option value="ToDo">To Do</option>
                      <option value="InProgress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3 mb-3">
                  <label className="form-label fw-semibold">Due Date</label>
                  <input name="dueDate" type="date" className="form-control"
                    value={form.dueDate || ''} onChange={handleChange} />
                </div>

                <div className="mb-1">
                  <label className="form-label fw-semibold">Category / Tag</label>
                  <input name="category" className="form-control" placeholder="e.g. Work, Personal"
                    value={form.category} onChange={handleChange} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : task ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" onClick={onClose} />
    </>
  );
}
