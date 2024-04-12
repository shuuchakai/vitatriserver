import OpenAI from 'openai';

import Diet from '../models/diet.model.js';
import Question from '../models/questions.model.js';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export const createDiet = async (req, res) => {
    try {
        const { diet } = req.body;
        const { userId } = req.body;

        const newDiet = new Diet({
            userId,
            Lunes: diet.find(day => day.day === 'Lunes')?.meals || [],
            Martes: diet.find(day => day.day === 'Martes')?.meals || [],
            Miércoles: diet.find(day => day.day === 'Miércoles')?.meals || [],
            Jueves: diet.find(day => day.day === 'Jueves')?.meals || [],
            Viernes: diet.find(day => day.day === 'Viernes')?.meals || [],
            Sábado: diet.find(day => day.day === 'Sábado')?.meals || [],
            Domingo: diet.find(day => day.day === 'Domingo')?.meals || []
        });

        await newDiet.save();

        res.status(201).json({ message: 'Diet created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'There was an error creating the diet', message: error.message });
    }
};

export const getDiets = async (req, res) => {
    try {
        const { userId } = req.body;

        const diets = await Diet.find({ userId });

        res.status(200).json(diets);
    } catch (error) {
        res.status(500).json({ error: 'There was an error retrieving the diets', message: error.message });
    }
};

export const generateDiet = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await Question.findOne({ user_id: userId });

        const prompt = `Con base a los siguientes datos crea una dieta:${user.height} ${user.weight} ${user.age} ${user.biological_sex} ${user.gender} ${user.blood_type} ${user.physical_activity} ${user.schedule} ${user.preferences} ${user.allergies} ${user.diseases} ${user.medications}. QUIERO TODO EN FORMATO JSON, CON ESTA ESTRUCTURA: {"Lunes":[{"time": "07:00","ingredients":["Queso Cheddar","Naranja"],},{"time": "10:00","ingredients":["Papas","Plátano},{"time":"13:00","ingredients":["Fresas"],},{"time":"16:00","ingredients":["Tomate"],},{"time": "19:00","ingredients":["Papas","Queso Cheddar"],}],"Martes": [{"time": "01:41","ingredients":["Pan blanco"],}]} Con el resto de días obviamente, TODO EN UNA SOLA LÍNEA, SIN NINGÚN SALTO DE LÍNEA O ESPACIO, EN FORMA JSON. RECUERDA QUE ES POR INGREDIENRES, CADA UNO SEPARADO POR COMAS.`;

        const response = await openai.completions.create({
            model: 'gpt-3.5-turbo-instruct',
            prompt: prompt,
            temperature: 1,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        const diet = JSON.parse(response.choices[0].text);

        const newDiet = new Diet({
            userId, ...diet
        });

        await newDiet.save();

        res.status(201).json({ message: 'Diet created successfully', diet });
    } catch (error) {
        res.status(500).json({ error: 'There was an error creating the diet', message: error.message });
    }
}