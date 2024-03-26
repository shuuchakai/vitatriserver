import Goal from '../goals.model.js';
import User from '../models/user.model.js';
import Action from '../models/action.model.js';

export const updateMainGoal = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        user.mainGoal = req.body.mainGoal;

        await user.save();

        res.json({ message: 'Objetivo principal actualizado con éxito' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createGoal = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        const { title, startTime, endTime, priority, action, quantity, unit } = req.body;

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const goal = new Goal({ userId: user.id, title, startTime, endTime, priority });

        await goal.save();

        const newAction = new Action({ userId: user.id, goalId: goal.id, action, quantity, unit });

        await newAction.save();

        res.status(201).json({ message: 'Objetivo creado con éxito', goal });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getUserGoals = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const goals = await Goal.find({ userId: user.id });

        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateGoal = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const goal = await Goal.findById(req.params.id);

        if (!goal) {
            return res.status(404).json({ message: 'Objetivo no encontrado' });
        }

        if (goal.userId.toString() !== user.id) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        const { title, startTime, endTime, priority, action, quantity, unit } = req.body;

        goal.title = title;
        goal.startTime = startTime;
        goal.endTime = endTime;
        goal.priority = priority;

        await goal.save();

        const existingAction = await Action.findOne({ userId: user.id, goalId: goal.id });

        if (existingAction) {
            existingAction.action = action;
            existingAction.quantity = quantity;
            existingAction.unit = unit;

            await existingAction.save();
        }

        res.json({ message: 'Objetivo actualizado con éxito' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteGoal = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const goal = await Goal.findById(req.params.id);

        if (!goal) {
            return res.status(404).json({ message: 'Objetivo no encontrado' });
        }

        if (goal.userId.toString() !== user.id) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        await goal.remove();

        res.json({ message: 'Objetivo eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateGoalProgress = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const goal = await Goal.findById(req.params.id);

        if (!goal) {
            return res.status(404).json({ message: 'Objetivo no encontrado' });
        }

        if (goal.userId.toString() !== user.id) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        goal.progress = req.body.progress;

        await goal.save();

        res.json({ message: 'Progreso del objetivo actualizado con éxito' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getGoalProgress = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const goal = await Goal.findById(req.params.id);

        if (!goal) {
            return res.status(404).json({ message: 'Objetivo no encontrado' });
        }

        if (goal.userId.toString() !== user.id) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        res.json({ progress: goal.progress });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};