from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Task

tasks_bp = Blueprint('tasks', __name__)

def emit_update(action, task_data):
    from app import socketio
    socketio.emit('task_update', {'action': action, 'task': task_data})

@tasks_bp.route('', methods=['GET'])
@login_required
def get_tasks():
    tasks = Task.query.filter_by(user_id=current_user.id).order_by(Task.created_date.desc()).all()
    return jsonify([task.to_dict() for task in tasks]), 200

@tasks_bp.route('', methods=['POST'])
@login_required
def add_task():
    data = request.get_json()
    new_task = Task(
        title=data.get('title'),
        description=data.get('description'),
        priority=data.get('priority', 'Medium'),
        status=data.get('status', 'Pending'),
        user_id=current_user.id
    )
    db.session.add(new_task)
    db.session.commit()
    
    task_dict = new_task.to_dict()
    emit_update('create', task_dict)
    
    return jsonify(task_dict), 201

@tasks_bp.route('/<int:task_id>', methods=['PUT'])
@login_required
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    if task.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json()
    task.title = data.get('title', task.title)
    task.description = data.get('description', task.description)
    task.priority = data.get('priority', task.priority)
    task.status = data.get('status', task.status)
    
    db.session.commit()
    
    task_dict = task.to_dict()
    emit_update('update', task_dict)
    
    return jsonify(task_dict), 200

@tasks_bp.route('/<int:task_id>', methods=['DELETE'])
@login_required
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    if task.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    db.session.delete(task)
    db.session.commit()
    
    emit_update('delete', {'id': task_id})
    
    return jsonify({'message': 'Task deleted successfully'}), 200
