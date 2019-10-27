import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .integer()
        .positive()
        .required(),
      price: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const alreadyExist = await Plan.findOne({
      where: { title: req.body.title, active: true },
    });

    if (alreadyExist) {
      return res.status(400).json({ error: 'Plan already exists' });
    }

    const { id, title, duration, price } = await Plan.create(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const plans = await Plan.findAll({
      where: { active: true },
      attributes: ['id', 'title', 'duration', 'price'],
      limit: 20,
      offset: (page - 1) * 20,
      order: ['duration'],
    });

    return res.json(plans);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number()
        .integer()
        .positive(),
      price: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const plan = await Plan.findByPk(req.params.planId);

    if (!plan || !plan.active) {
      return res.status(400).json({ error: 'Plan not found' });
    }

    const { id, title, duration, price } = await plan.update(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async delete(req, res) {
    const plan = await Plan.findByPk(req.params.planId);

    if (!plan || !plan.active) {
      return res.status(400).json({ error: 'Plan not found' });
    }

    plan.active = false;

    await plan.save();

    return res.json(plan);
  }
}

export default new PlanController();
