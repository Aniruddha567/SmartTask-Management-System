from flask import Blueprint, jsonify
from flask_login import login_required, current_user
import pandas as pd
import numpy as np
from app.models import Task

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('', methods=['GET'])
@login_required
def get_analytics():
    tasks = Task.query.filter_by(user_id=current_user.id).all()
    
    if not tasks:
        return jsonify({
            'total_tasks': 0,
            'completed_tasks': 0,
            'pending_tasks': 0,
            'completion_percentage': 0.0
        })

    # Use Pandas to compute analytics
    df = pd.DataFrame([t.to_dict() for t in tasks])
    
    total_tasks = len(df)
    
    # Use NumPy to count conditions efficiently
    statuses = df['status'].to_numpy()
    completed_tasks = int(np.sum(statuses == 'Completed'))
    pending_tasks = int(np.sum(statuses == 'Pending'))
    
    completion_percentage = round((completed_tasks / total_tasks) * 100, 2) if total_tasks > 0 else 0.0

    return jsonify({
        'total_tasks': total_tasks,
        'completed_tasks': completed_tasks,
        'pending_tasks': pending_tasks,
        'completion_percentage': completion_percentage
    }), 200
