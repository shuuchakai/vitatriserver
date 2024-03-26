import User from "../models/user.model";
import Action from "../models/action.model";
import Goal from "../models/goals.model";

export const calculateGoalProgress = async (req, res) => {
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

        const actions = await Action.find({ userId: user.id, goalId: goal.id });

        let progress = 0;

        for (let action of actions) {
            if (action.action === 'Bajar' || action.action === 'Consumir') {
                progress -= action.quantity;
            } else if (action.action === 'Incrementar') {
                progress += action.quantity;
            }
        }

        goal.progress = progress;

        await goal.save();

        res.json({ message: 'Progreso del objetivo calculado con éxito', progress });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateAction = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const action = await Action.findById(req.params.id);

        if (!action) {
            return res.status(404).json({ message: 'Acción no encontrada' });
        }

        if (action.userId.toString() !== user.id) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        action.quantity = req.body.quantity;

        await action.save();

        await calculateGoalProgress(req, res);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
